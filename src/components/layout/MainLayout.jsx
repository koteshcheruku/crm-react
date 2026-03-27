import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export const MainLayout = ({ children, darkMode, onToggleDark, onLogout, user }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} onLogout={onLogout} user={user} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Topbar
                    onMenuClick={() => setSidebarOpen(true)}
                    darkMode={darkMode}
                    onToggleDark={onToggleDark}
                />
                <main className="flex-1 overflow-y-auto p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};
