import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Eye, Trash2, X, Save, AlertTriangle, Mail, Copy, CheckCircle } from 'lucide-react';
import { card, h1cls, sub, th, td, tdbold, trRow, thead, pill, input } from '../components/ui/styles';
import api from '../lib/api';
import logger from '../lib/logger';

export const UserManagementPage = () => {

    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUserId, setEditingUserId] = useState(null);

    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [viewingUser, setViewingUser] = useState(null);

    // Invite link state
    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const [inviteForm, setInviteForm] = useState({ fullname: '', email: '', role: 'USER' });
    const [inviteLink, setInviteLink] = useState('');
    const [inviteLoading, setInviteLoading] = useState(false);
    const [inviteError, setInviteError] = useState('');
    const [inviteCopied, setInviteCopied] = useState(false);

    const handleSendInvite = async () => {
        setInviteError('');
        if (!inviteForm.email) { setInviteError('Email is required'); return; }
        setInviteLoading(true);
        try {
            const res = await api.post('/auth/invite', inviteForm);
            setInviteLink(res.data.inviteLink);
        } catch (err) {
            setInviteError(err.response?.data || 'Failed to create invite link.');
        } finally {
            setInviteLoading(false);
        }
    };

    const copyInviteLink = () => {
        navigator.clipboard.writeText(inviteLink);
        setInviteCopied(true);
        setTimeout(() => setInviteCopied(false), 2000);
    };

    const defaultForm = {
        username: '',
        fullname: '',
        email: '',
        password: '',
        department: '',
        mobileNo: '',
        role: 'USER',
        inOut: 'OFFLINE',
        joinedDate: new Date().toISOString().split('T')[0],
        actions: '',
        status: 'Active'
    };

    const [userForm, setUserForm] = useState(defaultForm);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/users');
            if (res.data) setUsers(res.data);
        } catch (err) {
            logger.error("Failed to fetch users", err);
            const msg = err.response?.data || err.message || 'Failed to load users';
            setError(`Error ${err.response?.status ?? ''}: ${msg}`);
        }
    };

    const openAddModal = () => {
        setEditingUserId(null);
        setUserForm(defaultForm);
        setIsModalOpen(true);
    };

    const openEditModal = (user) => {
        setEditingUserId(user.id);

        setUserForm({
            username: user.username || '',
            fullname: user.fullname || '',
            email: user.email || '',
            password: '',
            department: user.department || '',
            mobileNo: user.mobileNo || '',
            role: user.role || 'USER',
            inOut: user.inOut || 'OFFLINE',
            joinedDate: user.joinedDate || new Date().toISOString().split('T')[0],
            actions: user.actions || '',
            status: user.status || 'Active'
        });

        setIsModalOpen(true);
    };

    const openViewModal = (user) => {
        setViewingUser(user);
        setIsViewModalOpen(true);
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm("Delete this user?")) return;
        try {
            await api.delete(`/users/${id}`);
            setUsers(prev => prev.filter(u => u.id !== id));
            if (viewingUser?.id === id) setIsViewModalOpen(false);
        } catch (err) {
            logger.error("Delete failed", err);
            const msg = err.response?.data || err.message || 'Delete failed';
            setError(`Error ${err.response?.status ?? ''}: ${msg}`);
        }
    };

    const handleSaveUser = async () => {

        try {
            const cleanedUsername = userForm.username.trim();
            const cleanedEmail = userForm.email.trim();
            const cleanedFullname = userForm.fullname.trim();

            if (!cleanedUsername || !cleanedEmail) {
                setError('Username and Email are required!');
                return;
            }

            const payload = { 
                ...userForm,
                username: cleanedUsername,
                email: cleanedEmail,
                fullname: cleanedFullname
            };

            if (editingUserId && !payload.password) {
                delete payload.password;
            }

            const empId = localStorage.getItem("employeeId");
            if (empId) payload.employeeId = empId;

            if (editingUserId) {
                await api.put(`/users/${editingUserId}`, payload);
            } else {
                await api.post('/users/new', payload);
            }

            // Re-fetch users to get consistent backend data including real IDs
            await fetchUsers();

            setIsModalOpen(false);

            if (viewingUser) {
                setViewingUser(prev => ({ ...prev, ...payload }));
            }

        } catch (err) {
            logger.error("Save user failed", err);
            const msg = err.response?.data || err.message || 'Save failed';
            setError(`Error ${err.response?.status ?? ''}: ${msg}`);
        }
    };

    return (
        <>
        <div className="max-w-7xl mx-auto">

            <div className="flex justify-between mb-8">
                <div>
                    <h1 className={h1cls}>User Management</h1>
                    <p className={sub}>Manage team members</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => { setInviteForm({ fullname: '', email: '', role: 'USER' }); setInviteLink(''); setInviteError(''); setIsInviteOpen(true); }}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-sm transition"
                    >
                        <Mail size={16} /> Send Invite
                    </button>
                    <button onClick={openAddModal} className={pill}>
                        <Plus size={20} /> Add User
                    </button>
                </div>
            </div>

            {/* Error banner */}
            {error && (
                <div className="flex items-center gap-3 mb-4 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm">
                    <AlertTriangle size={16} className="shrink-0" />
                    <span className="flex-1">{error}</span>
                    <button onClick={() => setError('')} className="p-0.5 hover:bg-red-100 dark:hover:bg-red-900/40 rounded">
                        <X size={14} />
                    </button>
                </div>
            )}

            <div className={`${card} overflow-hidden`}>

                <table className="w-full">

                    <thead>
                        <tr className={thead}>
                            <th className={th}>Name</th>
                            <th className={th}>Email</th>
                            <th className={th}>Role</th>
                            <th className={th}>Status</th>
                            <th className={th}>Join Date</th>
                            <th className={th}>Actions</th>
                        </tr>
                    </thead>

                    <tbody>

                        {users.map((user, idx) => (

                            <tr key={user.id || idx} className={trRow}>

                                <td className={tdbold}>
                                    <div className="flex items-center gap-2">
                                        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                                            user.inOut === 'ONLINE' ? 'bg-emerald-500' : 'bg-slate-400'
                                        }`} />
                                        {user.fullname || user.username}
                                    </div>
                                </td>
                                <td className={td}>{user.email}</td>
                                <td className={td}>{user.role}</td>
                                <td className={td}>{user.status}</td>
                                <td className={td}>{user.joinedDate}</td>

                                <td className="px-6 py-4 flex items-center gap-2">

                                    <button onClick={() => openViewModal(user)} className="p-2 bg-white border border-slate-200 rounded-md transition-colors text-slate-500 hover:text-blue-600 hover:border-blue-500 shadow-sm" title="View Details">
                                        <Eye size={16} />
                                    </button>

                                    <button onClick={() => openEditModal(user)} className="p-2 bg-white border border-slate-200 rounded-md transition-colors text-slate-500 hover:text-slate-900 hover:border-slate-400 shadow-sm" title="Edit User">
                                        <Edit2 size={16} />
                                    </button>

                                    <button onClick={() => handleDeleteUser(user.id)} className="p-2 bg-white border border-slate-200 rounded-md transition-colors text-slate-500 hover:text-red-600 hover:border-red-500 shadow-sm" title="Delete User">
                                        <Trash2 size={16} />
                                    </button>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>


            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
                        
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
                            <h2 className="text-xl font-bold text-slate-900">
                                {editingUserId ? "Edit User" : "Add New User"}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                            <div className="grid grid-cols-2 gap-5">

                            <div className="col-span-2 sm:col-span-1">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Username *</label>
                                <input
                                    className={input}
                                    placeholder="johndoe"
                                    value={userForm.username}
                                    onChange={(e) => setUserForm({ ...userForm, username: e.target.value.replace(/\s/g, '').toLowerCase() })}
                                />
                            </div>

                            <div className="col-span-2 sm:col-span-1">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                <input
                                    className={input}
                                    placeholder="John Doe"
                                    value={userForm.fullname}
                                    onChange={(e) => setUserForm({ ...userForm, fullname: e.target.value })}
                                />
                            </div>

                            <div className="col-span-2 sm:col-span-1">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                                <input
                                    className={input}
                                    placeholder="john@example.com"
                                    value={userForm.email}
                                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value.replace(/\s/g, '').toLowerCase() })}
                                />
                            </div>

                            <div className="col-span-2 sm:col-span-1">
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Password {editingUserId && <span className="text-xs text-slate-400 font-normal">(Leave blank to keep)</span>}
                                </label>
                                <input
                                    className={input}
                                    placeholder="••••••••"
                                    type="password"
                                    value={userForm.password}
                                    onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                                />
                            </div>

                            <div className="col-span-2 sm:col-span-1">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Mobile No</label>
                                <input
                                    className={input}
                                    placeholder="1234567890"
                                    type="tel"
                                    value={userForm.mobileNo}
                                    onChange={(e) => setUserForm({ ...userForm, mobileNo: e.target.value })}
                                />
                            </div>

                            {editingUserId && (
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">System Status</label>
                                    <select 
                                        className={input} 
                                        value={userForm.status} 
                                        onChange={(e) => setUserForm({ ...userForm, status: e.target.value })}
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                        <option value="Suspended">Suspended</option>
                                        <option value="Terminated">Terminated</option>
                                    </select>
                                </div>
                            )}

                            <div className="col-span-2 sm:col-span-1">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Role *</label>
                                <select 
                                    className={input} 
                                    value={userForm.role} 
                                    onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                                >
                                    <option value="ADMIN">Admin</option>
                                    <option value="MANAGER">Manager</option>
                                    <option value="USER">User</option>
                                    <option value="CHAT">Chat</option>
                                    <option value="VOICE">Voice</option>
                                </select>
                            </div>

                            </div>
                        </div>

                        <div className="flex justify-end gap-3 px-6 py-4 mt-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex-shrink-0">

                            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                Cancel
                            </button>

                            <button
                                onClick={handleSaveUser}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm shadow-blue-600/20"
                            >
                                <Save size={16} /> {editingUserId ? 'Update User' : 'Save User'}
                            </button>

                        </div>
                    </div>
                </div>
            )}

            {/* View Details Modal */}
            {isViewModalOpen && viewingUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-lg">
                                    {(viewingUser.fullname || viewingUser.username || 'U').charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                                        {viewingUser.fullname || viewingUser.username}
                                    </h2>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                                            viewingUser.inOut === 'ONLINE' ? 'bg-emerald-500' : 'bg-slate-400'
                                        }`} />
                                        <span className="text-xs text-slate-500 dark:text-slate-400">@{viewingUser.username}</span>
                                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${viewingUser.inOut === 'ONLINE' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                                            {viewingUser.inOut === 'ONLINE' ? 'Online' : 'Offline'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => { setIsViewModalOpen(false); openEditModal(viewingUser); }} className="p-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full transition-colors border border-slate-200 dark:border-slate-700" title="Edit User">
                                    <Edit2 size={16} />
                                </button>
                                <button onClick={() => handleDeleteUser(viewingUser.id)} className="p-2 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-full transition-colors border border-red-100 dark:border-red-900/30" title="Delete User">
                                    <Trash2 size={16} />
                                </button>
                                <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>
                                <button onClick={() => setIsViewModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar bg-slate-50/50 dark:bg-slate-900/50">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-6">
                                    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
                                        <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">Contact Details</h3>
                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">Email Address</p>
                                                <p className="text-sm font-medium text-slate-900 dark:text-white break-all">{viewingUser.email || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">Mobile Number</p>
                                                <p className="text-sm font-medium text-slate-900 dark:text-white">{viewingUser.mobileNo || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
                                        <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">Status & Notes</h3>
                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">System Status</p>
                                                <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${viewingUser.status === 'Active'
                                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
                                                    : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                                                    }`}>
                                                    {viewingUser.status || 'Active'}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">Recent Actions</p>
                                                <p className="text-sm text-slate-900 dark:text-white italic mt-1 bg-slate-50 dark:bg-slate-900 p-2 rounded border border-slate-100 dark:border-slate-800">{viewingUser.actions || 'No recent actions recorded.'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
                                        <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">Employment Details</h3>
                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Role & Department</p>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                                        {viewingUser.role}
                                                    </span>
                                                    {viewingUser.department && (
                                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 border-l border-slate-300 dark:border-slate-600 pl-2">
                                                            {viewingUser.department}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">Target IDs</p>
                                                <p className="text-sm font-mono text-slate-600 dark:text-slate-400 mt-1">ID: {viewingUser.id}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                                    Joined Date
                                                </p>
                                                <p className="text-sm font-medium text-slate-900 dark:text-white mt-1 flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                                                    {viewingUser.joinedDate || 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800/80 rounded-xl p-5 border border-blue-100 dark:border-slate-700 shadow-sm relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-4 opacity-10">
                                            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM11 19.93C7.05 19.43 4 16.05 4 12C4 7.95 7.05 4.57 11 4.07V19.93ZM13 4.07C16.95 4.57 20 7.95 20 12C20 16.05 16.95 19.43 13 19.93V4.07Z"></path>
                                            </svg>
                                        </div>
                                        <h3 className="text-xs font-bold text-blue-800 dark:text-slate-300 uppercase tracking-wider mb-2 relative z-10">Usage & Metrics</h3>
                                        <p className="text-sm text-blue-900/70 dark:text-slate-400 relative z-10">
                                            Relationships like tasks, leads, and customers are linked to this employee's ID. Modifications to this profile will reflect across the dashboard.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>

        {/* Invite Link Modal */}
        {isInviteOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Send Invite Link</h2>
                        <button onClick={() => setIsInviteOpen(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition"><X size={18} /></button>
                    </div>

                    <div className="p-6 space-y-4">
                        {inviteError && (
                            <div className="flex items-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
                                <AlertTriangle size={14} /> {inviteError}
                            </div>
                        )}

                        {inviteLink ? (
                            <div className="space-y-3">
                                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Share this invite link:</p>
                                <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
                                    <span className="flex-1 text-xs text-slate-600 dark:text-slate-300 break-all font-mono">{inviteLink}</span>
                                    <button onClick={copyInviteLink} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                                        {inviteCopied ? <CheckCircle size={16} className="text-green-500" /> : <Copy size={16} />}
                                    </button>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">The invited user will set their password via this link. Their account will be pending until you approve it.</p>
                                <button onClick={() => setIsInviteOpen(false)} className="w-full py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition">Done</button>
                            </div>
                        ) : (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                                    <input className={input} placeholder="Jane Doe" value={inviteForm.fullname} onChange={e => setInviteForm(f => ({ ...f, fullname: e.target.value }))} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email *</label>
                                    <input className={input} type="email" placeholder="jane@company.com" value={inviteForm.email} onChange={e => setInviteForm(f => ({ ...f, email: e.target.value.toLowerCase() }))} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Role</label>
                                    <select className={input} value={inviteForm.role} onChange={e => setInviteForm(f => ({ ...f, role: e.target.value }))}>
                                        <option value="ADMIN">Admin</option>
                                        <option value="MANAGER">Manager</option>
                                        <option value="USER">User</option>
                                    </select>
                                </div>
                                <button
                                    onClick={handleSendInvite}
                                    disabled={inviteLoading}
                                    className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold text-sm hover:opacity-90 transition disabled:opacity-60"
                                >
                                    {inviteLoading ? 'Generating…' : 'Generate Invite Link'}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        )}
        </>
    );
};
