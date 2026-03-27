import React, { useState, useEffect } from 'react';
import {
    Phone, PhoneIncoming, PhoneOutgoing, PhoneMissed,
    Mail, MessageSquare, Clock, TrendingUp, Users,
    Filter, Search, CheckCircle2, AlertCircle, Calendar, ChevronRight
} from 'lucide-react';
import { card, h1cls, sub, th, td, tdbold, trRow, thead } from '../components/ui/styles';
import api from '../lib/api';

// ─── Mock data shown when backend has no /communications endpoint ──────────────
const MOCK_CALLS = [
    { id: 1, type: 'outbound', contact: 'Rajesh Kuma', user: 'alice', outcome: 'Connected', duration: '4m 12s', timestamp: '2026-03-14 10:30', notes: 'Discussed Q4 renewal' },
    { id: 2, type: 'inbound', contact: 'Priya Sharma', user: 'bob', outcome: 'Connected', duration: '2m 45s', timestamp: '2026-03-14 11:15', notes: 'Support query resolved' },
    { id: 3, type: 'missed', contact: 'Amit Verma', user: 'alice', outcome: 'Missed', duration: '—', timestamp: '2026-03-14 13:00', notes: '' },
    { id: 4, type: 'outbound', contact: 'Sunita Patel', user: 'charlie', outcome: 'Voicemail', duration: '0m 38s', timestamp: '2026-03-14 14:22', notes: 'Left voicemail re: demo' },
];

const MOCK_EMAILS = [
    { id: 1, contact: 'Rajesh Kumar', subject: 'Q4 Renewal Proposal', status: 'opened', opens: 3, clicks: 1, sentAt: '2026-03-14 09:00', user: 'alice' },
    { id: 2, contact: 'Priya Sharma', subject: 'Welcome to CRM Pro', status: 'sent', opens: 0, clicks: 0, sentAt: '2026-03-14 11:00', user: 'bob' },
    { id: 3, contact: 'Nisha Agarwal', subject: 'Follow-up: Demo Feedback', status: 'clicked', opens: 5, clicks: 3, sentAt: '2026-03-13 15:30', user: 'charlie' },
    { id: 4, contact: 'Amit Verma', subject: 'Invoice #INV-2048', status: 'bounced', opens: 0, clicks: 0, sentAt: '2026-03-13 10:15', user: 'alice' },
];

const MOCK_TIMELINE = [
    { id: 1, type: 'call', actor: 'alice', contact: 'Rajesh Kumar', description: 'Outbound call — 4m 12s. Discussed renewal.', time: '10:30 AM', date: 'Today' },
    { id: 2, type: 'email', actor: 'alice', contact: 'Rajesh Kumar', description: 'Sent "Q4 Renewal Proposal". Opened 3 times.', time: '09:00 AM', date: 'Today' },
    { id: 3, type: 'call', actor: 'bob', contact: 'Priya Sharma', description: 'Inbound call — 2m 45s. Support issue resolved.', time: '11:15 AM', date: 'Today' },
    { id: 4, type: 'email', actor: 'charlie', contact: 'Nisha Agarwal', description: 'Sent "Follow-up: Demo Feedback". Clicked 3 times.', time: '03:30 PM', date: 'Yesterday' },
    { id: 5, type: 'sms', actor: 'bob', contact: 'Sunita Patel', description: 'SMS sent: "Your demo is confirmed for 3pm tomorrow."', time: '02:00 PM', date: 'Yesterday' },
    { id: 6, type: 'meeting', actor: 'charlie', contact: 'Nisha Agarwal', description: 'Product demo call scheduled via Zoom.', time: '12:00 PM', date: 'Yesterday' },
];

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, sub, color }) => (
    <div className={`${card} flex items-center gap-5 px-6 py-5`}>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
            <Icon size={22} className="text-white" />
        </div>
        <div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{label}</p>
            {sub && <p className="text-xs text-slate-500 dark:text-slate-500 mt-0.5">{sub}</p>}
        </div>
    </div>
);

// ─── Call type icon ───────────────────────────────────────────────────────────
const CallTypeIcon = ({ type }) => {
    if (type === 'inbound') return <PhoneIncoming size={16} className="text-emerald-500" />;
    if (type === 'missed') return <PhoneMissed size={16} className="text-red-500" />;
    return <PhoneOutgoing size={16} className="text-blue-500" />;
};

// ─── Email status badge ───────────────────────────────────────────────────────
const EmailStatus = ({ status }) => {
    const map = {
        opened: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400',
        clicked: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400',
        sent: 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400',
        bounced: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400',
    };
    return <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${map[status] || map.sent}`}>{status}</span>;
};

// ─── Timeline icon ────────────────────────────────────────────────────────────
const TimelineIcon = ({ type }) => {
    const map = {
        call: { icon: Phone, bg: 'bg-blue-500' },
        email: { icon: Mail, bg: 'bg-purple-500' },
        sms: { icon: MessageSquare, bg: 'bg-emerald-500' },
        meeting: { icon: Calendar, bg: 'bg-orange-500' },
    };
    const { icon: Icon, bg } = map[type] || map.call;
    return (
        <div className={`w-9 h-9 rounded-full ${bg} flex items-center justify-center shrink-0 shadow-sm`}>
            <Icon size={16} className="text-white" />
        </div>
    );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export const CommunicationsPage = () => {
    const [activeTab, setActiveTab] = useState('timeline');
    const [calls, setCalls] = useState(MOCK_CALLS);
    const [emails, setEmails] = useState(MOCK_EMAILS);
    const [timeline, setTimeline] = useState(MOCK_TIMELINE);
    const [search, setSearch] = useState('');

    useEffect(() => {
        // Try fetching real data; fall back to mock gracefully
        api.get('/communications/calls').then(r => { if (r.data?.length) setCalls(r.data); }).catch(() => {});
        api.get('/communications/emails').then(r => { if (r.data?.length) setEmails(r.data); }).catch(() => {});
        api.get('/communications/timeline').then(r => { if (r.data?.length) setTimeline(r.data); }).catch(() => {});
    }, []);

    const tabs = [
        { id: 'timeline', label: 'Activity Timeline', icon: Clock },
        { id: 'calls', label: 'Call Logs', icon: Phone },
        { id: 'emails', label: 'Email Tracking', icon: Mail },
    ];

    const callStats = {
        total: calls.length,
        connected: calls.filter(c => c.outcome === 'Connected').length,
        missed: calls.filter(c => c.type === 'missed').length,
        avgDur: '3m 28s',
    };

    const emailStats = {
        total: emails.length,
        openRate: Math.round((emails.filter(e => e.status !== 'sent' && e.status !== 'bounced').length / emails.length) * 100) + '%',
        clickRate: Math.round((emails.filter(e => e.status === 'clicked').length / emails.length) * 100) + '%',
        bounces: emails.filter(e => e.status === 'bounced').length,
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className={h1cls}>Communications Hub</h1>
                <p className={`${sub} mb-0`}>Unified view of all customer & team interactions</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={Phone} label="Total Calls" value={callStats.total} sub={`${callStats.connected} connected`} color="bg-blue-500" />
                <StatCard icon={PhoneMissed} label="Missed Calls" value={callStats.missed} sub="Need follow-up" color="bg-red-500" />
                <StatCard icon={Mail} label="Open Rate" value={emailStats.openRate} sub={`${emailStats.total} emails sent`} color="bg-purple-500" />
                <StatCard icon={TrendingUp} label="Click Rate" value={emailStats.clickRate} sub={`${emailStats.bounces} bounced`} color="bg-emerald-500" />
            </div>

            {/* Tabs */}
            <div className="flex gap-1 border-b border-slate-200 dark:border-slate-700">
                {tabs.map(tab => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-5 py-3 font-medium text-sm border-b-2 transition-all ${activeTab === tab.id
                                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                }`}
                        >
                            <Icon size={16} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Search + Filter bar */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search contacts, users..."
                        className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                    <Filter size={15} /> Filters
                </button>
            </div>

            {/* ── Activity Timeline ── */}
            {activeTab === 'timeline' && (
                <div className={`${card} divide-y divide-slate-100 dark:divide-slate-700`}>
                    {timeline.map((item, idx) => (
                        <div key={item.id} className="flex gap-4 px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                            <TimelineIcon type={item.type} />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <p className="font-semibold text-slate-900 dark:text-white text-sm">{item.contact}</p>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">{item.description}</p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{item.time}</p>
                                        <p className="text-xs text-slate-400 dark:text-slate-500">{item.date}</p>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">by <span className="font-medium">@{item.actor}</span></p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Call Logs ── */}
            {activeTab === 'calls' && (
                <div className={`${card} overflow-hidden`}>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className={thead}>
                                    <th className={th}>Type</th>
                                    <th className={th}>Contact</th>
                                    <th className={th}>User</th>
                                    <th className={th}>Outcome</th>
                                    <th className={th}>Duration</th>
                                    <th className={th}>Time</th>
                                    <th className={th}>Notes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {calls.filter(c =>
                                    !search || c.contact?.toLowerCase().includes(search.toLowerCase()) || c.user?.toLowerCase().includes(search.toLowerCase())
                                ).map(call => (
                                    <tr key={call.id} className={trRow}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <CallTypeIcon type={call.type} />
                                                <span className="text-xs capitalize text-slate-600 dark:text-slate-400">{call.type}</span>
                                            </div>
                                        </td>
                                        <td className={tdbold}>{call.contact}</td>
                                        <td className={td}>@{call.user}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${call.outcome === 'Connected' ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400' :
                                                call.outcome === 'Missed' ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400' :
                                                    'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                                                }`}>
                                                {call.outcome === 'Connected' ? <CheckCircle2 size={11} /> : <AlertCircle size={11} />}
                                                {call.outcome}
                                            </span>
                                        </td>
                                        <td className={td}>{call.duration}</td>
                                        <td className={td}>{call.timestamp}</td>
                                        <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 max-w-[200px] truncate">{call.notes || '—'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ── Email Tracking ── */}
            {activeTab === 'emails' && (
                <div className={`${card} overflow-hidden`}>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className={thead}>
                                    <th className={th}>Contact</th>
                                    <th className={th}>Subject</th>
                                    <th className={th}>Sent By</th>
                                    <th className={th}>Status</th>
                                    <th className={th}>Opens</th>
                                    <th className={th}>Clicks</th>
                                    <th className={th}>Sent At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {emails.filter(e =>
                                    !search || e.contact?.toLowerCase().includes(search.toLowerCase()) || e.subject?.toLowerCase().includes(search.toLowerCase())
                                ).map(email => (
                                    <tr key={email.id} className={trRow}>
                                        <td className={tdbold}>{email.contact}</td>
                                        <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300 max-w-[200px] truncate">{email.subject}</td>
                                        <td className={td}>@{email.user}</td>
                                        <td className="px-6 py-4"><EmailStatus status={email.status} /></td>
                                        <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300 font-medium">{email.opens}</td>
                                        <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300 font-medium">{email.clicks}</td>
                                        <td className={td}>{email.sentAt}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};
