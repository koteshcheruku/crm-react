import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import api from './api';

const NotificationContext = createContext({
    notifications: [],
    unreadCount: 0,
    markRead: () => {},
    markAllRead: () => {},
});

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const stompRef = useRef(null);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    // Fetch initial notifications
    const fetchNotifications = useCallback(async () => {
        try {
            const res = await api.get('/notifications');
            setNotifications(res.data || []);
        } catch {
            // silently ignore – user may not be authenticated yet
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) return;

        fetchNotifications();

        const client = new Client({
            webSocketFactory: () => new SockJS('/ws'),
            connectHeaders: { Authorization: `Bearer ${token}` },
            reconnectDelay: 5000,
            onConnect: () => {
                client.subscribe('/user/queue/notifications', message => {
                    try {
                        const notification = JSON.parse(message.body);
                        setNotifications(prev => [notification, ...prev]);
                    } catch {
                        // ignore malformed messages
                    }
                });
            },
        });

        client.activate();
        stompRef.current = client;

        return () => { client.deactivate(); };
    }, [fetchNotifications]);

    const markRead = useCallback(async (id) => {
        try {
            await api.patch(`/notifications/${id}/read`);
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, isRead: true } : n)
            );
        } catch {
            // ignore
        }
    }, []);

    const markAllRead = useCallback(async () => {
        try {
            await api.patch('/notifications/read-all');
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch {
            // ignore
        }
    }, []);

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, markRead, markAllRead }}>
            {children}
        </NotificationContext.Provider>
    );
};
