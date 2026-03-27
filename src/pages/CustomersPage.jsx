import React, { useState, useEffect } from 'react';
import { Plus, Eye, Edit2, X, Save, Trash2 } from 'lucide-react';
import { card, h1cls, sub, th, td, tdbold, trRow, thead, pill, input } from '../components/ui/styles';
import api from '../lib/api';

export const CustomersPage = () => {
    const [customers, setCustomers] = useState([]);

    // Form Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCustomerId, setEditingCustomerId] = useState(null);
    const [customerForm, setCustomerForm] = useState({
        name: '',
        phone: '',
        email: '',
        accountManager: '',
        currentPlan: 'Basic',
        paidReceiptNo: '',
        status: 'Active',
        joinedDate: new Date().toISOString().split('T')[0]
    });

    // View Details Modal State
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [viewingCustomer, setViewingCustomer] = useState(null);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const res = await api.get('/customers');
                if (res.data) setCustomers(res.data);
            } catch (err) {
                console.error("Failed to fetch customers", err);
            }
        };
        fetchCustomers();
    }, []);

    const openAddModal = () => {
        setEditingCustomerId(null);
        setCustomerForm({
            name: '',
            phone: '',
            email: '',
            accountManager: '',
            currentPlan: 'Basic',
            paidReceiptNo: '',
            status: 'Active',
            joinedDate: new Date().toISOString().split('T')[0]
        });
        setIsModalOpen(true);
    };

    const openEditModal = (customer) => {
        setEditingCustomerId(customer.id);
        setCustomerForm({
            name: customer.name || customer.names || '',
            phone: customer.phone || '',
            email: customer.email || '',
            accountManager: customer.accountManager || '',
            currentPlan: customer.currentPlan || 'Basic',
            paidReceiptNo: customer.paidReceiptNo || '',
            status: customer.status || 'Active',
            joinedDate: customer.joinedDate || new Date().toISOString().split('T')[0]
        });
        setIsModalOpen(true);
    };

    const openViewModal = (customer) => {
        setViewingCustomer(customer);
        setIsViewModalOpen(true);
    };

    const handleSaveCustomer = async () => {
        try {
            const backendPayload = { ...customerForm };
            // Ensure consistency if backend uses "names"
            backendPayload.names = customerForm.name;

            const empId = localStorage.getItem('employeeId');
            if (empId) {
                backendPayload.employeeId = empId;
            }

            if (editingCustomerId) {
                // EDIT MODE (PUT request)
                const res = await api.put(`/customers/${editingCustomerId}`, backendPayload);
                if (res.data) {
                    setCustomers(customers.map(c => c.id === editingCustomerId ? res.data : c));
                }

                // Local State Update Fallback
                setCustomers(customers.map(c =>
                    c.id === editingCustomerId ? { ...c, ...customerForm, names: customerForm.name } : c
                ));
            } else {
                // ADD MODE (POST request)
                const res = await api.post('/customers/new', backendPayload);
                if (res.data) {
                    setCustomers([...customers, res.data]);
                }

                // Local State Update Fallback
                const newId = Math.random().toString(36).substring(7);
                setCustomers([...customers, { id: newId, ...customerForm, names: customerForm.name }]);
            }

            setIsModalOpen(false);
        } catch (err) {
            console.error("Failed to save customer", err);
        }
    };

    return (
        <div className="max-w-7xl mx-auto relative">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className={h1cls}>Customers</h1>
                    <p className={sub}>Manage customer accounts and relationships</p>
                </div>
                <button onClick={openAddModal} className={pill}><Plus size={20} />Add Customer</button>
            </div>

            <div className={`${card} overflow-hidden shadow-sm`}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className={`${thead} bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700`}>
                                <th className={`${th} py-4 px-6 font-semibold text-slate-500 dark:text-slate-400`}>Name</th>
                                <th className={`${th} py-4 px-6 font-semibold text-slate-500 dark:text-slate-400`}>Phone</th>
                                <th className={`${th} py-4 px-6 font-semibold text-slate-500 dark:text-slate-400`}>Email</th>
                                <th className={`${th} py-4 px-6 font-semibold text-slate-500 dark:text-slate-400`}>Account Manager</th>
                                <th className={`${th} py-4 px-6 font-semibold text-slate-500 dark:text-slate-400`}>Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {customers.length > 0 ? customers.map((customer, idx) => (
                                <tr key={customer.id || idx} className={`${trRow} group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors`}>
                                    <td className={`${tdbold} py-4 px-6 text-slate-900 dark:text-white font-medium`}>{customer.name || customer.names}</td>
                                    <td className={`${td} py-4 px-6 text-slate-600 dark:text-slate-400`}>{customer.phone}</td>
                                    <td className={`${td} py-4 px-6 text-slate-600 dark:text-slate-400`}>{customer.email}</td>
                                    <td className={`${td} py-4 px-6 text-slate-600 dark:text-slate-400`}>{customer.accountManager}</td>
                                    <td className="px-6 py-4 flex gap-2">
                                        <button onClick={() => openViewModal(customer)} className="p-2 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-500/10 dark:hover:text-blue-400 rounded-lg transition-colors text-slate-500" title="View Details"><Eye size={16} /></button>
                                        <button onClick={() => openEditModal(customer)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-500 hover:text-slate-900 dark:hover:text-white" title="Edit"><Edit2 size={16} /></button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="py-8 text-center text-slate-500 dark:text-slate-400">
                                        No customers found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit/Add Customer Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                {editingCustomerId ? 'Edit Customer' : 'Add New Customer'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                                    <input type="text" className={input} placeholder="John Doe" value={customerForm.name} onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })} />
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                                    <input type="email" className={input} placeholder="john@example.com" value={customerForm.email} onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })} />
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone</label>
                                    <input type="tel" className={input} placeholder="1234567890" value={customerForm.phone} onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })} />
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Account Manager</label>
                                    <input type="text" className={input} placeholder="Manager Name" value={customerForm.accountManager} onChange={(e) => setCustomerForm({ ...customerForm, accountManager: e.target.value })} />
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Current Plan</label>
                                    <select className={input} value={customerForm.currentPlan} onChange={(e) => setCustomerForm({ ...customerForm, currentPlan: e.target.value })}>
                                        <option>Basic</option>
                                        <option>Pro</option>
                                        <option>Enterprise</option>
                                    </select>
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Paid Receipt No.</label>
                                    <input type="text" className={input} placeholder="RCPT-XXXX" value={customerForm.paidReceiptNo} onChange={(e) => setCustomerForm({ ...customerForm, paidReceiptNo: e.target.value })} />
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
                                    <select className={input} value={customerForm.status} onChange={(e) => setCustomerForm({ ...customerForm, status: e.target.value })}>
                                        <option>Active</option>
                                        <option>Inactive</option>
                                        <option>Churned</option>
                                    </select>
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Joined Date</label>
                                    <input type="date" className={input} value={customerForm.joinedDate} onChange={(e) => setCustomerForm({ ...customerForm, joinedDate: e.target.value })} />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Cancel</button>
                            <button onClick={handleSaveCustomer} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm shadow-blue-600/20">
                                <Save size={16} /> {editingCustomerId ? 'Update' : 'Save'} Customer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Details Modal */}
            {isViewModalOpen && viewingCustomer && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Eye className="text-blue-500" size={24} />
                                Customer Details
                            </h2>
                            <button onClick={() => setIsViewModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Contact Info</h3>
                                        <p className="text-lg font-medium text-slate-900 dark:text-white">{viewingCustomer.name || viewingCustomer.names || 'N/A'}</p>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">{viewingCustomer.email || 'No email provided'}</p>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">{viewingCustomer.phone || 'No phone provided'}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Account Management</h3>
                                        <p className="text-sm text-slate-900 dark:text-white"><span className="text-slate-500 mr-2">Manager:</span>{viewingCustomer.accountManager || 'Unassigned'}</p>
                                        <p className="text-sm text-slate-900 dark:text-white"><span className="text-slate-500 mr-2">Status:</span>
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ml-1 ${viewingCustomer.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400' :
                                                viewingCustomer.status === 'Inactive' ? 'bg-slate-100 text-slate-800 dark:bg-slate-500/10 dark:text-slate-400' :
                                                    'bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-400'
                                                }`}>
                                                {viewingCustomer.status || 'Active'}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Billing & Planning</h3>
                                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-100 dark:border-slate-800">
                                            <p className="text-sm text-slate-900 dark:text-white mb-2 flex items-center justify-between"><span className="font-medium text-slate-500">Plan:</span> <span>{viewingCustomer.currentPlan || 'Basic'}</span></p>
                                            <p className="text-sm text-slate-900 dark:text-white mb-2 flex items-center justify-between"><span className="font-medium text-slate-500">Receipt No:</span> <span className="font-mono text-blue-600 dark:text-blue-400">{viewingCustomer.paidReceiptNo || 'N/A'}</span></p>
                                            <p className="text-sm text-slate-900 dark:text-white flex items-center justify-between"><span className="font-medium text-slate-500">Joined Date:</span> <span>{viewingCustomer.joinedDate || 'N/A'}</span></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-end gap-3">
                            <button onClick={() => setIsViewModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Close</button>
                            <button onClick={() => { setIsViewModalOpen(false); openEditModal(viewingCustomer); }} className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20 text-sm font-medium rounded-lg transition-colors">
                                <Edit2 size={16} /> Edit Customer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
