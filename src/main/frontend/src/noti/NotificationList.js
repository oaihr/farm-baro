import React, { useState, useEffect } from 'react';
import { useWebSocket } from '../services/useWebSocket';

const NotificationList = ({ userId }) => {
    const [notifications, setNotifications] = useState([]);
    const { isConnected, subscribe } = useWebSocket();

    useEffect(() => {
        let subscription;
        if (isConnected && userId) {
            subscription = subscribe(`/topic/user/${userId}`, (data) => {
                console.log('Received notification:', data);
                setNotifications((prevNotifications) => [data, ...prevNotifications]);
            });
        }

        return () => {
            if (subscription) {
                subscription.unsubscribe();
            }
        };
    }, [isConnected, userId, subscribe]);

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