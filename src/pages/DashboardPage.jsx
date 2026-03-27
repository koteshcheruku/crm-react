import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { Users, TrendingUp, Clock, CheckSquare } from 'lucide-react';
import { card, h1cls, sub } from '../components/ui/styles';


export const DashboardPage = ({ user }) => {
    const [leads, setLeads] = useState(0);
    const [newToday, setNewToday] = useState(0);
    const [followUps, setFollowUps] = useState(0);
    const [activeTasks, setActiveTasks] = useState(0);
    const [leadSources, setLeadSources] = useState([]);

    const [leadsByStatus, setLeadsByStatus] = useState([
        { status: 'New', count: 0, percentage: 0, color: 'from-blue-500 to-cyan-400' },
        { status: 'Contacted', count: 0, percentage: 0, color: 'from-purple-500 to-pink-400' },
        { status: 'Qualified', count: 0, percentage: 0, color: 'from-emerald-500 to-teal-400' },
        { status: 'Converted', count: 0, percentage: 0, color: 'from-orange-500 to-amber-400' },
    ]);

    const [performance, setPerformance] = useState([
        { label: 'Conversion Rate', value: '—', trend: '' },
        { label: 'Avg. Response Time', value: '—', trend: '' },
        { label: 'Customer Satisfaction', value: '—', trend: '' },
    ]);


    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await api.get('/dashboard');
                if (res.data) {
                    if (res.data.leads !== undefined) setLeads(res.data.leads);
                    if (res.data.newToday !== undefined) setNewToday(res.data.newToday);
                    if (res.data.followUps !== undefined) setFollowUps(res.data.followUps);
                    if (res.data.activeTasks !== undefined) setActiveTasks(res.data.activeTasks);
                    if (res.data.leadsByStatus) setLeadsByStatus(res.data.leadsByStatus);
                    if (res.data.performance) setPerformance(res.data.performance);
                }
            } catch (err) {
                console.error("Failed to fetch dashboard data", err);
            }
        };
        const fetchReportsData = async () => {
            try {
                const res = await api.get('/reports');
                if (res.data && res.data.leadSources) setLeadSources(res.data.leadSources);
            } catch (err) {
                console.error("Failed to fetch reports", err);
            }
        };
        fetchDashboardData();
        fetchReportsData();
    }, []);

    if (!user) {
        return <div className="p-8 text-center text-slate-500">Loading user data...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className={h1cls}>Dashboard</h1>
                <p className={sub}>Welcome back! Here's what's happening with your CRM.</p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                    { label: 'Total Leads', value: leads, icon: Users, color: 'from-blue-500 to-cyan-400' },
                    { label: 'New Leads Today', value: newToday, icon: TrendingUp, color: 'from-emerald-500 to-teal-400' },
                    { label: 'Follow-ups Today', value: followUps, icon: Clock, color: 'from-orange-500 to-amber-400' },
                    { label: 'Active Tasks', value: activeTasks, icon: CheckSquare, color: 'from-purple-500 to-pink-400' },
                ].map((metric, idx) => {
                    const Icon = metric.icon;
                    return (
                        <div key={idx} className={`${card} p-6 hover:shadow-md transition-shadow`}>
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-12 h-12 bg-gradient-to-br ${metric.color} rounded-lg flex items-center justify-center`}>
                                    <Icon size={24} className="text-white" />
                                </div>
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 text-sm font-medium mb-1">{metric.label}</p>
                            <p className="text-3xl font-bold text-slate-900 dark:text-white">{metric.value}</p>
                        </div>
                    );
                })}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Leads by Status */}
                <div className={`${card} p-6`}>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Leads by Status</h2>
                    <div className="space-y-4">
                        {leadsByStatus.map((item, idx) => (
                            <div key={idx}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.status}</span>
                                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{item.count}</span>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2 overflow-hidden">
                                    <div
                                        className={`h-full bg-gradient-to-r ${item.color}`}
                                        style={{ width: `${item.percentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Lead Sources */}
                <div className={`${card} p-6`}>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Lead Sources</h2>
                        <a href="/reports" className="text-sm text-blue-600 hover:text-blue-700 font-medium">Full Report &rarr;</a>
                    </div>
                    <div className="space-y-4">
                        {leadSources.slice(0, 4).map((item, idx) => (
                            <div key={idx}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.source}</span>
                                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{item.leads}</span>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2 overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400"
                                        style={{ width: `${item.percentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                        {leadSources.length === 0 && <p className="text-sm text-slate-500">No source data available.</p>}
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className={`${card} overflow-hidden`}>
                <div className="p-6 border-b border-slate-100 dark:border-slate-700">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Activity</h2>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                </div>
            </div>
        </div>
    );
};
