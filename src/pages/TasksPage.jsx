import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { card, h1cls, sub, th, td, tdbold, trRow, thead, pill } from '../components/ui/styles';
import api from '../lib/api';

export const TasksPage = () => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await api.get('/tasks');
                if (res.data) setTasks(res.data);
            } catch (err) {
                console.error("Failed to fetch tasks", err);
            }
        };
        fetchTasks();
    }, []);

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
