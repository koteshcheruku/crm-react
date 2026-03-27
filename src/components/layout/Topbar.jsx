import React, { useState, useRef, useEffect } from 'react';
import { Menu, Bell, Sun, Moon, CheckCheck, Clock } from 'lucide-react';
import { useNotifications } from '../../lib/NotificationContext';

export const Topbar = ({ onMenuClick, darkMode, onToggleDark }) => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { notifications, unreadCount, markRead, markAllRead } = useNotifications();

    // Close on outside click
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 flex items-center gap-4 px-6 flex-shrink-0 relative z-40">
            <button
                onClick={onMenuClick}
                className="lg:hidden text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
                <Menu size={22} />
            </button>
            <div className="flex-1" />

            {/* Dark mode toggle */}
            <button
                onClick={onToggleDark}
                title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Notification Bell */}
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setOpen(v => !v)}
                    className="relative p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                    <Bell size={20} />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                    )}
                </button>

                {open && (
                    <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-fade-in">
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                            <span className="font-semibold text-slate-800 dark:text-white text-sm">Notifications</span>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllRead}
                                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                                >
                                    <CheckCheck size={12} />
                                    Mark all read
                                </button>
                            )}
                        </div>

                        {/* List */}
                        <div className="max-h-72 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="px-4 py-8 text-center text-slate-400 dark:text-slate-500 text-sm">
                                    No notifications yet
                                </div>
                            ) : (
                                notifications.slice(0, 20).map(n => (
                                    <div
                                        key={n.id}
                                        onClick={() => markRead(n.id)}
                                        className={`px-4 py-3 cursor-pointer border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition ${!n.isRead ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''}`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${!n.isRead ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'}`} />
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm leading-snug ${!n.isRead ? 'font-semibold text-slate-800 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>
                                                    {n.message}
                                                </p>
                                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-1">
                                                    <Clock size={10} />
                                                    {n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};
