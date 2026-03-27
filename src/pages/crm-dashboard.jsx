// ============================================================================
// PRODUCTION-READY PAGE COMPONENTS
// ============================================================================

import React, { useState, useEffect } from 'react';
import {
  Search, Plus, Eye, Edit2, ChevronDown, Filter,
  BarChart3, TrendingUp, Clock, CheckSquare, Users, Phone, MessageSquare, FileText,
  Download, Mic, Send, Paperclip, User, Settings, Lock, Calendar,
  Menu, X, Bell, LogOut, AlertCircle, EyeOff
} from 'lucide-react';

// ─── Shared card / heading classes ───────────────────────────────────────────
const card = 'bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700';
const h1cls = 'text-4xl font-bold text-slate-900 dark:text-white mb-2';
const sub = 'text-slate-600 dark:text-slate-400';
const th = 'px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-slate-200';
const td = 'px-6 py-4 text-slate-600 dark:text-slate-400';
const tdbold = 'px-6 py-4 font-semibold text-slate-900 dark:text-white';
const trRow = 'border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors';
const thead = 'border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50';
const pill = 'flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all font-semibold';
const input = 'w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500';

// ============================================================================
// 1. DASHBOARD PAGE
// ============================================================================

export const DashboardPage = () => {
  const [leads, setLeads] = useState(0);
  const [newToday, setNewToday] = useState(0);
  const [followUps, setFollowUps] = useState(0);
  const [activeTasks, setActiveTasks] = useState(0);

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
            {[
              { status: 'New', count: 0, percentage: 0, color: 'from-blue-500 to-cyan-400' },
              { status: 'Contacted', count: 0, percentage: 0, color: 'from-purple-500 to-pink-400' },
              { status: 'Qualified', count: 0, percentage: 0, color: 'from-emerald-500 to-teal-400' },
              { status: 'Converted', count: 0, percentage: 0, color: 'from-orange-500 to-amber-400' },
            ].map((item, idx) => (
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

        {/* Performance Metrics */}
        <div className={`${card} p-6`}>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Performance</h2>
          <div className="space-y-6">
            {[
              { label: 'Conversion Rate', value: '—', trend: '' },
              { label: 'Avg. Response Time', value: '—', trend: '' },
              { label: 'Customer Satisfaction', value: '—', trend: '' },
            ].map((metric, idx) => (
              <div key={idx} className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700 last:border-0 last:pb-0">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{metric.label}</span>
                <div className="text-right">
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{metric.value}</p>
                  <p className="text-xs text-emerald-600 font-semibold">{metric.trend}</p>
                </div>
              </div>
            ))}
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

// ============================================================================
// 2. LEADS PAGE
// ============================================================================

export const LeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLeads = leads.filter(lead => {
    const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  const statuses = ['All', 'New', 'Contacted', 'Qualified', 'Converted'];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className={h1cls}>Leads</h1>
          <p className={sub}>Manage and track your sales leads</p>
        </div>
        <button className={pill}><Plus size={20} />Add Lead</button>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`pl-12 pr-4 py-3 ${input}`}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {statuses.map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${statusFilter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-500'
                }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className={`${card} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={thead}>
                <th className={th}>Name</th>
                <th className={th}>Phone</th>
                <th className={th}>Source</th>
                <th className={th}>Status</th>
                <th className={th}>Assigned To</th>
                <th className={th}>Follow-up</th>
                <th className={th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map(lead => (
                <tr key={lead.id} className={trRow}>
                  <td className={tdbold}>{lead.name}</td>
                  <td className={td}>{lead.phone}</td>
                  <td className={td}>{lead.source}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${{
                        'New': 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400',
                        'Contacted': 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-400',
                        'Qualified': 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400',
                        'Converted': 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400',
                      }[lead.status]
                      }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className={td}>{lead.assignedTo}</td>
                  <td className={td}>{lead.followUp}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"><Eye size={16} /></button>
                    <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"><Edit2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 3. CUSTOMERS PAGE
// ============================================================================

export const CustomersPage = () => {
  const [customers] = useState([]);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className={h1cls}>Customers</h1>
          <p className={sub}>Manage customer accounts and relationships</p>
        </div>
        <button className={pill}><Plus size={20} />Add Customer</button>
      </div>

      <div className={`${card} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={thead}>
                <th className={th}>Name</th>
                <th className={th}>Phone</th>
                <th className={th}>Email</th>
                <th className={th}>Account Manager</th>
                <th className={th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(customer => (
                <tr key={customer.id} className={trRow}>
                  <td className={tdbold}>{customer.name}</td>
                  <td className={td}>{customer.phone}</td>
                  <td className={td}>{customer.email}</td>
                  <td className={td}>{customer.manager}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors text-slate-600 dark:text-slate-400"><Eye size={16} /></button>
                    <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors text-slate-600 dark:text-slate-400"><Edit2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 4. TASKS PAGE
// ============================================================================

export const TasksPage = () => {
  const [tasks, setTasks] = useState([]);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className={h1cls}>Tasks</h1>
          <p className={sub}>Manage and track team tasks</p>
        </div>
        <button className={pill}><Plus size={20} />Create Task</button>
      </div>

      <div className={`${card} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={thead}>
                <th className={th}>Task</th>
                <th className={th}>Assigned To</th>
                <th className={th}>Priority</th>
                <th className={th}>Status</th>
                <th className={th}>Due Date</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => (
                <tr key={task.id} className={trRow}>
                  <td className={tdbold}>{task.task}</td>
                  <td className={td}>{task.assignedTo}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${{
                        'High': 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400',
                        'Medium': 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400',
                        'Low': 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400',
                      }[task.priority]
                      }`}>{task.priority}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${{
                        'Completed': 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400',
                        'In Progress': 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400',
                        'Pending': 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300',
                      }[task.status]
                      }`}>{task.status}</span>
                  </td>
                  <td className={td}>{task.dueDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 5. COMMUNICATIONS PAGE
// ============================================================================

export const CommunicationsPage = () => {
  const [activeTab, setActiveTab] = useState('calls');
  const [communications] = useState([]);

  return (
    <div className="max-w-7xl mx-auto">
      <div>
        <h1 className={h1cls}>Communications</h1>
        <p className={`${sub} mb-8`}>Track calls, voice recordings, and chat logs</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-slate-200 dark:border-slate-700">
        {[
          { id: 'calls', label: 'Calls', icon: Phone },
          { id: 'recordings', label: 'Voice Recordings', icon: Mic },
          { id: 'chat', label: 'Chat Logs', icon: MessageSquare },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 font-medium border-b-2 transition-all ${activeTab === tab.id
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className={`${card} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={thead}>
                <th className={th}>Type</th>
                <th className={th}>Contact</th>
                <th className={th}>User</th>
                <th className={th}>Summary</th>
                <th className={th}>Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {communications.map(comm => (
                <tr key={comm.id} className={trRow}>
                  <td className="px-6 py-4">
                    <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 rounded-full text-xs font-semibold">{comm.type}</span>
                  </td>
                  <td className={tdbold}>{comm.contact}</td>
                  <td className={td}>{comm.user}</td>
                  <td className={td}>{comm.summary}</td>
                  <td className={td}>{comm.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 6. CHAT PAGE
// ============================================================================

export const ChatPage = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const chats = [];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          user: 'You',
          text: newMessage,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setNewMessage('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-120px)]">
      <div className="flex gap-6 h-full">
        {/* Chat List */}
        <div className={`w-80 ${card} flex-col hidden lg:flex`}>
          <div className="p-4 border-b border-slate-100 dark:border-slate-700">
            <h2 className="font-bold text-slate-900 dark:text-white mb-4">Messages</h2>
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
            />
          </div>
          <div className="flex-1 overflow-y-auto">
            {chats.map(chat => (
              <button
                key={chat.id}
                onClick={() => setSelectedChat(chat.id)}
                className={`w-full text-left px-4 py-4 border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${selectedChat === chat.id ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600' : ''
                  }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-slate-900 dark:text-white">{chat.name}</h3>
                  <span className={`w-2 h-2 rounded-full ${chat.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 truncate">{chat.lastMessage}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{chat.time}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className={`flex-1 ${card} flex flex-col`}>
          <div className="h-16 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between px-6">
            <h3 className="font-bold text-slate-900 dark:text-white">
              {chats.find(c => c.id === selectedChat)?.name ?? 'Select a conversation'}
            </h3>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                <Phone size={20} className="text-slate-600 dark:text-slate-400" />
              </button>
              <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                <Settings size={20} className="text-slate-600 dark:text-slate-400" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.user === 'You' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${msg.user === 'You'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white'
                  }`}>
                  <p className="text-sm">{msg.text}</p>
                  <p className={`text-xs mt-2 ${msg.user === 'You' ? 'text-blue-100' : 'text-slate-600 dark:text-slate-400'}`}>{msg.timestamp}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100 dark:border-slate-700 p-4">
            <div className="flex gap-3">
              <button className="p-3 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-600 dark:text-slate-400">
                <Paperclip size={20} />
              </button>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type a message..."
                className="flex-1 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
              />
              <button
                onClick={handleSendMessage}
                className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 7. DOCUMENTS PAGE
// ============================================================================

export const DocumentsPage = () => {
  const [documents] = useState([]);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className={h1cls}>Documents</h1>
          <p className={sub}>Manage and share CRM documents</p>
        </div>
        <button className={pill}><Plus size={20} />Upload Document</button>
      </div>

      <div className={`${card} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={thead}>
                <th className={th}>File Name</th>
                <th className={th}>Type</th>
                <th className={th}>Size</th>
                <th className={th}>Uploaded By</th>
                <th className={th}>Date</th>
                <th className={th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.map(doc => (
                <tr key={doc.id} className={trRow}>
                  <td className={tdbold}>{doc.name}</td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-xs font-semibold">{doc.type}</span>
                  </td>
                  <td className={td}>{doc.size}</td>
                  <td className={td}>{doc.uploadedBy}</td>
                  <td className={td}>{doc.date}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors text-slate-600 dark:text-slate-400"><Download size={16} /></button>
                    <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors text-slate-600 dark:text-slate-400"><Eye size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 8. REPORTS PAGE
// ============================================================================

export const ReportsPage = () => {
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
            {[
              { label: 'Total Revenue', value: '—', trend: '' },
              { label: 'Average Deal Size', value: '—', trend: '' },
              { label: 'Sales Cycle', value: '—', trend: '' },
            ].map((metric, idx) => (
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
            {[
              { source: 'Website', leads: 0, percentage: 0 },
              { source: 'LinkedIn', leads: 0, percentage: 0 },
              { source: 'Referral', leads: 0, percentage: 0 },
              { source: 'Other', leads: 0, percentage: 0 },
            ].map((item, idx) => (
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

// ============================================================================
// 9. USER MANAGEMENT PAGE
// ============================================================================

export const UserManagementPage = () => {
  const [users] = useState([]);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className={h1cls}>User Management</h1>
          <p className={sub}>Manage team members and their roles</p>
        </div>
        <button className={pill}><Plus size={20} />Add User</button>
      </div>

      <div className={`${card} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={thead}>
                <th className={th}>Name</th>
                <th className={th}>Email</th>
                <th className={th}>Role</th>
                <th className={th}>Status</th>
                <th className={th}>Join Date</th>
                <th className={th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className={trRow}>
                  <td className={tdbold}>{user.name}</td>
                  <td className={td}>{user.email}</td>
                  <td className={td}>{user.role}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${user.status === 'Active'
                        ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className={td}>{user.joinDate}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors text-slate-600 dark:text-slate-400"><Edit2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 10. ROLE MANAGEMENT PAGE
// ============================================================================

export const RoleManagementPage = () => {
  const [roles] = useState([]);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className={h1cls}>Role Management</h1>
          <p className={sub}>Manage user roles and permissions</p>
        </div>
        <button className={pill}><Plus size={20} />Create Role</button>
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
  );
};

// ============================================================================
// 11. SETTINGS PAGE
// ============================================================================

export const SettingsPage = () => {
  const [user] = React.useState({ name: 'Sarah Johnson', email: 'sarah@company.com' });

  const inputCls = `w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white`;
  const labelCls = 'block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2';

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className={h1cls}>Settings</h1>

      {/* Profile */}
      <div className={`${card} p-8 mb-6`}>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Profile Settings</h2>
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Full Name</label>
            <input type="text" defaultValue={user?.name} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Email</label>
            <input type="email" defaultValue={user?.email} className={inputCls} />
          </div>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">Save Changes</button>
        </div>
      </div>

      {/* Password */}
      <div className={`${card} p-8 mb-6`}>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Change Password</h2>
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Current Password</label>
            <input type="password" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>New Password</label>
            <input type="password" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Confirm Password</label>
            <input type="password" className={inputCls} />
          </div>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">Update Password</button>
        </div>
      </div>

      {/* Notifications */}
      <div className={`${card} p-8`}>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Notification Preferences</h2>
        <div className="space-y-4">
          {[
            { label: 'Email Notifications', desc: 'Receive updates via email' },
            { label: 'Task Reminders', desc: 'Get reminded about due tasks' },
            { label: 'Lead Updates', desc: 'Notifications for new leads' },
            { label: 'System Alerts', desc: 'Important system notifications' },
          ].map((pref, idx) => (
            <label key={idx} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded border-slate-300 dark:border-slate-600 w-4 h-4 accent-blue-600" />
              <div>
                <p className="font-medium text-slate-900 dark:text-white">{pref.label}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">{pref.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};