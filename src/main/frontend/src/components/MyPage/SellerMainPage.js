import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentUser } from '../../store/store';
import './SellerMainPage.css';
import ProductRegistration from './ProductRegistration';
import OrderList from './OrderList';
import ReviewManagement from './ReviewManagement';
import InquiryManagement from './InquiryManagement';
import ProfileEdit from './ProfileEdit';

const SellerMainPage = () => {
    const { userId } = useParams();
    const dispatch = useDispatch();
    
    const { userId: currentUserId } = useSelector((state) => state.auth);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [editData, setEditData] = useState({
        businessNumber: '',
        specialty: '농산물 판매'
    });
    const [orderStats, setOrderStats] = useState({
        pending: 0,
        processing: 0,
        shipping: 0,
        delivered: 0,
        completed: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(false);
    
    // 세션에서 사용자 정보 가져오기
    const fetchUserInfo = async () => {
        try {
            const response = await fetch('/api/auth/me', {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                setUserInfo(data);
                // 편집 데이터 초기화
                setEditData({
                    businessNumber: data.businessNumber || '',
                    specialty: '농산물 판매'
                });
            }
        } catch (error) {
            console.error('사용자 정보 조회 오류:', error);
        } finally {
            setLoading(false);
        }
    };

    // 주문 데이터 가져오기
    const fetchOrderData = async () => {
        if (!userId) return;
        
        try {
            setOrdersLoading(true);
            console.log('주문 데이터 조회 시작 - sellerId:', userId);
            
            // 최근 주문 조회
            const recentResponse = await fetch(`http://localhost:8080/api/sellers/${userId}/recent-orders`, {
                credentials: 'include'
            });
            
            if (recentResponse.ok) {
                const recentData = await recentResponse.json();
                console.log('최근 주문 데이터:', recentData);
                setRecentOrders(recentData);
            } else {
                console.error('최근 주문 조회 실패:', recentResponse.status);
            }
            
            // 전체 주문 조회하여 통계 계산
            const allOrdersResponse = await fetch(`http://localhost:8080/api/sellers/${userId}/orders`, {
                credentials: 'include'
            });
            
            if (allOrdersResponse.ok) {
                const allOrders = await allOrdersResponse.json();
                console.log('전체 주문 데이터:', allOrders);
                
                // 주문 상태별 통계 계산
                const stats = {
                    pending: 0,
                    processing: 0,
                    shipping: 0,
                    delivered: 0,
                    completed: 0
                };
                
                allOrders.forEach(order => {
                    const status = order.orderStatus?.toLowerCase();
                    switch (status) {
                        case 'ordered':
                        case 'pending':
                            stats.pending++;
                            break;
                        case 'processing':
                            stats.processing++;
                            break;
                        case 'shipped':
                        case 'shipping':
                            stats.shipping++;
                            break;
                        case 'delivered':
                            stats.delivered++;
                            break;
                        case 'completed':
                            stats.completed++;
                            break;
                        default:
                            stats.pending++;
                    }
                });
                
                setOrderStats(stats);
                console.log('주문 통계:', stats);
            } else {
                console.error('전체 주문 조회 실패:', allOrdersResponse.status);
            }
            
        } catch (error) {
            console.error('주문 데이터 조회 오류:', error);
        } finally {
            setOrdersLoading(false);
        }
    };

    useEffect(() => {
        fetchUserInfo();
    }, []);

    useEffect(() => {
        if (userInfo && userInfo.id) {
            fetchOrderData();
        }
    }, [userInfo]);
    
    // 편집 모드 토글
    const toggleEdit = () => {
        setEditing(!editing);
    };
    
    // 편집 데이터 저장
    const saveEdit = async () => {
        try {
            const response = await fetch('/api/mypage/seller/update-info', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    businessNumber: editData.businessNumber,
                    specialty: editData.specialty
                })
            });
            
            if (response.ok) {
                // 사용자 정보 다시 가져오기
                await fetchUserInfo();
                setEditing(false);
                alert('정보가 성공적으로 업데이트되었습니다.');
            } else {
                alert('정보 업데이트에 실패했습니다.');
            }
        } catch (error) {
            console.error('정보 업데이트 오류:', error);
            alert('정보 업데이트 중 오류가 발생했습니다.');
        }
    };
    
    // 편집 취소
    const cancelEdit = () => {
        setEditData({
            businessNumber: userInfo.businessNumber || '',
            specialty: '농산물 판매'
        });
        setEditing(false);
    };
    
    if (loading) {
        return <div>로딩 중...</div>;
    }
    
    if (!userInfo) {
        return <div>사용자 정보를 불러올 수 없습니다.</div>;
    }

    // 주문 상태를 한국어로 변환하는 함수
    const getOrderStatusText = (status) => {
        switch (status?.toLowerCase()) {
            case 'ordered':
            case 'pending':
                return '주문대기';
            case 'processing':
                return '처리중';
            case 'shipped':
            case 'shipping':
                return '배송중';
            case 'delivered':
                return '배송완료';
            case 'completed':
                return '완료';
            default:
                return '주문대기';
        }
    };

    // 날짜 포맷팅 함수
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).replace(/\./g, '.').replace(/\s/g, '');
    };

    // 가격 포맷팅 함수
    const formatPrice = (price) => {
        if (!price) return '0원';
        return new Intl.NumberFormat('ko-KR').format(price) + '원';
    };

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
                <h1>판매자 마이페이지</h1>
                <p>판매자 정보와 활동을 한 곳에서 관리하세요</p>
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
                        <h3>{userInfo.name}</h3>
                        <span className="badge">SELLER</span>
                        <div style={{marginTop: '10px'}}>
                            {editing ? (
                                <>
                                    <button onClick={saveEdit} style={{
                                        backgroundColor: '#4CAF50', 
                                        color: 'white', 
                                        border: 'none', 
                                        padding: '8px 16px', 
                                        borderRadius: '4px', 
                                        marginRight: '10px',
                                        cursor: 'pointer'
                                    }}>
                                        저장
                                    </button>
                                    <button onClick={cancelEdit} style={{
                                        backgroundColor: '#f44336', 
                                        color: 'white', 
                                        border: 'none', 
                                        padding: '8px 16px', 
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}>
                                        취소
                                    </button>
                                </>
                            ) : (
                                <button onClick={toggleEdit} style={{
                                    backgroundColor: '#2e9a4d', 
                                    color: 'white', 
                                    border: 'none', 
                                    padding: '8px 16px', 
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}>
                                    정보 수정
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="user-details">
                        <p>📧 {userInfo.email}</p>
                        <p>📱 {userInfo.tel || '전화번호 없음'}</p>
                        <p>📍 {userInfo.address || '주소 없음'}</p>
                        <p>🏢 사업자번호: 
                            {editing ? (
                                <input 
                                    type="text" 
                                    value={editData.businessNumber} 
                                    onChange={(e) => setEditData({...editData, businessNumber: e.target.value})}
                                    placeholder="사업자번호를 입력하세요"
                                    style={{marginLeft: '10px', padding: '5px', border: '1px solid #ccc', borderRadius: '3px'}}
                                />
                            ) : (
                                ` ${userInfo.businessNumber || '미등록'}`
                            )}
                        </p>
                        <p>🥩 전문 분야: 
                            {editing ? (
                                <select 
                                    value={editData.specialty} 
                                    onChange={(e) => setEditData({...editData, specialty: e.target.value})}
                                    style={{marginLeft: '10px', padding: '5px', border: '1px solid #ccc', borderRadius: '3px'}}
                                >
                                    <option value="농산물 판매">농산물 판매</option>
                                    <option value="축산물 판매">축산물 판매</option>
                                    <option value="수산물 판매">수산물 판매</option>
                                    <option value="가공식품 판매">가공식품 판매</option>
                                    <option value="기타">기타</option>
                                </select>
                            ) : (
                                ` ${editData.specialty}`
                            )}
                        </p>
                    </div>
                    <div className="sales-info">
                        <p>총 매출: <strong>0원</strong></p>
                        <p>사용 가능 금액: <strong>0원</strong></p>
                        <p>판매자 등급: <strong>신규</strong></p>
                        <p>주요 판매 품목: <strong>농산물</strong></p>
                    </div>
                </div>
                <div className="summary-right">
                    <div className="summary-stats">
                        <div className="stat-card">
                            <div className="stat-number">0</div>
                            <div className="stat-label">할인 쿠폰</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">0</div>
                            <div className="stat-label">적립 포인트</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">0</div>
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
                {ordersLoading ? (
                    <div style={{textAlign: 'center', padding: '20px'}}>주문 데이터를 불러오는 중...</div>
                ) : recentOrders.length > 0 ? (
                    <div className="orders-grid">
                        {recentOrders.map((order, index) => (
                            <div key={order.saleOrderId || index} className="order-card">
                                <div className="order-header">
                                    <span className="order-date">{formatDate(order.orderDate)} 주문</span>
                                    <span className="order-number">#{order.saleOrderId}</span>
                                </div>
                                <div className="order-status">{getOrderStatusText(order.orderStatus)}</div>
                                <div className="order-product">
                                    <div className="product-image">🥩</div>
                                    <div className="product-info">
                                        <div className="product-name">{order.productTitle || '상품명 없음'}</div>
                                        <div className="product-price">{formatPrice(order.totalPrice)}</div>
                                        <div className="product-quantity">{order.orderQuantity}개</div>
                                    </div>
                                </div>
                                <div className="order-actions">
                                    {order.orderStatus?.toLowerCase() === 'ordered' || order.orderStatus?.toLowerCase() === 'pending' ? (
                                        <button className="action-btn primary">처리하기</button>
                                    ) : (
                                        <button className="action-btn secondary">상세보기</button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{textAlign: 'center', padding: '20px', color: '#666'}}>
                        최근 주문이 없습니다.
                    </div>
                )}
            </div>

            {/* 탭 네비게이션 */}
            <div className="tab-navigation">
                <button 
                    className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
                    onClick={() => setActiveTab('dashboard')}
                >
                    🏠 대시보드
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'product-registration' ? 'active' : ''}`}
                    onClick={() => setActiveTab('product-registration')}
                >
                    🥩 상품 등록
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
                    onClick={() => setActiveTab('orders')}
                >
                    📋 주문 현황
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
                    onClick={() => setActiveTab('reviews')}
                >
                    ⭐ 리뷰 확인
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'inquiries' ? 'active' : ''}`}
                    onClick={() => setActiveTab('inquiries')}
                >
                    ❓ 문의 답변
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'profile-edit' ? 'active' : ''}`}
                    onClick={() => setActiveTab('profile-edit')}
                >
                    👤 정보 수정
                </button>
            </div>

            {/* 탭 컨텐츠 */}
            <div className="tab-content">
                {activeTab === 'dashboard' && (
                    <div className="dashboard-content">
                        {/* 기존 대시보드 내용 */}
                    </div>
                )}
                
                {activeTab === 'product-registration' && (
                    <ProductRegistration />
                )}
                
                {activeTab === 'orders' && (
                    <OrderList />
                )}
                
                {activeTab === 'reviews' && (
                    <ReviewManagement />
                )}
                
                {activeTab === 'inquiries' && (
                    <InquiryManagement />
                )}
                
                {activeTab === 'profile-edit' && (
                    <ProfileEdit />
                )}
            </div>
        </div>
    );
};

export default SellerMainPage;
