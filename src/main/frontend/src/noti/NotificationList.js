import React, { useState, useEffect } from 'react';
import { useWebSocket } from '../services/useWebSocket';
import axios from 'axios'; // axios를 사용하면 API 호출이 더 편리합니다.

const NotificationList = ({ userId }) => {
    // 💡 초기 알림 상태를 관리합니다.
    const [notifications, setNotifications] = useState([]);
    const { isConnected, subscribe } = useWebSocket();

    useEffect(() => {
        // --- 1. DB에서 초기 알림 목록을 불러옵니다. ---
        const fetchInitialNotifications = async () => {
            if (!userId) return;

            try {
                // 💡 백엔드에 알림 목록을 요청하는 API 엔드포인트입니다.
                // 이 엔드포인트를 직접 구현해야 합니다.
                const response = await axios.get(`/home/notifications?userId=${userId}`);
                setNotifications(response.data);
            } catch (error) {
                console.error("Failed to fetch initial notifications:", error);
            }
        };

        fetchInitialNotifications();

        // --- 2. 웹소켓을 구독하여 실시간 알림을 받습니다. ---
        let subscription;
        if (isConnected && userId) {
            subscription = subscribe(`/topic/user/${userId}`, (data) => {
                console.log('Received real-time notification:', data);
                // 실시간으로 받은 알림을 기존 목록에 추가합니다.
                setNotifications((prevNotifications) => [data, ...prevNotifications]);
            });
        }

        // 컴포넌트가 언마운트될 때 웹소켓 구독을 해제합니다.
        return () => {
            if (subscription) {
                subscription.unsubscribe();
            }
        };
    }, [isConnected, userId, subscribe]); // isConnected와 userId가 변경될 때마다 useEffect를 다시 실행합니다.

    return (
        <div className="notification-container">
            <h3>내 알림</h3>
            <hr className='hr'></hr>
            {notifications.length === 0 ? (
                <p>알림이 없습니다.</p>
            ) : (
                <ul>
                    {notifications.map((noti, index) => (
                        <li key={index} className="notification-item">
                            <strong>{noti.type}</strong>: {noti.message}
                        </li>
                    ))}
                </ul>
            )}
            <hr className='hr'></hr>
        </div>
    );
};

export default NotificationList;