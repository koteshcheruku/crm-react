import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Download, Eye, Search, Upload, X, Paperclip, Trash2 } from 'lucide-react';
import { card, h1cls, sub, th, td, tdbold, trRow, thead, pill, modalBackdrop, modal, input } from '../components/ui/styles';
import api from '../lib/api';

export const DocumentsPage = () => {
    // State for documents and UI
    const [documents, setDocuments] = useState([]);
    const [filteredDocuments, setFilteredDocuments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [fileToUpload, setFileToUpload] = useState(null);
    const [docType, setDocType] = useState('OTHER');
    const [selectedDoc, setSelectedDoc] = useState(null);

    // Role-based access guard – only MANAGER and ADMIN can view this page
    const [currentUserInfo, setCurrentUserInfo] = useState(null);
    // Fetch current user info (including role) on mount
    useEffect(() => {
        api.get('/auth/me')
            .then(res => {
                setCurrentUserInfo(res.data);
            })
            .catch(err => {
                console.error('Failed to fetch current user', err);
            });
    }, []);
    // Correct fetchDocuments implementation using proper endpoint
    const fetchDocuments = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/documents'); // GET all documents
            setDocuments(res.data || []);
        } catch (err) {
            setError('Failed to fetch documents');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    // Removed duplicate fetchDocuments – using the corrected version above

    useEffect(() => {
        fetchDocuments();
    }, []);

    useEffect(() => {
        setFilteredDocuments(
            documents.filter(doc =>
                doc.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, documents]);
    if (!currentUserInfo) {
        return <div className="p-8 text-center">Loading...</div>;
    }

    const handleFileUpload = async () => {
        if (!fileToUpload) return;

        const formData = new FormData();
        formData.append('file', fileToUpload);
        formData.append('name', fileToUpload.name);
        formData.append('size', fileToUpload.size);
        formData.append('type', docType);

        try {
            const res = await api.post(`/documents/new/${currentUserInfo.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setDocuments(prev => [res.data, ...prev]);
            setIsUploadModalOpen(false);
            setFileToUpload(null);
            setDocType('OTHER');
        } catch (err) {
            console.error("Failed to upload document", err);
            setError('Failed to upload document');
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/documents/${id}`);
            setDocuments(prev => prev.filter(d => d.id !== id));
            setIsViewModalOpen(false);
            setSelectedDoc(null);
        } catch (err) {
            console.error("Failed to delete document", err);
            setError('Failed to delete document');
        }
    };

    const openViewModal = (doc) => {
        setSelectedDoc(doc);
        setIsViewModalOpen(true);
    };

    const UploadModal = () => (
        <div className={modalBackdrop}>
            <div className={`${modal} w-full max-w-md`}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Upload Document</h2>
                    <button onClick={() => setIsUploadModalOpen(false)}><X /></button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Category / Type</label>
                        <select
                            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                            value={docType}
                            onChange={(e) => setDocType(e.target.value)}
                        >
                            <option value="LEADS">Leads</option>
                            <option value="CUSTOMERS">Customers</option>
                            <option value="TASKS">Tasks</option>
                            <option value="COMMUNICATIONS">Communications</option>
                            <option value="REPORTS">Reports</option>
                            <option value="OTHER">Other</option>
                        </select>
                    </div>
                    <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center">
                        <Upload className="mx-auto text-slate-400" size={48} />
                        <p className="mt-2">Drag & drop a file here, or
                            <label htmlFor="file-upload" className="text-blue-500 font-semibold cursor-pointer"> browse</label>
                        </p>
                        <input id="file-upload" type="file" className="hidden" onChange={(e) => setFileToUpload(e.target.files[0])} />
                    </div>
                    {fileToUpload && (
                        <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-700 p-2 rounded-lg">
                            <div className="flex items-center gap-2">
                                <Paperclip size={16} />
                                <span className="text-sm font-medium">{fileToUpload.name}</span>
                            </div>
                            <button onClick={() => setFileToUpload(null)}><X size={16} /></button>
                        </div>

                    )}
                    <button className={`${pill} w-full justify-center`} disabled={!fileToUpload} onClick={handleFileUpload}>
                        <Upload size={20} /> Upload
                    </button>
                </div>
            </div>
        </div>
    );

    const ViewModal = () => {
        if (!selectedDoc) return null;
        return (
            <div className={modalBackdrop}>
                <div className={`${modal} w-full max-w-lg`}>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold truncate">{selectedDoc.name}</h2>
                        <button onClick={() => setIsViewModalOpen(false)}><X /></button>
                    </div>

                    <div className="space-y-4">
                        {/* Preview placeholder */}
                        <div className="bg-slate-100 dark:bg-slate-700 rounded-lg h-64 flex items-center justify-center">
                            <p className="text-slate-500">File preview not available</p>
                        </div>
                        <div className="text-sm">
                            <p><strong>Type:</strong> {selectedDoc.type}</p>
                            <p><strong>Size:</strong> {(selectedDoc.size / 1024).toFixed(2)} KB</p>
                            <p><strong>Uploaded:</strong> {new Date(selectedDoc.date).toLocaleDateString()}</p>
                            <p><strong>Uploaded By:</strong> {selectedDoc.uploadedBy}</p>
                        </div>
                        <div className="flex gap-4 mt-6">
                            <a href={`/api/documents/${selectedDoc.id}/download`} download className={`${pill} flex-1 justify-center`}>
                                <Download size={20} /> Download
                            </a>
                            <button className={`${pill} bg-red-500 hover:bg-red-600 flex-1 justify-center`} onClick={() => handleDelete(selectedDoc.id)}>
                                <Trash2 size={20} /> Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    };


    return (
        <div className="max-w-7xl mx-auto">
            {isUploadModalOpen && <UploadModal />}
            {isViewModalOpen && <ViewModal />}

            <div className="flex items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className={h1cls}>Documents</h1>
                    <p className={sub}>Manage and share CRM documents</p>
                </div>
                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search documents..."
                            className={`${input} pl-10`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className={pill} onClick={() => setIsUploadModalOpen(true)}>
                        <Plus size={20} />Upload Document
                    </button>
                </div>
            </div>

            <div className={`${card} overflow-hidden`}>
                <div className="overflow-x-auto">
                    {isLoading ? (
                        <p className="text-center p-8">Loading documents...</p>
                    ) : error ? (
                        <p className="text-center p-8 text-red-500">{error}</p>
                    ) : filteredDocuments.length === 0 ? (
                        <p className="text-center p-8">No documents found.</p>
                    ) : (
                        <table className="w-full">
                            <thead>
                                <tr className={thead}>
                                    <th className={th}>File Name</th>
                                    <th className={th}>Type</th>
                                    <th className={th}>Size (KB)</th>
                                    <th className={th}>Uploaded By</th>
                                    <th className={th}>Date</th>
                                    <th className={th}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredDocuments.map(doc => (
                                    <tr key={doc.id} className={trRow}>
                                        <td className={tdbold}>{doc.name}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-block px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-xs font-semibold">{doc.type}</span>
                                        </td>
                                        <td className={td}>{(doc.size / 1024).toFixed(2)}</td>
                                        <td className={td}>{doc.uploadedBy}</td>
                                        <td className={td}>{new Date(doc.date).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 flex gap-2">
                                            <a href={`/api/documents/${doc.id}/download`} download className="p-2 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors text-slate-600 dark:text-slate-400"><Download size={16} /></a>
                                            <button onClick={() => openViewModal(doc)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors text-slate-600 dark:text-slate-400"><Eye size={16} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};
