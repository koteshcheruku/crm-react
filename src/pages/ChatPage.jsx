import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Phone, Settings, Paperclip, Send, Mic, MessageSquare, Check, CheckCheck, Users, Plus, UserPlus, Info } from 'lucide-react';
import { card, input, pill } from '../components/ui/styles';
import api from '../lib/api';
import logger from '../lib/logger';
import { Client } from '@stomp/stompjs';

// ─── Message Status Ticks (WhatsApp-style) ────────────────────────────────────
const MessageStatus = ({ status, isMe }) => {
    if (!isMe) return null;
    const base = 'ml-1 inline shrink-0';
    if (status === 'READ')
        return <CheckCheck size={14} className={`${base} text-blue-400`} />;
    if (status === 'DELIVERED')
        return <CheckCheck size={14} className={`${base} text-[#667781] dark:text-[#8696a0]`} />;
    // SENT
    return <Check size={14} className={`${base} text-[#667781] dark:text-[#8696a0]`} />;
};

// ─── Online dot ───────────────────────────────────────────────────────────────
const OnlineDot = ({ status, className = '' }) => (
    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'} ${className}`} />
);

export const ChatPage = () => {
    const [selectedChat, setSelectedChat] = useState(null);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [activeTab, setActiveTab] = useState('contacts'); // 'contacts' or 'teams'
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [users, setUsers] = useState([]);
    const [teams, setTeams] = useState([]);
    const [isCreateTeamModalOpen, setIsCreateTeamModalOpen] = useState(false);
    const [teamForm, setTeamForm] = useState({ name: '', memberIds: [] });

    // Remove role guard from ChatPage (not needed here)
    const [stompClient, setStompClient] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [connected, setConnected] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [typingText, setTypingText] = useState('');
    const [lastSeen, setLastSeen] = useState({});  // { username -> timestamp }
    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const selectedChatRef = useRef(null);
    const currentUserRef = useRef(null);  // ref so WS closure always reads latest value

    // Derive online status purely from message timestamps (not from user.status / UsersLogs)
    // A user is "online" if they sent a message in the last 5 minutes
    const ONLINE_THRESHOLD_MS = 5 * 60 * 1000;
    const isOnline = (username) => {
        const ts = lastSeen[username];
        if (!ts) return false;
        return Date.now() - new Date(ts).getTime() < ONLINE_THRESHOLD_MS;
    };

    // keep ref in sync so STOMP callbacks can access latest selectedChat / currentUser
    useEffect(() => { selectedChatRef.current = selectedChat; }, [selectedChat]);
    useEffect(() => { currentUserRef.current = currentUser; }, [currentUser]);

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Update lastSeen map whenever messages change
    useEffect(() => {
        if (messages.length === 0) return;
        setLastSeen(prev => {
            const updated = { ...prev };
            messages.forEach(msg => {
                if (!msg.timestamp) return;
                const existing = updated[msg.sender];
                if (!existing || new Date(msg.timestamp) > new Date(existing)) {
                    updated[msg.sender] = msg.timestamp;
                }
            });
            return updated;
        });
    }, [messages]);

    // Decode JWT + load users/teams
    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        let username = '';
        if (accessToken) {
            try {
                const payload = JSON.parse(atob(accessToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
                username = payload.employeeUsername || payload.sub;
                setCurrentUser(username);
            } catch (e) {
                logger.error('Failed to parse token', e);
            }
        }
        api.get('/users')
            .then(res => setUsers((res.data || []).filter(u => u.username !== username)))
            .catch(err => logger.error('Failed to fetch users', err));

        api.get('/teams')
            .then(res => setTeams(res.data || []))
            .catch(err => logger.error('Failed to fetch teams', err));
    }, []);

    // WebSocket connection
    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) return;

        const client = new Client({
            brokerURL: 'ws://localhost:8080/ws-native',
            connectHeaders: { Authorization: accessToken },
            reconnectDelay: 5000,
            onConnect: () => {
                setConnected(true);

                // ── Subscribe: incoming chat messages ──
                // ── Subscribe: message status updates (delivered/read) ──
                client.subscribe('/user/queue/messageStatus', (frame) => {
                    const updatedMsg = JSON.parse(frame.body);
                    setMessages(prev => prev.map(m => (m.id === updatedMsg.id ? { ...m, status: updatedMsg.status } : m)));
                });
                client.subscribe('/user/queue/chat', (frame) => {
                    const msg = JSON.parse(frame.body);
                    setMessages(prev => {
                        if (msg.id != null && prev.some(m => m.id === msg.id)) return prev;
                        return [...prev, msg];
                    });
                    // Auto-acknowledge delivery when we receive a message from someone else
                    if (msg.sender !== currentUserRef.current) {
                        client.publish({
                            destination: '/app/msgDelivered',
                            body: JSON.stringify(msg)
                        });
                    }
                });

                // ── Subscribe: typing indicator — backend sends TypingDto JSON ──
                client.subscribe('/user/queue/typing', (frame) => {
                    try {
                        const dto = JSON.parse(frame.body);
                        setTypingText(`${dto.sender} is typing...`);
                    } catch {
                        setTypingText(frame.body); // fallback for plain text
                    }
                    clearTimeout(typingTimeoutRef.current);
                    typingTimeoutRef.current = setTimeout(() => setTypingText(''), 2500);
                });

                // ── Subscribe: Team messages ──
                client.subscribe('/topic/team/+', (frame) => {
                    const msg = JSON.parse(frame.body);
                    // Filter: if we are viewing this team, add to list
                    if (selectedChatRef.current?.isTeam && selectedChatRef.current.id === msg.teamId) {
                        setMessages(prev => {
                            if (msg.id != null && prev.some(m => m.id === msg.id)) return prev;
                            return [...prev, msg];
                        });
                    }
                });
            },
            onDisconnect: () => { setConnected(false); setTypingText(''); },
            onStompError: (frame) => { logger.error('STOMP error:', frame.headers['message']); setConnected(false); },
            onWebSocketError: (ev) => { logger.error('WS error', ev); setConnected(false); }
        });
        client.activate();
        setStompClient(client);
        return () => { clearTimeout(typingTimeoutRef.current); client.deactivate(); };
    }, []);

    // Load history when selection changes
    useEffect(() => {
        setTypingText('');
        if (!currentUser) return;

        if (selectedChat) {
            if (selectedChat.isTeam) {
                api.get(`/chat/team-history/${selectedChat.id}`)
                    .then(res => setMessages(res.data || []))
                    .catch(err => {
                        logger.error('Team history fetch failed', err);
                        setMessages([]);
                    });
            } else {
                api.get(`/chat/history?user1=${currentUser}&user2=${selectedChat.username}`)
                    .then(res => {
                        const msgs = res.data || [];
                        setMessages(msgs);
                        if (stompClient?.connected) {
                            msgs
                                .filter(m => m.sender === selectedChat.username && m.status !== 'READ')
                                .forEach(m => {
                                    stompClient.publish({
                                        destination: '/app/msgRead',
                                        body: JSON.stringify(m)
                                    });
                                });
                        }
                    })
                    .catch(err => {
                        logger.error('History fetch failed', err);
                        setMessages([]);
                    });
            }
        } else {
            setMessages([]);
        }
    }, [selectedChat, currentUser, stompClient]);

    // Send message
    const handleSendMessage = useCallback(() => {
        if (!newMessage.trim() || !selectedChat || !stompClient?.connected) return;
        
        const payload = {
            sender: currentUser,
            content: newMessage.trim(),
            timestamp: new Date().toISOString()
        };

        if (selectedChat.isTeam) {
            stompClient.publish({
                destination: `/app/teamChat/${selectedChat.id}`,
                body: JSON.stringify(payload)
            });
        } else {
            stompClient.publish({
                destination: '/app/api/chat',
                body: JSON.stringify({
                    ...payload,
                    receiver: selectedChat.username
                })
            });
        }
        setNewMessage('');
    }, [newMessage, selectedChat, stompClient, currentUser]);

    // Typing indicator — throttled publish
    const handleTyping = useCallback((e) => {
        setNewMessage(e.target.value);
        if (!stompClient?.connected || !selectedChat || !currentUser || selectedChat.isTeam) return;
        stompClient.publish({
            destination: '/app/typing',
            body: JSON.stringify({ sender: currentUser, receiver: selectedChat.username })
        });
    }, [stompClient, selectedChat, currentUser]);

    const handleCreateTeam = async () => {
        if (!teamForm.name || teamForm.memberIds.length === 0) return;
        try {
            const res = await api.post('/teams', teamForm);
            setTeams(prev => [...prev, res.data]);
            setIsCreateTeamModalOpen(false);
            setTeamForm({ name: '', memberIds: [] });
        } catch (err) {
            logger.error('Failed to create team', err);
        }
    };

    const toggleMember = (id) => {
        setTeamForm(prev => {
            const memberIds = prev.memberIds.includes(id)
                ? prev.memberIds.filter(mid => mid !== id)
                : [...prev.memberIds, id];
            return { ...prev, memberIds };
        });
    };

    const filteredUsers = users.filter(u =>
        u.fullname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.username?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto h-[calc(100vh-120px)]">
            <div className="flex gap-0 h-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-lg">

                {/* ── Contacts List ── */}
                <div className="w-80 bg-white dark:bg-[#111b21] flex flex-col border-r border-slate-200 dark:border-[#2a3942]">
                    {/* Header */}
                    <div className="px-4 py-4 flex flex-col gap-3 bg-[#f0f2f5] dark:bg-[#202c33]">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                    {currentUser?.charAt(0).toUpperCase()}
                                </div>
                                <span className="font-semibold text-slate-900 dark:text-[#e9edef] truncate text-sm">{currentUser}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <OnlineDot status={connected ? 'Active' : 'Inactive'} />
                                <span className="text-xs text-slate-500 dark:text-[#8696a0]">{connected ? 'Online' : 'Offline'}</span>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex bg-white dark:bg-[#111b21] rounded-lg p-1 border border-slate-200 dark:border-[#2a3942]">
                            <button
                                onClick={() => setActiveTab('contacts')}
                                className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-semibold rounded-md transition ${activeTab === 'contacts' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                            >
                                <MessageSquare size={14} /> Contacts
                            </button>
                            <button
                                onClick={() => setActiveTab('teams')}
                                className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-semibold rounded-md transition ${activeTab === 'teams' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                            >
                                <Users size={14} /> Teams
                            </button>
                        </div>
                    </div>

                    {/* Search / Add */}
                    <div className="px-3 py-2 bg-white dark:bg-[#111b21] flex items-center gap-2">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder={activeTab === 'contacts' ? "Search contacts..." : "Search teams..."}
                            className="flex-1 px-4 py-2 rounded-lg bg-[#f0f2f5] dark:bg-[#202c33] text-sm focus:outline-none text-slate-900 dark:text-[#d1d7db] placeholder-slate-500 dark:placeholder-[#8696a0]"
                        />
                        {activeTab === 'teams' && (
                            <button
                                onClick={() => setIsCreateTeamModalOpen(true)}
                                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
                                title="Create New Team"
                            >
                                <Plus size={18} />
                            </button>
                        )}
                    </div>

                    {/* List */}
                    <div className="flex-1 overflow-y-auto">
                        {activeTab === 'contacts' ? (
                            filteredUsers.map(u => (
                                <button
                                    key={u.id}
                                    onClick={() => { setSelectedChat(u); setTypingText(''); }}
                                    className={`w-full text-left px-4 py-3 border-b border-slate-100 dark:border-[#2a3942]/50 hover:bg-[#f5f6f6] dark:hover:bg-[#2a3942] transition-colors flex items-center gap-3 ${selectedChat?.id === u.id && !selectedChat.isTeam ? 'bg-[#f0f2f5] dark:bg-[#2a3942]' : ''}`}
                                >
                                    <div className="relative shrink-0">
                                        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-lg">
                                            {u.fullname?.charAt(0).toUpperCase()}
                                        </div>
                                        <OnlineDot status={isOnline(u.username) ? 'Active' : 'Inactive'} className="absolute bottom-0 right-0 ring-2 ring-white dark:ring-[#111b21]" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-semibold text-[#111b21] dark:text-[#e9edef] truncate text-sm">{u.fullname}</h3>
                                            <span className="text-xs text-slate-400 dark:text-[#8696a0] ml-2 shrink-0">{isOnline(u.username) ? 'online' : 'offline'}</span>
                                        </div>
                                        <p className="text-xs text-slate-500 dark:text-[#8696a0] truncate">@{u.username}</p>
                                    </div>
                                </button>
                            ))
                        ) : (
                            teams.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase())).map(t => (
                                <button
                                    key={t.id}
                                    onClick={() => { setSelectedChat({ ...t, isTeam: true }); setTypingText(''); }}
                                    className={`w-full text-left px-4 py-3 border-b border-slate-100 dark:border-[#2a3942]/50 hover:bg-[#f5f6f6] dark:hover:bg-[#2a3942] transition-colors flex items-center gap-3 ${selectedChat?.id === t.id && selectedChat.isTeam ? 'bg-[#f0f2f5] dark:bg-[#2a3942]' : ''}`}
                                >
                                    <div className="relative shrink-0">
                                        <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-lg">
                                            <Users size={24} />
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-semibold text-[#111b21] dark:text-[#e9edef] truncate text-sm">{t.name}</h3>
                                            <span className="text-xs text-slate-400 dark:text-[#8696a0] ml-2 shrink-0">{t.memberIds?.length || 0} members</span>
                                        </div>
                                        <p className="text-xs text-slate-500 dark:text-[#8696a0] truncate">Group Channel</p>
                                    </div>
                                </button>
                            ))
                        )}
                        {(activeTab === 'contacts' ? filteredUsers : teams).length === 0 && (
                            <div className="p-8 text-center text-slate-400 dark:text-[#8696a0] text-sm">Nothing found.</div>
                        )}
                    </div>
                </div>

                {/* ── Chat Window ── */}
                {selectedChat ? (
                    <div className="flex-1 flex flex-col bg-white dark:bg-[#0b141a]">
                        {/* Header */}
                        <div className="h-16 flex items-center justify-between px-6 bg-[#f0f2f5] dark:bg-[#202c33] border-b border-slate-200 dark:border-[#2a3942] shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${selectedChat.isTeam ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                                        {selectedChat.isTeam ? <Users size={20} /> : selectedChat.fullname?.charAt(0).toUpperCase()}
                                    </div>
                                    {!selectedChat.isTeam && (
                                        <OnlineDot status={isOnline(selectedChat.username) ? 'Active' : 'Inactive'} className="absolute bottom-0 right-0 ring-2 ring-[#f0f2f5] dark:ring-[#202c33]" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-[#111b21] dark:text-[#e9edef] text-sm">{selectedChat.isTeam ? selectedChat.name : selectedChat.fullname}</h3>
                                    <p className="text-xs text-slate-500 dark:text-[#8696a0]">
                                        {selectedChat.isTeam ? (
                                            `${selectedChat.memberIds?.length || 0} members`
                                        ) : typingText ? (
                                            <span className="text-emerald-500 italic">{typingText}</span>
                                        ) : isOnline(selectedChat.username) ? (
                                            'online'
                                        ) : lastSeen[selectedChat.username] ? (
                                            `last seen ${new Date(lastSeen[selectedChat.username]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                                        ) : (
                                            'offline'
                                        )}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-1">
                                <button className="p-2 hover:bg-[#e9edef] dark:hover:bg-[#374045] rounded-full transition-colors">
                                    <Phone size={20} className="text-[#54656f] dark:text-[#aebac1]" />
                                </button>
                                <button className="p-2 hover:bg-[#e9edef] dark:hover:bg-[#374045] rounded-full transition-colors">
                                    <Settings size={20} className="text-[#54656f] dark:text-[#aebac1]" />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-1.5 bg-[#efeae2] dark:bg-[#0b141a]">
                            {messages.map((msg, index) => {
                                const isMe = msg.sender === currentUser;
                                const showDate = index === 0 ||
                                    new Date(messages[index - 1].timestamp).toDateString() !== new Date(msg.timestamp).toDateString();
                                return (
                                    <React.Fragment key={index}>
                                        {showDate && (
                                            <div className="flex justify-center my-3">
                                                <span className="bg-white dark:bg-[#182229] text-[#54656f] dark:text-[#8696a0] text-xs px-3 py-1 rounded-full shadow-sm">
                                                    {new Date(msg.timestamp).toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
                                                </span>
                                            </div>
                                        )}
                                        <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[72%] px-3 py-2 rounded-lg shadow-sm text-sm ${isMe
                                                ? 'bg-[#d9fdd3] dark:bg-[#005c4b] text-[#111b21] dark:text-[#e9edef] rounded-tr-none'
                                                : 'bg-white dark:bg-[#202c33] text-[#111b21] dark:text-[#e9edef] rounded-tl-none'
                                                }`}>
                                                {selectedChat.isTeam && !isMe && (
                                                    <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mb-0.5">{msg.sender}</p>
                                                )}
                                                <p className="leading-relaxed break-words">{msg.content}</p>
                                                <div className="flex items-center justify-end gap-0.5 mt-1">
                                                    <span className="text-[11px] text-[#667781] dark:text-[#8696a0]">
                                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                    <MessageStatus status={msg.status} isMe={isMe} />
                                                </div>
                                            </div>
                                        </div>
                                    </React.Fragment>
                                );
                            })}
                            {messages.length === 0 && (
                                <div className="h-full flex items-center justify-center pt-20">
                                    <div className="bg-[#fff3d6] dark:bg-[#182229] text-[#54656f] dark:text-[#8696a0] px-5 py-2.5 rounded-lg text-xs text-center max-w-xs shadow-sm">
                                        🔒 Messages are end-to-end encrypted.
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-3 bg-[#f0f2f5] dark:bg-[#202c33] shrink-0">
                            <div className="flex items-center gap-2">
                                <button className="p-2.5 text-[#54656f] dark:text-[#8696a0] hover:bg-[#e9edef] dark:hover:bg-[#374045] rounded-full transition-colors">
                                    <Paperclip size={22} />
                                </button>
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={handleTyping}
                                    onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                                    placeholder={connected ? 'Type a message' : 'Connecting...'}
                                    disabled={!connected}
                                    className="flex-1 px-4 py-2.5 bg-white dark:bg-[#2a3942] rounded-lg text-sm focus:outline-none text-[#111b21] dark:text-[#d1d7db] placeholder-[#8696a0] shadow-sm disabled:opacity-50"
                                />
                                {newMessage.trim() ? (
                                    <button onClick={handleSendMessage} className="p-2.5 text-[#00a884] hover:text-[#06cf9c] transition-colors">
                                        <Send size={22} />
                                    </button>
                                ) : (
                                    <button className="p-2.5 text-[#54656f] dark:text-[#8696a0] hover:bg-[#e9edef] dark:hover:bg-[#374045] rounded-full transition-colors">
                                        <Mic size={22} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    /* ── Empty state ── */
                    <div className="flex-1 flex flex-col items-center justify-center bg-[#f8f9fa] dark:bg-[#222e35] text-[#41525d] dark:text-[#8696a0] border-l border-slate-200 dark:border-[#2a3942]">
                        <div className="w-32 h-32 rounded-full bg-[#dfe5e7] dark:bg-[#374045] flex items-center justify-center mb-8">
                            <MessageSquare size={56} className="opacity-40" />
                        </div>
                        <h2 className="text-2xl font-light mb-3 text-[#41525d] dark:text-[#e9edef]">CRM Team Chat</h2>
                        <p className="text-sm text-center max-w-sm leading-relaxed px-8">
                            Select a team member from the left to start chatting in real time.
                        </p>
                        <div className={`mt-6 flex items-center gap-2 text-xs px-4 py-2 rounded-full ${connected ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' : 'bg-orange-50 dark:bg-orange-900/20 text-orange-600'}`}>
                            <span className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-500' : 'bg-orange-500'}`}></span>
                            {connected ? 'Connected to server' : 'Connecting to server...'}
                        </div>
                    </div>
                )}
            </div>

            {/* Create Team Modal */}
            {isCreateTeamModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md border border-slate-200 dark:border-slate-800 overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Create New Team</h2>
                            <button onClick={() => setIsCreateTeamModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition"><X size={18} /></button>
                        </div>
                        <div className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Team Name</label>
                                <input
                                    className={input}
                                    placeholder="e.g. Sales Team Alpha"
                                    value={teamForm.name}
                                    onChange={e => setTeamForm(f => ({ ...f, name: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex justify-between">
                                    Select Members <span>{teamForm.memberIds.length} selected</span>
                                </label>
                                <div className="max-h-48 overflow-y-auto border border-slate-100 dark:border-slate-800 rounded-xl divide-y divide-slate-50 dark:divide-slate-800">
                                    {users.map(u => (
                                        <button
                                            key={u.id}
                                            onClick={() => toggleMember(u.username)}
                                            className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition ${teamForm.memberIds.includes(u.username) ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                                        >
                                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition ${teamForm.memberIds.includes(u.username) ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'}`}>
                                                {teamForm.memberIds.includes(u.username) && <Check size={14} />}
                                            </div>
                                            <div className="flex-1 text-left min-w-0">
                                                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{u.fullname}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">@{u.username}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <button
                                onClick={handleCreateTeam}
                                disabled={!teamForm.name || teamForm.memberIds.length === 0}
                                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition shadow-md shadow-blue-600/20 disabled:opacity-50"
                            >
                                Create Team Channel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
