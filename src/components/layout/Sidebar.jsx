import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, UserCheck, CheckSquare, Phone, MessageSquare, FileText, BarChart3, ShieldCheck, Settings, X, LogOut, UserCog, ClipboardList } from 'lucide-react';

const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/leads', label: 'Leads', icon: Users, roles: ['ADMIN', 'MANAGER', 'SALES'] },
    { path: '/customers', label: 'Customers', icon: UserCheck, roles: ['ADMIN', 'MANAGER', 'SALES', 'SUPPORT'] },
    { path: '/tasks', label: 'Tasks', icon: CheckSquare },
    { path: '/communications', label: 'Communications', icon: Phone },
    { path: '/chat', label: 'Chat', icon: MessageSquare },
    { path: '/documents', label: 'Documents', icon: FileText },
    { path: '/reports', label: 'Reports', icon: BarChart3, roles: ['ADMIN', 'MANAGER'] },
];

const adminItems = [
    { path: '/users', label: 'User Management', icon: ShieldCheck, roles: ['ADMIN'] },
    { path: '/admin/approvals', label: 'Pending Approvals', icon: ClipboardList, roles: ['ADMIN'] },
    { path: '/roles', label: 'Role Management', icon: ShieldCheck, roles: ['ADMIN'] },
    { path: '/settings', label: 'Settings', icon: Settings, roles: ['ADMIN', 'MANAGER'] },
];

export const Sidebar = ({ open, onClose, onLogout, user }) => {
    const linkClass = ({ isActive }) =>
        `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive
            ? 'bg-blue-600 text-white shadow-sm'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
        }`;

    return (
        <>
            {open && (
                <div
                    className="fixed inset-0 bg-black/30 z-20 lg:hidden"
                    onClick={onClose}
                />
            )}
            <aside
                className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 z-30 flex flex-col
          transform transition-transform duration-300
          ${open ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto`}
            >
                {/* Logo */}
                <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                        <LayoutDashboard size={18} className="text-white" />
                    </div>
                    <span className="text-lg font-bold text-slate-900 dark:text-white">CRM Pro</span>
                    <button className="ml-auto lg:hidden text-slate-500 dark:text-slate-400" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                    {navItems
                        .filter(item => !item.roles || (user && item.roles.includes(user.role)))
                        .map(({ path, label, icon: Icon }) => (
                            <NavLink key={path} to={path} className={linkClass} onClick={onClose}>
                                <Icon size={18} />
                                {label}
                            </NavLink>
                        ))}

                    {adminItems.filter(item => !item.roles || (user && item.roles.includes(user.role))).length > 0 && (
                        <div className="pt-4 pb-1 px-1">
                            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Admin</p>
                        </div>
                    )}

                    {adminItems
                        .filter(item => !item.roles || (user && item.roles.includes(user.role)))
                        .map(({ path, label, icon: Icon }) => (
                            <NavLink key={path} to={path} className={linkClass} onClick={onClose}>
                                <Icon size={18} />
                                {label}
                            </NavLink>
                        ))}
                </nav>

                {/* User footer */}
                <div className="border-t border-slate-200 dark:border-slate-700 p-4 flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {user?.name?.substring(0, 2).toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user?.name || 'Loading...'}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email || ''}</p>
                    </div>
                    <button
                        onClick={onLogout}
                        className="text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors p-2 rounded-lg"
                        title="Sign out"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </aside>
        </>
    );
};
