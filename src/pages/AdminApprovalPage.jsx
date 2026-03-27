import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import api from '../lib/api';

export function AdminApprovalPage() {
    const [pendingUsers, setPendingUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionMessage, setActionMessage] = useState('');

    const fetchPending = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await api.get('/admin/pending-users');
            setPendingUsers(res.data || []);
        } catch (e) {
            setError('Failed to load pending users.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPending(); }, []);

    const handleApprove = async (id, name) => {
        try {
            await api.post(`/admin/approve/${id}`);
            setPendingUsers(prev => prev.filter(u => u.id !== id));
            setActionMessage(`✅ ${name} has been approved and can now log in.`);
            setTimeout(() => setActionMessage(''), 4000);
        } catch {
            setError('Failed to approve user.');
        }
    };

    const handleReject = async (id, name) => {
        if (!window.confirm(`Are you sure you want to reject and delete ${name}?`)) return;
        try {
            await api.delete(`/admin/reject/${id}`);
            setPendingUsers(prev => prev.filter(u => u.id !== id));
            setActionMessage(`❌ ${name} has been rejected and removed.`);
            setTimeout(() => setActionMessage(''), 4000);
        } catch {
            setError('Failed to reject user.');
        }
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Pending Approvals</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Review and approve users who have completed invite registration</p>
                </div>
                <button
                    onClick={fetchPending}
                    className="flex items-center gap-2 px-4 py-2 text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition"
                >
                    <RefreshCw size={16} />
                    Refresh
                </button>
            </div>

            {actionMessage && (
                <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl text-blue-800 dark:text-blue-200 text-sm font-medium">
                    {actionMessage}
                </div>
            )}

            {error && (
                <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
                    <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm font-medium text-red-800 dark:text-red-300">{error}</p>
                </div>
            )}

            {loading ? (
                <div className="flex justify-center py-16">
                    <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
                </div>
            ) : pendingUsers.length === 0 ? (
                <div className="text-center py-16">
                    <CheckCircle size={48} className="text-green-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">No pending approvals</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">All invited users have been reviewed.</p>
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-900">
                            <tr>
                                <th className="px-6 py-3.5 text-left font-semibold text-slate-600 dark:text-slate-300">Name</th>
                                <th className="px-6 py-3.5 text-left font-semibold text-slate-600 dark:text-slate-300">Username</th>
                                <th className="px-6 py-3.5 text-left font-semibold text-slate-600 dark:text-slate-300">Email</th>
                                <th className="px-6 py-3.5 text-left font-semibold text-slate-600 dark:text-slate-300">Role</th>
                                <th className="px-6 py-3.5 text-left font-semibold text-slate-600 dark:text-slate-300">Status</th>
                                <th className="px-6 py-3.5 text-right font-semibold text-slate-600 dark:text-slate-300">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {pendingUsers.map(u => (
                                <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
                                    <td className="px-6 py-4 font-medium text-slate-800 dark:text-white">{u.fullname || '—'}</td>
                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{u.username}</td>
                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{u.email}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-medium">
                                            <Clock size={14} />
                                            Pending
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleApprove(u.id, u.fullname || u.username)}
                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 rounded-lg text-xs font-semibold hover:bg-green-200 dark:hover:bg-green-900/70 transition"
                                            >
                                                <CheckCircle size={14} />
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleReject(u.id, u.fullname || u.username)}
                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 rounded-lg text-xs font-semibold hover:bg-red-200 dark:hover:bg-red-900/70 transition"
                                            >
                                                <XCircle size={14} />
                                                Reject
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
