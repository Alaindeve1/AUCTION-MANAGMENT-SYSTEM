import React, { createContext, useContext, useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const WebSocketContext = createContext(null);

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }) => {
    const [stompClient, setStompClient] = useState(null);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8080/ws';
        
        const socket = new SockJS(wsUrl);
        const client = new Client({
            webSocketFactory: () => socket,
            debug: (str) => {
                console.log(str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        client.onConnect = () => {
            console.log('Connected to WebSocket');
            setConnected(true);
        };

        client.onStompError = (frame) => {
            console.error('STOMP error:', frame);
            setConnected(false);
        };

        client.activate();
        setStompClient(client);

        return () => {
            if (client.connected) {
                client.deactivate();
            }
        };
    }, []);

    const subscribe = (destination, callback) => {
        if (stompClient && connected) {
            return stompClient.subscribe(destination, callback);
        }
        return null;
    };

    const send = (destination, body) => {
        if (stompClient && connected) {
            stompClient.publish({
                destination,
                body: JSON.stringify(body)
            });
        }
    };

    const value = {
        connected,
        subscribe,
        send
    };

    return (
        <WebSocketContext.Provider value={value}>
            {children}
        </WebSocketContext.Provider>
    );
}; 