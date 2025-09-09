import React, { useState, useEffect, useCallback } from 'react';
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
        cartItems: 0,
        cartTotalAmount: 0
    });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    // 사용자 정보 가져오기 (세션에서)
    const fetchUserInfo = async () => {
        try {
            const response = await fetch('/api/auth/me', {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                setUserInfo(data);
            }
        } catch (error) {
            console.error('사용자 정보 조회 오류:', error);
        }
    };

    // 통계 정보 가져오기
    const fetchStats = useCallback(async () => {
        try {
            // 장바구니 통계 가져오기
            const cartResponse = await fetch(`http://localhost:8080/api/mypage/buyers/${userId}/cart/stats`, {
                credentials: 'include'
            });
            if (cartResponse.ok) {
                const cartStats = await cartResponse.json();
                setStats(prevStats => ({
                    ...prevStats,
                    cartItems: cartStats.totalItemCount || 0,
                    cartTotalAmount: cartStats.totalAmount || 0
                }));
            }
            
            // 실제 API가 구현되면 여기서 호출
            // const response = await fetch(`/api/mypage/buyers/${userId}/stats`);
            // if (response.ok) {
            //     const data = await response.json();
            //     setStats(data);
            // }
            
            // 임시로 기본값 설정
            setStats({
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
        } catch (error) {
            console.error('통계 정보 조회 오류:', error);
        }
    }, [userId]);

    useEffect(() => {
        fetchUserInfo();
        fetchStats();
        setLoading(false);
    }, [fetchStats]);

    // 빠른 액션 카드들
    const quickActions = [
        {
            icon: '📦',
            label: '주문/배송',
            path: `/mypage/buyer/${userId}/orders`
        },
        {
            icon: '⭐',
            label: '리뷰',
            path: `/mypage/buyer/${userId}/reviews`
        },
        {
            icon: '❓',
            label: '문의',
            path: `/mypage/buyer/${userId}/inquiries`
        },
        {
            icon: '🛒',
            label: '장바구니',
            path: `/mypage/buyer/${userId}/cart`
        },
        {
            icon: '👤',
            label: '프로필',
            path: `/mypage/buyer/${userId}/profile`
        }
    ];

    // 주문 진행 현황 데이터
    const orderProgress = [
        { label: '주문접수', count: stats.pendingOrders, icon: '📋', active: true },
        { label: '배송준비', count: 0, icon: '📦', active: false },
        { label: '배송중', count: 0, icon: '🚚', active: false },
        { label: '배송완료', count: stats.completedOrders, icon: '✅', active: false }
    ];

    if (loading) {
        return <div className="loading">마이페이지를 불러오는 중...</div>;
    }

    return (
        <div className="buyer-main-container">
            {/* 헤더 */}
            <div className="header">
                <h1>{userInfo?.name || '사용자'} 마이페이지</h1>
                <p>안녕하세요, {userInfo?.name || '사용자'}님! 오늘도 좋은 하루 되세요.</p>
            </div>

            {/* 탭 메뉴 */}
            <div className="tab-container">
                <div className="tabs">
                    <button 
                        className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        <span className="tab-icon">📊</span>
                        개요
                    </button>
                    <button 
                        className={`tab ${activeTab === 'orders' ? 'active' : ''}`}
                        onClick={() => setActiveTab('orders')}
                    >
                        <span className="tab-icon">📦</span>
                        주문
                    </button>
                    <button 
                        className={`tab ${activeTab === 'reviews' ? 'active' : ''}`}
                        onClick={() => setActiveTab('reviews')}
                    >
                        <span className="tab-icon">⭐</span>
                        리뷰
                    </button>
                </div>
            </div>

            {/* 빠른 액션 */}
            <div className="quick-actions">
                {quickActions.map((action, index) => (
                    <a 
                        key={index} 
                        href={action.path} 
                        className="quick-action-card"
                        onClick={(e) => {
                            e.preventDefault();
                            navigate(action.path);
                        }}
                    >
                        <div className="action-icon">{action.icon}</div>
                        <div className="action-label">{action.label}</div>
                    </a>
                ))}
            </div>

            {/* 사용자 요약 정보 */}
            <div className="user-summary">
                <div className="summary-left">
                    <h3>{userInfo?.name || '구매자'}</h3>
                    <div className="badge">구매자</div>
                    <div className="user-details">
                        <p>📧 {userInfo?.email || '이메일 없음'}</p>
                        <p>📱 {userInfo?.tel || '전화번호 없음'}</p>
                        <p>📍 {userInfo?.address || '주소 없음'}</p>
                    </div>
                    <div className="purchase-info">
                        <p><strong>총 구매액:</strong> {userInfo?.totalBalance || 0}원</p>
                        <p><strong>입찰 보증금:</strong> {userInfo?.bidDeposit || 0}원</p>
                    </div>
                </div>
                <div className="summary-stats">
                    <div className="stat-card">
                        <div className="stat-number">{stats.orders}</div>
                        <div className="stat-label">총 주문</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">{stats.completedOrders}</div>
                        <div className="stat-label">완료된 주문</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">{stats.reviews}</div>
                        <div className="stat-label">작성한 리뷰</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">{stats.cartItems || 0}</div>
                        <div className="stat-label">장바구니 상품</div>
                        <div className="stat-detail">총 {(stats.cartTotalAmount || 0).toLocaleString()}원</div>
                    </div>
                </div>
            </div>

            {/* 주문 진행 현황 */}
            <div className="order-progress">
                <h3>주문 진행 현황</h3>
                <div className="progress-bar">
                    <div className="progress-line"></div>
                    {orderProgress.map((step, index) => (
                        <div key={index} className={`progress-step ${step.active ? 'active' : ''}`}>
                            <div className="step-icon">{step.icon}</div>
                            <div className="step-label">{step.label}</div>
                            <div className="step-count">{step.count}건</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 최근 주문 정보 */}
            <div className="recent-orders">
                <div className="section-header">
                    <h3>최근 주문 정보</h3>
                    <a href={`/mypage/buyer/${userId}/orders`} className="more-link">
                        전체보기 →
                    </a>
                </div>
                <div className="orders-grid">
                    {/* 주문 정보가 없을 때 */}
                    <div className="order-card">
                        <div className="order-header">
                            <span className="order-date">주문 정보가 없습니다</span>
                            <span className="order-number">-</span>
                        </div>
                        <div className="order-status">주문 없음</div>
                        <div className="order-product">
                            <div className="product-image">📦</div>
                            <div className="product-info">
                                <div className="product-name">첫 주문을 시작해보세요!</div>
                                <div className="product-price">상품을 둘러보고 주문해보세요</div>
                                <div className="product-quantity">-</div>
                            </div>
                        </div>
                        <div className="order-actions">
                            <button 
                                className="action-btn primary"
                                onClick={() => navigate('/')}
                            >
                                쇼핑하러 가기
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BuyerMainPage;
