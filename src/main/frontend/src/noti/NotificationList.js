import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWebSocket } from '../services/useWebSocket';
import axios from 'axios';

const formatTimeAgo = (timeArray) => {
    // 💡 입력이 유효한 배열인지 확인
    if (!Array.isArray(timeArray) || timeArray.length < 6) {
        return "Invalid date";
    }

    const [year, month, day, hour, minute, second, nanosecond] = timeArray;

    // Date 객체는 월을 0부터 시작하므로 month - 1을 해줍니다.
    const notificationTime = new Date(year, month - 1, day, hour, minute, second);

    // 나노초가 넘어오는 경우 밀리초로 변환하여 더해줍니다.
    if (nanosecond) {
        // 나노초를 밀리초로 변환 (1000000으로 나눔)
        notificationTime.setMilliseconds(Math.floor(nanosecond / 1000000));
    }

    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - notificationTime.getTime()) / 1000);

    if (diffInSeconds < 60) {
        return "방금 전";
    }
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `${diffInMinutes}분 전`;
    }
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${diffInHours}시간 전`;
    }
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
        return `${diffInDays}일 전`;
    }

    // 7일 이상 지난 경우 YYYY-MM-DD 형식으로 반환
    const formattedMonth = String(month).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    return `${year}-${formattedMonth}-${formattedDay}`;
};

const NotificationList = ({ userId }) => {

    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const { isConnected, subscribe } = useWebSocket();

    useEffect(() => {
        const fetchInitialNotifications = async () => {
            if (!userId) return;
            try {
                const response = await axios.get(`/home/notifications?userId=${userId}`);
                setNotifications(response.data);
            } catch (error) {
                console.error("Failed to fetch initial notifications:", error);
            }
        };

        fetchInitialNotifications();

        let subscription;
        if (isConnected && userId) {
            subscription = subscribe(`/topic/user/${userId}`, (data) => {
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
                    {notifications.map((noti, index) => {
                        const handleNotificationClick = async () => {
                            try {
                                // 알림 읽음 상태 업데이트 API 호출
                                await axios.get(`/home/notifications/isRead?notificationId=${noti.notificationId}`);
                            } catch (error) {
                                console.error("알림 읽음 상태 업데이트 실패:", error);
                            }
                            // 페이지 이동
                            navigate(`/auction/${noti.relatedId}`);
                        };

                        // 💡 noti.isRead 값에 따라 클래스 동적 할당
                        const itemClassName = noti.isRead === 'Y' ?
                            "notification-item read" :
                            "notification-item unread";

                        return (
                            <li key={index} className="notification-item-wrapper">
                                <div className={itemClassName} onClick={handleNotificationClick}>
                                    <div className="notification-content">
                                        <strong style={{ color: "#38761D" }}>[{noti.title}]</strong>
                                        <strong>{noti.type}</strong>: {noti.message}
                                    </div>
                                    <span className="notification-time">{formatTimeAgo(noti.createdTime)}</span>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
            <hr className='hr'></hr>
        </div>
    );
};

export default NotificationList;