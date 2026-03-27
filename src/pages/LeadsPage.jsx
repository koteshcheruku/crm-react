
import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, X, Save, Edit2, Trash2, Upload, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { card, h1cls, sub, th, td, tdbold, trRow, thead, pill, input } from '../components/ui/styles';
import api from '../lib/api';
import logger from '../lib/logger';

// ─── Tiny toast-style error banner ────────────────────────────────────────────
const ErrorBanner = ({ message, onClose }) => message ? (
    <div className="flex items-center gap-3 mb-4 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm">
        <AlertTriangle size={16} className="shrink-0" />
        <span className="flex-1">{message}</span>
        <button onClick={onClose} className="p-0.5 hover:bg-red-100 dark:hover:bg-red-900/40 rounded">
            <X size={14} />
        </button>
    </div>
) : null;

export const LeadsPage = () => {
    const [leads, setLeads] = useState([]);
    const [error, setError] = useState('');

    // ── CSV import state ─────────────────────────────────────────────────────
    const [csvResult, setCsvResult] = useState(null); // { imported, failed[] }
    const [isImporting, setIsImporting] = useState(false);
    const csvInputRef = useRef(null);

    // Unified Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLeadId, setEditingLeadId] = useState(null);

    const [leadForm, setLeadForm] = useState({
        name: '',
        phone: '',
        source: 'Website',
        status: 'New',
        assignedTo: '',
        followUp: '',
        actions: 'Initial contact'
    });

    useEffect(() => {
        const fetchLeads = async () => {
            try {
                const res = await api.get('/leads');
                if (res.data) setLeads(res.data);
            } catch (err) {
                logger.error("Failed to fetch leads", err);
                const msg = err.response?.data || err.message || 'Failed to load leads';
                setError(`Error ${err.response?.status ?? ''}: ${msg}`);
            }
        };
        fetchLeads();
    }, []);

    const [statusFilter, setStatusFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredLeads = leads.filter(lead => {
        const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
        const nameMatch = (lead.names || '').toLowerCase().includes(searchTerm.toLowerCase());
        const phoneMatch = String(lead.phone || '').includes(searchTerm);
        const matchesSearch = nameMatch || phoneMatch;
        return matchesStatus && matchesSearch;
    });

    const statuses = ['All', 'New', 'Contacted', 'Qualified', 'Converted', 'Unqualified'];

    const openAddModal = () => {
        setEditingLeadId(null);
        setLeadForm({ name: '', phone: '', source: 'Website', status: 'New', assignedTo: '', followUp: '', actions: 'Initial contact' });
        setIsModalOpen(true);
    };

    const openEditModal = (lead) => {
        setEditingLeadId(lead.id);
        setLeadForm({
            name: lead.names || '',
            phone: lead.phone || '',
            source: lead.source || 'Website',
            status: lead.status || 'New',
            assignedTo: lead.assignedTo || '',
            followUp: lead.followUp || '',
            actions: lead.actions || ''
        });
        setIsModalOpen(true);
    };

    const handleDeleteLead = async (id) => {
        if (!window.confirm('Are you sure you want to delete this lead?')) return;
        try {
            await api.delete(`/leads/${id}`);
            setLeads(leads.filter(l => l.id !== id));
        } catch (err) {
            logger.error("Failed to delete lead", err);
            const msg = err.response?.data || err.message || 'Failed to delete lead';
            setError(`Error ${err.response?.status ?? ''}: ${msg}`);
        }
    };

    const handleSaveLead = async () => {
        try {
            const backendPayload = { ...leadForm, names: leadForm.name };
            const empId = localStorage.getItem('employeeId');
            if (empId) backendPayload.employeeId = empId;

            if (editingLeadId) {
                const res = await api.put(`/leads/${editingLeadId}`, backendPayload);
                // Use API response if available, otherwise do a local merge
                if (res.data && res.data.id) {
                    setLeads(prev => prev.map(l => l.id === editingLeadId ? res.data : l));
                } else {
                    setLeads(prev => prev.map(l =>
                        l.id === editingLeadId ? { ...l, ...backendPayload } : l
                    ));
                }
            } else {
                const res = await api.post('/leads/new', backendPayload);
                // Only push from API response (avoid duplicate with random ID)
                if (res.data && res.data.id) {
                    setLeads(prev => [...prev, res.data]);
                } else {
                    // Refetch to get the real DB-assigned ID
                    const fresh = await api.get('/leads');
                    if (fresh.data) setLeads(fresh.data);
                }
            }

            setIsModalOpen(false);
        } catch (err) {
            logger.error("Failed to save lead", err);
            const msg = err.response?.data || err.message || 'Failed to save lead';
            setError(`Error ${err.response?.status ?? ''}: ${msg}`);
        }
    };

    // ── CSV Upload Handler ───────────────────────────────────────────────────
    const handleCsvUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        e.target.value = '';
        setIsImporting(true);
        setCsvResult(null);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await api.post('/leads/import', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setCsvResult(res.data); // { imported, failed: [{row, reason}] }
            // Refresh list
            const fresh = await api.get('/leads');
            if (fresh.data) setLeads(fresh.data);
        } catch (err) {
            logger.error("CSV import failed", err);
            const msg = err.response?.data || err.message || 'CSV import failed';
            setError(`Error ${err.response?.status ?? ''}: ${msg}`);
        } finally {
            setIsImporting(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto relative">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className={h1cls}>Leads</h1>
                    <p className={sub}>Manage and track your sales leads</p>
                </div>
                <div className="flex items-center gap-2">
                    {/* Hidden CSV file input */}
                    <input
                        ref={csvInputRef}
                        type="file"
                        accept=".csv"
                        className="hidden"
                        onChange={handleCsvUpload}
                    />
                    <button
                        onClick={() => csvInputRef.current?.click()}
                        disabled={isImporting}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm disabled:opacity-50"
                    >
                        <Upload size={16} />
                        {isImporting ? 'Importing…' : 'Upload CSV'}
                    </button>
                    <button onClick={openAddModal} className={pill}>
                        <Plus size={20} />Add Lead
                    </button>
                </div>
            </div>

            {/* Error banner */}
            <ErrorBanner message={error} onClose={() => setError('')} />

            {/* CSV import results */}
            {csvResult && (
                <div className="mb-6 rounded-xl border overflow-hidden">
                    <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                        <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                        <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                            {csvResult.imported} lead{csvResult.imported !== 1 ? 's' : ''} imported successfully
                        </span>
                        {csvResult.failed?.length > 0 && (
                            <span className="ml-auto flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
                                <XCircle size={14} />
                                {csvResult.failed.length} row{csvResult.failed.length !== 1 ? 's' : ''} failed
                            </span>
                        )}
                        <button onClick={() => setCsvResult(null)} className="ml-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                            <X size={14} />
                        </button>
                    </div>
                    {csvResult.failed?.length > 0 && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400">
                                        <th className="px-4 py-2 text-left font-semibold">Row #</th>
                                        <th className="px-4 py-2 text-left font-semibold">Reason</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {csvResult.failed.map((f, i) => (
                                        <tr key={i}>
                                            <td className="px-4 py-2 text-slate-600 dark:text-slate-400">{f.row}</td>
                                            <td className="px-4 py-2 text-red-600 dark:text-red-400">{f.reason}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Filters */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by name or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`pl-12 pr-4 py-3 ${input} w-full`}
                    />
                </div>
                <div className="flex gap-2 flex-wrap items-center">
                    {statuses.map(status => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${statusFilter === status
                                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-blue-500 hover:text-blue-600 dark:hover:border-blue-500 dark:hover:text-blue-400'
                                } `}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className={`${card} overflow-hidden shadow-sm`}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className={`${thead} bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700`}>
                                <th className={`${th} py-4 px-6 font-semibold text-slate-500 dark:text-slate-400`}>Name</th>
                                <th className={`${th} py-4 px-6 font-semibold text-slate-500 dark:text-slate-400`}>Phone</th>
                                <th className={`${th} py-4 px-6 font-semibold text-slate-500 dark:text-slate-400`}>Source</th>
                                <th className={`${th} py-4 px-6 font-semibold text-slate-500 dark:text-slate-400`}>Status</th>
                                <th className={`${th} py-4 px-6 font-semibold text-slate-500 dark:text-slate-400`}>Assigned To</th>
                                <th className={`${th} py-4 px-6 font-semibold text-slate-500 dark:text-slate-400`}>Follow-up</th>
                                <th className={`${th} py-4 px-6 font-semibold text-slate-500 dark:text-slate-400`}>Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {filteredLeads.length > 0 ? filteredLeads.map((lead, idx) => (
                                <tr key={lead.id || idx} className={`${trRow} group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors`}>
                                    <td className={`${tdbold} py-4 px-6 text-slate-900 dark:text-white font-medium`}>{lead.names}</td>
                                    <td className={`${td} py-4 px-6 text-slate-600 dark:text-slate-400`}>{lead.phone}</td>
                                    <td className={`${td} py-4 px-6 text-slate-600 dark:text-slate-400`}>{lead.source}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${{
                                            'New': 'bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20',
                                            'Contacted': 'bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20',
                                            'Qualified': 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20',
                                            'Converted': 'bg-lime-100 dark:bg-lime-500/10 text-lime-700 dark:text-lime-400 border border-lime-200 dark:border-lime-500/20',
                                            'Unqualified': 'bg-gray-100 dark:bg-gray-500/10 text-gray-700 dark:text-gray-400 border border-gray-200 dark:border-gray-500/20'
                                        }[lead.status] || 'bg-slate-100 text-slate-700'
                                            }`}>
                                            {lead.status}
                                        </span>
                                    </td>
                                    <td className={`${td} py-4 px-6 text-slate-600 dark:text-slate-400`}>{lead.assignedTo || 'Unassigned'}</td>
                                    <td className={`${td} py-4 px-6 text-slate-600 dark:text-slate-400`}>{lead.followUp || 'N/A'}</td>
                                    <td className="px-6 py-4 flex items-center justify-between gap-4">
                                        <span className="text-slate-600 dark:text-slate-400 italic text-sm truncate max-w-[150px]" title={lead.actions}>{lead.actions || '—'}</span>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => openEditModal(lead)}
                                                className="p-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 rounded-md transition-colors text-slate-500 hover:text-blue-600 shadow-sm"
                                                title="Edit Lead"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteLead(lead.id)}
                                                className="p-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-red-500 dark:hover:border-red-500 rounded-md transition-colors text-slate-500 hover:text-red-600 shadow-sm"
                                                title="Delete Lead"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="7" className="py-8 text-center text-slate-500 dark:text-slate-400">
                                        No leads found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit/Add Lead Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                {editingLeadId ? 'Edit Lead' : 'Add New Lead'}
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                {!editingLeadId && (
                                    <>
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                                            <input type="text" className={input} placeholder="Jane Doe"
                                                value={leadForm.name} onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone</label>
                                            <input type="tel" className={input} placeholder="1234567890"
                                                value={leadForm.phone} onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Source</label>
                                            <select className={input} value={leadForm.source} onChange={(e) => setLeadForm({ ...leadForm, source: e.target.value })}>
                                                <option>Website</option>
                                                <option>Referral</option>
                                                <option>Social Media</option>
                                                <option>Direct Mail</option>
                                                <option>Cold Call</option>
                                            </select>
                                        </div>
                                    </>
                                )}
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Latest Action</label>
                                    <input type="text" className={input} placeholder="E.g. Sent introductory email"
                                        value={leadForm.actions} onChange={(e) => setLeadForm({ ...leadForm, actions: e.target.value })} />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Assigned To</label>
                                    <input type="text" className={input} placeholder="Sales Team A"
                                        value={leadForm.assignedTo} onChange={(e) => setLeadForm({ ...leadForm, assignedTo: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Follow-up Date</label>
                                    <input type="date" className={input} value={leadForm.followUp}
                                        onChange={(e) => setLeadForm({ ...leadForm, followUp: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
                                    <select className={input} value={leadForm.status} onChange={(e) => setLeadForm({ ...leadForm, status: e.target.value })}>
                                        <option>New</option>
                                        <option>Contacted</option>
                                        <option>Qualified</option>
                                        <option>Unqualified</option>
                                        <option>Converted</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                            <button onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                                Cancel
                            </button>
                            <button onClick={handleSaveLead}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm shadow-blue-600/20">
                                <Save size={16} /> {editingLeadId ? 'Update Lead' : 'Save Lead'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
