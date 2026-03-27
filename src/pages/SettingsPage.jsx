import React, { useState, useEffect } from 'react';
import { card, h1cls } from '../components/ui/styles';
import api from '../lib/api';

export const SettingsPage = () => {
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');
    
    // Form state
    const [profile, setProfile] = useState({ fullname: '', email: '' });
    const [passwords, setPasswords] = useState({ newPassword: '', confirmPassword: '' });
    
    // Notifications state
    const [notifications, setNotifications] = useState({
        emailNotifications: true,
        taskReminders: true,
        leadUpdates: false,
        systemAlerts: true
    });

    const [currentUserRole, setCurrentUserRole] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        if (selectedUserId && users.length > 0) {
            const user = users.find(u => String(u.id) === String(selectedUserId));
            if (user) {
                setProfile({
                    fullname: user.fullname || user.username || '',
                    email: user.email || ''
                });
                setNotifications({
                    emailNotifications: Boolean(user.emailNotifications),
                    taskReminders: Boolean(user.taskReminders),
                    leadUpdates: Boolean(user.leadUpdates),
                    systemAlerts: Boolean(user.systemAlerts)
                });
                setMessage({ type: '', text: '' });
            }
        }
    }, [selectedUserId, users]);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/users');
            if (res.data && res.data.length > 0) {
                setUsers(res.data);
                
                // Get logged in employee ID to set as default
                const currentEmpId = localStorage.getItem('employeeId');
                const matchedUser = res.data.find(u => String(u.id) === String(currentEmpId));
                
                if (matchedUser && matchedUser.role) {
                    setCurrentUserRole(matchedUser.role.replace('ROLE_', '').toUpperCase());
                }

                if (currentEmpId && matchedUser) {
                    setSelectedUserId(currentEmpId);
                } else {
                    setSelectedUserId(String(res.data[0].id));
                }
            }
        } catch (err) {
            console.error("Failed to fetch users", err);
            
            // Fallback for normal users who might not have access to GET /users
            const currentEmpId = localStorage.getItem('employeeId');
            if (currentEmpId) {
                try {
                    const meRes = await api.get('/auth/me');
                    if (meRes.data) {
                       setUsers([meRes.data]);
                       setSelectedUserId(String(meRes.data.id));
                       setCurrentUserRole(meRes.data.role ? meRes.data.role.replace('ROLE_', '').toUpperCase() : 'USER');
                    }
                } catch(e) {
                    showMessage('error', 'Failed to load user profile for settings.');
                }
            } else {
                showMessage('error', 'Failed to load users for settings.');
            }
        }
    };

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        
        if (!selectedUserId) return;
        
        const currentUserData = users.find(u => String(u.id) === String(selectedUserId));
        if (!currentUserData) return;
        
        setIsLoading(true);
        try {
            // PATCH request to partially update user profile
            const payload = { id: selectedUserId, fullname: profile.fullname, email: profile.email };
            await api.patch(`/settings/${selectedUserId}`, payload);
            showMessage('success', 'Profile updated successfully.');
            fetchUsers(); // Refresh list to get latest names
        } catch (err) {
            console.error(err);
            showMessage('error', 'Failed to update profile.');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        
        if (!selectedUserId) return;
        
        if (passwords.newPassword !== passwords.confirmPassword) {
            showMessage('error', 'Passwords do not match.');
            return;
        }

        if (passwords.newPassword.length < 5) {
            showMessage('error', 'Password must be at least 5 characters.');
            return;
        }

        const currentUserData = users.find(u => String(u.id) === String(selectedUserId));
        if (!currentUserData) return;

        setIsLoading(true);
        try {
            // PATCH request to update just the password
            const payload = { id: selectedUserId, password: passwords.newPassword };
            await api.patch(`/settings/${selectedUserId}/change-password`, payload);
            
            showMessage('success', 'Password updated successfully.');
            setPasswords({ newPassword: '', confirmPassword: '' });
        } catch (err) {
            console.error(err);
            showMessage('error', 'Failed to update password.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleNotificationsSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        
        if (!selectedUserId) return;

        setIsLoading(true);
        try {
            const currentUserData = users.find(u => String(u.id) === String(selectedUserId));
            if (!currentUserData) return;

            const payload = {
                id: selectedUserId,
                emailNotifications: notifications.emailNotifications,
                taskReminders: notifications.taskReminders,
                leadUpdates: notifications.leadUpdates,
                systemAlerts: notifications.systemAlerts
            };

            await api.patch(`/settings/${selectedUserId}/notifications`, payload);
            fetchUsers(); // Refresh to catch changes

            showMessage('success', 'Notification preferences saved.');
        } catch (err) {
            console.error(err);
            showMessage('error', 'Failed to save notifications.');
        } finally {
            setIsLoading(false);
        }
    };

    const inputCls = `w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white disabled:opacity-50`;
    const labelCls = 'block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2';

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className={h1cls}>Settings</h1>

            {message.text && (
                <div className={`p-4 mb-6 rounded-lg font-medium text-sm ${message.type === 'error' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-green-100 text-green-700 border border-green-200'}`}>
                    {message.text}
                </div>
            )}

            {/* Target User Selector for Admins & Managers */}
            {(currentUserRole === 'ADMIN' || currentUserRole === 'MANAGER') && (
            <div className={`${card} p-8 mb-6 border-l-4 border-l-blue-500`}>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Select User Account</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Because you have elevated privileges, you can modify settings for other accounts.</p>
                <div>
                    <label className={labelCls}>Target User</label>
                    <select 
                        className={inputCls} 
                        value={selectedUserId} 
                        onChange={(e) => setSelectedUserId(e.target.value)}
                        disabled={users.length === 0}
                    >
                        {users.map(u => (
                            <option key={u.id} value={u.id}>{u.fullname || u.username} ({u.email || 'No email'})</option>
                        ))}
                    </select>
                </div>
            </div>
            )}

            {/* Profile */}
            <div className={`${card} p-8 mb-6`}>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Profile Settings</h2>
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <div>
                        <label className={labelCls}>Full Name / Username</label>
                        <input 
                            type="text" 
                            className={inputCls} 
                            value={profile.fullname} 
                            onChange={(e) => setProfile({...profile, fullname: e.target.value})}
                            required 
                            disabled={isLoading || !selectedUserId}
                        />
                    </div>
                    <div>
                        <label className={labelCls}>Email</label>
                        <input 
                            type="email" 
                            className={inputCls} 
                            value={profile.email} 
                            onChange={(e) => setProfile({...profile, email: e.target.value})}
                            required 
                            disabled={isLoading || !selectedUserId}
                        />
                    </div>
                    <button type="submit" disabled={isLoading || !selectedUserId} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50">
                        {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>

            {/* Password */}
            <div className={`${card} p-8 mb-6`}>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Change Password</h2>
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div>
                        <label className={labelCls}>New Password</label>
                        <input 
                            type="password" 
                            className={inputCls} 
                            value={passwords.newPassword} 
                            onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                            required 
                            disabled={isLoading || !selectedUserId}
                        />
                    </div>
                    <div>
                        <label className={labelCls}>Confirm Password</label>
                        <input 
                            type="password" 
                            className={inputCls} 
                            value={passwords.confirmPassword} 
                            onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                            required 
                            disabled={isLoading || !selectedUserId}
                        />
                    </div>
                    <button type="submit" disabled={isLoading || !selectedUserId} className="bg-slate-900 dark:bg-slate-600 text-white px-6 py-3 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-500 transition-colors font-semibold disabled:opacity-50">
                        {isLoading ? 'Updating...' : 'Update Password'}
                    </button>
                </form>
            </div>

            {/* Notifications */}
            {(currentUserRole === 'ADMIN' || currentUserRole === 'MANAGER') && (
            <div className={`${card} p-8`}>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Notification Preferences</h2>
                <form onSubmit={handleNotificationsSubmit} className="space-y-6">
                    <div className="space-y-4">
                        {[
                            { id: 'emailNotifications', label: 'Email Notifications', desc: 'Receive updates via email' },
                            { id: 'taskReminders', label: 'Task Reminders', desc: 'Get reminded about due tasks' },
                            { id: 'leadUpdates', label: 'Lead Updates', desc: 'Notifications for new leads' },
                            { id: 'systemAlerts', label: 'System Alerts', desc: 'Important system notifications' },
                        ].map((pref) => (
                            <label key={pref.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={notifications[pref.id]} 
                                    onChange={(e) => setNotifications({...notifications, [pref.id]: e.target.checked})}
                                    disabled={isLoading || !selectedUserId}
                                    className="rounded border-slate-300 dark:border-slate-600 w-4 h-4 accent-blue-600" 
                                />
                                <div>
                                    <p className="font-medium text-slate-900 dark:text-white">{pref.label}</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">{pref.desc}</p>
                                </div>
                            </label>
                        ))}
                    </div>
                    <button type="submit" disabled={isLoading || !selectedUserId} className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-6 py-3 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700 font-semibold disabled:opacity-50">
                        {isLoading ? 'Saving...' : 'Save Preferences'}
                    </button>
                </form>
            </div>
            )}
        </div>
    );
};
