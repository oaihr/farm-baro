import { useState, useEffect } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

// 싱글톤(Singleton) 클라이언트 인스턴스
let stompClient = null;

const connectWebSocket = (onConnect) => {
    if (stompClient && stompClient.connected) {
        onConnect();
        return;
    }

    const socket = new SockJS('http://localhost:8080/ws-stomp');
    stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
        console.log('Connected to WebSocket');
        onConnect();
    });
};

export const useWebSocket = () => {
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        connectWebSocket(() => setIsConnected(true));
    }, []);

    const subscribe = (topic, onMessage) => {
        if (!stompClient || !stompClient.connected) {
            console.warn('WebSocket not connected. Cannot subscribe.');
            return null;
        }
        return stompClient.subscribe(topic, (message) => {
            onMessage(JSON.parse(message.body));
        });
    };

    const disconnect = () => {
        if (stompClient) {
            stompClient.disconnect();
            setIsConnected(false);
            stompClient = null;
        }
    };

    return { isConnected, subscribe, disconnect };
};