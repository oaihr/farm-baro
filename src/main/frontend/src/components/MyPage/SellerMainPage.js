import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './SellerMainPage.css';

const SellerMainPage = () => {
    const { userId } = useParams();
    const [activeTab, setActiveTab] = useState('dashboard');
    
    // 임시 데이터 (나중에 API로 교체)
    const userInfo = {
        ID: 'seller001',
        USERNAME: '테스트용 닉네임1',
        EMAIL: 'seller1@example.com',
        TEL: '010-3456-7890',
        ADDRESS: '경기도 성남시',
        BUSINESS_NUMBER: '123-45-67890',
        TOTAL_SALES: 200000,
        AVAILABLE_BALANCE: 100000,
        COUPONS: 3,
        POINTS: 5000,
        PENDING_ORDERS: 2
    };

    const orderStats = {
        pending: 1,
        processing: 0,
        shipping: 0,
        delivered: 0,
        completed: 0
    };

    const recentOrders = [
        {
            id: '#12377',
            date: '2024.01.15',
            status: '주문대기',
            product: '프리미엄 한우 등심 500g',
            price: '45,000원',
            quantity: '1개'
        },
        {
            id: '#12376',
            date: '2024.01.14',
            status: '배송완료',
            product: '돼지고기 삼겹살 1kg',
            price: '28,000원',
            quantity: '2개'
        }
    ];

    const tabs = [
        { id: 'dashboard', label: '대시보드', icon: '📊' },
        { id: 'products', label: '상품관리', icon: '🥩' },
        { id: 'orders', label: '주문관리', icon: '📋' },
        { id: 'reviews', label: '리뷰관리', icon: '⭐' },
        { id: 'inquiries', label: '문의관리', icon: '❓' }
    ];

    const quickActions = [
        { icon: '🥩', label: '상품 등록', link: `/mypage/seller/${userId}/product-register` },
        { icon: '📋', label: '주문 현황', link: `/mypage/seller/${userId}/orders` },
        { icon: '⭐', label: '리뷰 확인', link: `/mypage/seller/${userId}/reviews` },
        { icon: '❓', label: '문의 답변', link: `/mypage/seller/${userId}/inquiries` },
        { icon: '👤', label: '정보 수정', link: `/mypage/seller/${userId}/edit` }
    ];

    return (
        <div className="seller-main-container">
            {/* 헤더 */}
            <div className="header">
                <h1>내 계정</h1>
                <p>고기 판매자 정보와 활동을 한 곳에서 관리하세요</p>
            </div>

            {/* 탭 메뉴 */}
            <div className="tab-container">
                <div className="tabs">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <span className="tab-icon">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* 빠른 액션 카드 */}
            <div className="quick-actions">
                {quickActions.map((action, index) => (
                    <Link key={index} to={action.link} className="quick-action-card">
                        <div className="action-icon">{action.icon}</div>
                        <div className="action-label">{action.label}</div>
                    </Link>
                ))}
            </div>

            {/* 사용자 요약 정보 */}
            <div className="user-summary">
                <div className="summary-left">
                    <div className="user-profile">
                        <h3>{userInfo.USERNAME}</h3>
                        <span className="badge">SELLER</span>
                    </div>
                    <div className="user-details">
                        <p>📧 {userInfo.EMAIL}</p>
                        <p>📱 {userInfo.TEL}</p>
                        <p>📍 {userInfo.ADDRESS}</p>
                        <p>🏢 사업자번호: {userInfo.BUSINESS_NUMBER}</p>
                        <p>🥩 전문 분야: 한우, 돼지고기, 닭고기</p>
                    </div>
                    <div className="sales-info">
                        <p>고객님의 총 매출은 <strong>{userInfo.TOTAL_SALES.toLocaleString()}원</strong>입니다.</p>
                        <p>사용 가능 금액: <strong>{userInfo.AVAILABLE_BALANCE.toLocaleString()}원</strong></p>
                        <p>고기 품질 등급: <strong>프리미엄</strong></p>
                        <p>주요 판매 품목: <strong>한우, 돼지고기, 닭고기</strong></p>
                    </div>
                </div>
                <div className="summary-right">
                    <div className="summary-stats">
                                                        <div className="stat-card">
                                    <div className="stat-number">{userInfo.COUPONS}</div>
                                    <div className="stat-label">고기 할인</div>
                                </div>
                                                        <div className="stat-card">
                                    <div className="stat-number">{userInfo.POINTS.toLocaleString()}</div>
                                    <div className="stat-label">고기 적립</div>
                                </div>
                                                        <div className="stat-card">
                                    <div className="stat-number">{userInfo.PENDING_ORDERS}</div>
                                    <div className="stat-label">주문 대기</div>
                                </div>
                    </div>
                </div>
            </div>

            {/* 주문 진행 현황 */}
            <div className="order-progress">
                <h3>주문 처리</h3>
                <div className="progress-bar">
                    <div className="progress-step active">
                        <div className="step-icon">🛒</div>
                        <div className="step-label">주문대기</div>
                        <div className="step-count">{orderStats.pending}건</div>
                    </div>
                    <div className="progress-line"></div>
                    <div className="progress-step">
                        <div className="step-icon">⏳</div>
                        <div className="step-label">처리중</div>
                        <div className="step-count">{orderStats.processing}건</div>
                    </div>
                    <div className="progress-line"></div>
                    <div className="progress-step">
                        <div className="step-icon">🥩</div>
                        <div className="step-label">포장준비</div>
                        <div className="step-count">{orderStats.shipping}건</div>
                    </div>
                    <div className="progress-line"></div>
                    <div className="progress-step">
                        <div className="step-icon">🚚</div>
                        <div className="step-label">배송중</div>
                        <div className="step-count">{orderStats.delivered}건</div>
                    </div>
                    <div className="progress-line"></div>
                    <div className="progress-step">
                        <div className="step-icon">✅</div>
                        <div className="step-label">배송완료</div>
                        <div className="step-count">{orderStats.completed}건</div>
                    </div>
                </div>
            </div>

            {/* 최근 주문 정보 */}
            <div className="recent-orders">
                <div className="section-header">
                    <h3>최근 주문</h3>
                    <Link to={`/mypage/seller/${userId}/orders`} className="more-link">더보기</Link>
                </div>
                <div className="orders-grid">
                    {recentOrders.map((order, index) => (
                        <div key={index} className="order-card">
                            <div className="order-header">
                                <span className="order-date">{order.date} 주문</span>
                                <span className="order-number">{order.id}</span>
                            </div>
                            <div className="order-status">{order.status}</div>
                            <div className="order-product">
                                <div className="product-image">🥩</div>
                                <div className="product-info">
                                    <div className="product-name">{order.product}</div>
                                    <div className="product-price">{order.price}</div>
                                    <div className="product-quantity">{order.quantity}</div>
                                </div>
                            </div>
                            <div className="order-actions">
                                {order.status === '주문대기' ? (
                                    <button className="action-btn primary">처리하기</button>
                                ) : (
                                    <button className="action-btn secondary">상세보기</button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SellerMainPage;
