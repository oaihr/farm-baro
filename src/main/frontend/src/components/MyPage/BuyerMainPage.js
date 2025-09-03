import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './BuyerMainPage.css';

const BuyerMainPage = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);
    const [stats, setStats] = useState({
        orders: 0,
        completedOrders: 0,
        pendingOrders: 0,
        reviews: 0,
        avgRating: 0.0,
        fiveStarReviews: 0,
        inquiries: 0,
        pendingInquiries: 0,
        answeredInquiries: 0,
        bids: 0,
        activeBids: 0,
        wonAuctions: 0,
        cartItems: 0
    });
    const [loading, setLoading] = useState(true);

    // 사용자 정보 가져오기
    const fetchUserInfo = async () => {
        try {
            const response = await fetch(`http://localhost:8080/mypage/api/users/${userId}`);
            if (response.ok) {
                const data = await response.json();
                setUserInfo(data);
            }
        } catch (error) {
            console.error('사용자 정보 조회 오류:', error);
        }
    };

    // 통계 정보 가져오기
    const fetchStats = async () => {
        try {
            const response = await fetch(`http://localhost:8080/mypage/api/buyers/${userId}/stats`);
            if (response.ok) {
                const data = await response.json();
                setStats(data);
            }
        } catch (error) {
            console.error('통계 정보 조회 오류:', error);
        }
    };

    useEffect(() => {
        fetchUserInfo();
        fetchStats();
        setLoading(false);
    }, [userId]);

    // 메뉴 카드들
    const menuCards = [
        {
            title: '👤 개인정보',
            description: '프로필 정보 수정 및 비밀번호 변경',
            icon: '👤',
            path: `/buyer/${userId}/profile`,
            color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        },
        {
            title: '📦 주문/배송',
            description: '주문 내역, 배송 현황, 구매확정',
            icon: '📦',
            path: `/buyer/${userId}/orders`,
            color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
        },
        {
            title: '⭐ 리뷰',
            description: '작성한 리뷰 내역 및 수정',
            icon: '⭐',
            path: `/buyer/${userId}/reviews`,
            color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
        },
        {
            title: '❓ 문의',
            description: '상품 문의 내역 및 답변 확인',
            icon: '❓',
            path: `/buyer/${userId}/inquiries`,
            color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
        },
        {
            title: '🏆 경매',
            description: '입찰/낙찰 현황 및 결제',
            icon: '🏆',
            path: `/buyer/${userId}/auctions`,
            color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
        },
        {
            title: '🛒 장바구니',
            description: '담아둔 상품 및 결제',
            icon: '🛒',
            path: `/buyer/${userId}/cart`,
            color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
        }
    ];

    if (loading) {
        return <div className="loading">구매자 마이페이지를 불러오는 중...</div>;
    }

    return (
        <div className="buyer-main-container">
            {/* 헤더 */}
            <div className="header">
                <h1>👋 안녕하세요, {userInfo?.userName || '구매자'}님!</h1>
                <p>구매자 마이페이지에서 모든 정보를 한눈에 확인하세요</p>
            </div>

            {/* 프로필 섹션 */}
            <div className="profile-section">
                <div className="profile-info">
                    <div className="profile-avatar">
                        {userInfo?.userName ? userInfo.userName.charAt(0) : '👤'}
                    </div>
                    <div className="profile-details">
                        <h3>{userInfo?.userName || '사용자명'}</h3>
                        <p className="user-email">{userInfo?.email || '이메일 정보 없음'}</p>
                        <p className="user-phone">{userInfo?.tel || '전화번호 정보 없음'}</p>
                        <p className="user-address">{userInfo?.address || '주소 정보 없음'}</p>
                    </div>
                </div>
                <button 
                    className="edit-profile-btn"
                    onClick={() => navigate(`/buyer/${userId}/profile`)}
                >
                    ✏️ 프로필 수정
                </button>
            </div>

            {/* 통계 섹션 */}
            <div className="stats-section">
                <h3>📊 구매 활동 요약</h3>
                <div className="stats-grid">
                    <div className="stat-item">
                        <div className="stat-icon">📦</div>
                        <div className="stat-content">
                            <div className="stat-number">{stats.orders}</div>
                            <div className="stat-label">총 주문</div>
                            <div className="stat-detail">
                                완료: {stats.completedOrders} | 진행중: {stats.pendingOrders}
                            </div>
                        </div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-icon">⭐</div>
                        <div className="stat-content">
                            <div className="stat-number">{stats.reviews}</div>
                            <div className="stat-label">작성한 리뷰</div>
                            <div className="stat-detail">
                                평균: {stats.avgRating}점 | 5점: {stats.fiveStarReviews}개
                            </div>
                        </div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-icon">❓</div>
                        <div className="stat-content">
                            <div className="stat-number">{stats.inquiries}</div>
                            <div className="stat-label">상품 문의</div>
                            <div className="stat-detail">
                                답변대기: {stats.pendingInquiries} | 답변완료: {stats.answeredInquiries}
                            </div>
                        </div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-icon">🏆</div>
                        <div className="stat-content">
                            <div className="stat-number">{stats.bids}</div>
                            <div className="stat-label">경매 참여</div>
                            <div className="stat-detail">
                                진행중: {stats.activeBids} | 낙찰: {stats.wonAuctions}
                            </div>
                        </div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-icon">🛒</div>
                        <div className="stat-content">
                            <div className="stat-number">{stats.cartItems}</div>
                            <div className="stat-label">장바구니</div>
                            <div className="stat-detail">
                                담아둔 상품 수
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 메뉴 섹션 */}
            <div className="menu-section">
                <h3>🚀 빠른 메뉴</h3>
                <div className="menu-grid">
                    {menuCards.map((menu, index) => (
                        <div 
                            key={index} 
                            className="menu-card"
                            onClick={() => navigate(menu.path)}
                        >
                            <div className="menu-icon" style={{ background: menu.color }}>
                                {menu.icon}
                            </div>
                            <div className="menu-content">
                                <h4>{menu.title}</h4>
                                <p>{menu.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 최근 활동 */}
            <div className="recent-activity">
                <h3>📅 최근 활동</h3>
                <div className="activity-list">
                    <div className="activity-item">
                        <div className="activity-icon">📦</div>
                        <div className="activity-content">
                            <p><strong>최근 주문:</strong> {stats.orders > 0 ? `${stats.orders}건의 주문` : '주문 내역이 없습니다'}</p>
                        </div>
                    </div>
                    <div className="activity-item">
                        <div className="activity-icon">⭐</div>
                        <div className="activity-content">
                            <p><strong>리뷰 활동:</strong> {stats.reviews > 0 ? `${stats.reviews}개의 리뷰 작성` : '작성한 리뷰가 없습니다'}</p>
                        </div>
                    </div>
                    <div className="activity-item">
                        <div className="activity-icon">🏆</div>
                        <div className="activity-content">
                            <p><strong>경매 참여:</strong> {stats.bids > 0 ? `${stats.bids}건의 경매 참여` : '참여한 경매가 없습니다'}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 빠른 액션 */}
            <div className="quick-actions">
                <h3>⚡ 빠른 액션</h3>
                <div className="action-buttons">
                    <button 
                        className="action-btn primary"
                        onClick={() => navigate('/sale')}
                    >
                        🥩 상품 둘러보기
                    </button>
                    <button 
                        className="action-btn secondary"
                        onClick={() => navigate(`/buyer/${userId}/cart`)}
                    >
                        🛒 장바구니 확인
                    </button>
                    <button 
                        className="action-btn secondary"
                        onClick={() => navigate(`/buyer/${userId}/orders`)}
                    >
                        📦 주문 내역 확인
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BuyerMainPage;
