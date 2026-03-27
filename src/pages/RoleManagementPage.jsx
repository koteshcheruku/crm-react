import React, { useState, useEffect } from 'react';
import { Plus, Edit2, X } from 'lucide-react';
import { card, h1cls, sub, pill } from '../components/ui/styles';
import api from '../lib/api';

export const RoleManagementPage = () => {
    const [roles, setRoles] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newRole, setNewRole] = useState({ name: '', color: 'from-blue-500 to-cyan-400', permissions: '' });

    const fetchRoles = async () => {
        try {
            const res = await api.get('/roles');
            if (res.data) setRoles(res.data);
        } catch (err) {
            console.error("Failed to fetch roles", err);
        }
    };

    const handleCreateRole = async (e) => {
        e.preventDefault();
        try {
            const permsArray = newRole.permissions.split(',').map(p => p.trim()).filter(p => p);
            await api.post('/roles', {
                name: newRole.name,
                color: newRole.color,
                permissions: permsArray
            });
            setShowModal(false);
            setNewRole({ name: '', color: 'from-blue-500 to-cyan-400', permissions: '' });
            fetchRoles();
        } catch (err) {
            console.error("Failed to create role", err);
            alert("Failed to create role: " + (err.response?.data?.message || err.message));
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    return (
        <>
        <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className={h1cls}>Role Management</h1>
                    <p className={sub}>Manage user roles and permissions</p>
                </div>
                <button onClick={() => setShowModal(true)} className={pill}><Plus size={20} />Create Role</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {roles.map(role => (
                    <div key={role.id} className={`${card} p-6 hover:shadow-md transition-shadow`}>
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{role.name}</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{role.users} user{role.users !== 1 ? 's' : ''}</p>
                            </div>
                            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                                <Edit2 size={18} className="text-slate-600 dark:text-slate-400" />
                            </button>
                        </div>
                        <div className="mb-4">
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Permissions:</p>
                            <div className="flex flex-wrap gap-2">
                                {role.permissions.map((perm, idx) => (
                                    <span key={idx} className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-xs font-medium">{perm}</span>
                                ))}
                            </div>
                        </div>
                        <div className={`h-1 bg-gradient-to-r ${role.color} rounded-full mt-4`}></div>
                    </div>
                ))}
            </div>
        </div>
            
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className={`${card} w-full max-w-md p-6`}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Create New Role</h2>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleCreateRole} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Role Name</label>
                                <input type="text" required value={newRole.name} onChange={e => setNewRole({...newRole, name: e.target.value})} className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white" placeholder="e.g. MARKETING" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Gradient Color Class</label>
                                <input type="text" value={newRole.color} onChange={e => setNewRole({...newRole, color: e.target.value})} className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white" placeholder="from-blue-500 to-cyan-400" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Permissions (comma separated)</label>
                                <input type="text" value={newRole.permissions} onChange={e => setNewRole({...newRole, permissions: e.target.value})} className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white" placeholder="VIEW_DASHBOARD, MANAGE_USERS" />
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">Cancel</button>
                                <button type="submit" className={pill}>Create Role</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};
