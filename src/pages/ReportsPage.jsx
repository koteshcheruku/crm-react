import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users } from 'lucide-react';
import { card, h1cls, sub } from '../components/ui/styles';
import api from '../lib/api';

export const ReportsPage = () => {
    const [salesMetrics, setSalesMetrics] = useState([
        { label: 'Total Revenue', value: '—', trend: '' },
        { label: 'Average Deal Size', value: '—', trend: '' },
        { label: 'Sales Cycle', value: '—', trend: '' },
    ]);
    const [leadSources, setLeadSources] = useState([
        { source: 'Website', leads: 0, percentage: 0 },
        { source: 'LinkedIn', leads: 0, percentage: 0 },
        { source: 'Referral', leads: 0, percentage: 0 },
        { source: 'Other', leads: 0, percentage: 0 },
    ]);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const res = await api.get('/reports');
                if (res.data) {
                    if (res.data.salesMetrics) setSalesMetrics(res.data.salesMetrics);
                    if (res.data.leadSources) setLeadSources(res.data.leadSources);
                }
            } catch (err) {
                console.error("Failed to fetch reports", err);
            }
        };
        fetchReports();
    }, []);
    return (
        <div className="max-w-7xl mx-auto">
            <div>
                <h1 className={h1cls}>Reports</h1>
                <p className={`${sub} mb-8`}>Analytics and performance reports</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {[
                    { title: 'Sales Performance', icon: BarChart3, color: 'from-blue-500 to-cyan-400', description: 'Track sales metrics and trends' },
                    { title: 'Lead Analysis', icon: TrendingUp, color: 'from-emerald-500 to-teal-400', description: 'Lead source and conversion analysis' },
                    { title: 'Team Activity', icon: Users, color: 'from-purple-500 to-pink-400', description: 'Team performance and activity logs' },
                ].map((report, idx) => {
                    const Icon = report.icon;
                    return (
                        <button key={idx} className={`${card} p-8 text-center hover:shadow-md transition-shadow group`}>
                            <div className={`w-16 h-16 bg-gradient-to-br ${report.color} rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                                <Icon size={32} className="text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{report.title}</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{report.description}</p>
                        </button>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sales Metrics */}
                <div className={`${card} p-6`}>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Sales Metrics</h3>
                    <div className="space-y-4">
                        {salesMetrics.map((metric, idx) => (
                            <div key={idx} className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700 last:border-0">
                                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{metric.label}</span>
                                <div className="text-right">
                                    <p className="text-lg font-bold text-slate-900 dark:text-white">{metric.value}</p>
                                    <p className="text-xs text-emerald-600">{metric.trend}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Lead Sources */}
                <div className={`${card} p-6`}>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Lead Sources</h3>
                    <div className="space-y-4">
                        {leadSources.map((item, idx) => (
                            <div key={idx}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.source}</span>
                                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{item.leads}</span>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                                        style={{ width: `${item.percentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
