import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './OrderList.css';

const OrderList = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('all');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    
    const tabs = [
        { id: 'all', label: '전체 주문', icon: '📋' },
        { id: 'pending', label: '주문대기', icon: '⏳' },
        { id: 'processing', label: '처리중', icon: '⚙️' },
        { id: 'shipping', label: '배송중', icon: '🚚' },
        { id: 'completed', label: '배송완료', icon: '✅' }
    ];

    const quickActions = [
        { icon: '⚡', label: '빠른 주문 처리', action: 'process', description: '대기 중인 주문을 빠르게 처리합니다' },
        { icon: '🚚', label: '배송 시작', action: 'ship', description: '주문을 배송 상태로 변경합니다' },
        { icon: '📋', label: '운송장 등록', action: 'tracking', description: '운송장 번호를 등록합니다' },
        { icon: '💸', label: '환불 처리', action: 'refund', description: '환불 요청을 처리합니다' },
        { icon: '📈', label: '실적 분석', action: 'stats', description: '주문 통계를 확인합니다' }
    ];

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

    // 주문 목록 가져오기
    const fetchOrders = async () => {
        try {
            setLoading(true);
            console.log('주문 목록 조회 시작 - sellerId:', userId);
            
            const response = await fetch(`http://localhost:8080/api/sellers/${userId}/orders`, {
                credentials: 'include'
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log('주문 목록 조회 성공:', data);
                setOrders(data);
                setFilteredOrders(data);
            } else {
                console.error('주문 목록 조회 실패:', response.status, response.statusText);
                setMessage('주문 목록을 불러오는데 실패했습니다.');
            }
        } catch (error) {
            console.error('주문 목록 조회 오류:', error);
            setMessage('주문 목록 조회 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 주문 상태 변경
    const handleStatusChange = async (orderId, newStatus) => {
        try {
            setLoading(true);
            setMessage('');
            console.log('주문 상태 변경 요청 - orderId:', orderId, 'newStatus:', newStatus);

            const response = await fetch(`http://localhost:8080/api/orders/${orderId}/delivery?orderStatus=${newStatus}`, {
                method: 'PUT',
                credentials: 'include'
            });

            if (response.ok) {
                const result = await response.json();
                console.log('주문 상태 변경 성공:', result);
                setMessage(`주문 #${orderId}의 상태가 '${newStatus}'로 변경되었습니다! ✨`);
                
                // 주문 목록 다시 조회
                await fetchOrders();
                
                setTimeout(() => {
                    setMessage('');
                }, 3000);
            } else {
                console.error('주문 상태 변경 실패:', response.status);
                setMessage('주문 상태 변경에 실패했습니다. 다시 시도해주세요.');
            }
        } catch (error) {
            console.error('주문 상태 변경 오류:', error);
            setMessage('주문 상태 변경 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 주문 확정
    const handleConfirmOrder = async (orderId) => {
        try {
            setLoading(true);
            setMessage('');
            console.log('주문 확정 요청 - orderId:', orderId);

            const response = await fetch(`http://localhost:8080/api/orders/${orderId}/confirm`, {
                method: 'PUT',
                credentials: 'include'
            });

            if (response.ok) {
                const result = await response.json();
                console.log('주문 확정 성공:', result);
                setMessage(`주문 #${orderId}가 확정되었습니다! ✅`);
                
                // 주문 목록 다시 조회
                await fetchOrders();
                
                setTimeout(() => {
                    setMessage('');
                }, 3000);
            } else {
                console.error('주문 확정 실패:', response.status);
                setMessage('주문 확정에 실패했습니다. 다시 시도해주세요.');
            }
        } catch (error) {
            console.error('주문 확정 오류:', error);
            setMessage('주문 확정 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 탭 변경 시 주문 필터링
    useEffect(() => {
        if (activeTab === 'all') {
            setFilteredOrders(orders);
        } else {
            const statusMap = {
                'pending': ['ORDERED', 'PENDING'],
                'processing': ['PROCESSING'],
                'shipping': ['SHIPPED', 'SHIPPING'],
                'completed': ['DELIVERED', 'COMPLETED']
            };
            const targetStatuses = statusMap[activeTab] || [];
            const filtered = orders.filter(order => 
                targetStatuses.includes(order.orderStatus?.toUpperCase())
            );
            setFilteredOrders(filtered);
        }
    }, [activeTab, orders]);

    // 컴포넌트 마운트 시 주문 목록 가져오기
    useEffect(() => {
        fetchOrders();
    }, [userId]);

    const orderStats = {
        total: orders.length,
        pending: orders.filter(o => ['ORDERED', 'PENDING'].includes(o.orderStatus?.toUpperCase())).length,
        processing: orders.filter(o => o.orderStatus?.toUpperCase() === 'PROCESSING').length,
        shipping: orders.filter(o => ['SHIPPED', 'SHIPPING'].includes(o.orderStatus?.toUpperCase())).length,
        completed: orders.filter(o => ['DELIVERED', 'COMPLETED'].includes(o.orderStatus?.toUpperCase())).length
    };

    const getStatusColor = (status) => {
        switch(status?.toUpperCase()) {
            case 'ORDERED':
            case 'PENDING':
                return '#e74c3c';
            case 'PROCESSING':
                return '#f39c12';
            case 'SHIPPED':
            case 'SHIPPING':
                return '#3498db';
            case 'DELIVERED':
            case 'COMPLETED':
                return '#27ae60';
            default: return '#95a5a6';
        }
    };

    const getStatusIcon = (status) => {
        switch(status?.toUpperCase()) {
            case 'ORDERED':
            case 'PENDING':
                return '⏳';
            case 'PROCESSING':
                return '⚙️';
            case 'SHIPPED':
            case 'SHIPPING':
                return '🚚';
            case 'DELIVERED':
            case 'COMPLETED':
                return '✅';
            default: return '📋';
        }
    };

    // 빠른 액션 처리
    const handleQuickAction = (action) => {
        switch(action) {
            case 'process':
                setMessage('⚡ 빠른 주문 처리: 대기 중인 주문을 찾아서 처리하세요!');
                break;
            case 'ship':
                setMessage('🚚 배송 시작: 처리 완료된 주문을 배송 상태로 변경하세요!');
                break;
            case 'tracking':
                setMessage('📋 운송장 등록: 배송 중인 주문에 운송장 번호를 입력하세요!');
                break;
            case 'refund':
                setMessage('💸 환불 처리: 환불 요청이 있는 주문을 확인하세요!');
                break;
            case 'stats':
                setMessage('📈 실적 분석: 상단의 통계 카드에서 실시간 주문 현황을 확인하세요!');
                break;
            default:
                break;
        }
        
        setTimeout(() => {
            setMessage('');
        }, 4000);
    };

    return (
        <div className="order-list-container">
            {/* 헤더 */}
            <div className="header">
                <h1>📋 주문 현황</h1>
                <p>고기 주문 현황을 실시간으로 확인하고 관리하세요</p>
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
                    <button 
                        key={index} 
                        className="quick-action-card" 
                        onClick={() => handleQuickAction(action.action)}
                        title={action.description}
                    >
                        <div className="action-icon">{action.icon}</div>
                        <div className="action-label">{action.label}</div>
                        <div className="action-description">{action.description}</div>
                    </button>
                ))}
            </div>

            {/* 메시지 표시 */}
            {message && (
                <div className={`message ${message.includes('성공') || message.includes('변경') || message.includes('확정') ? 'success' : 'info'}`}>
                    {message}
                </div>
            )}

            {/* 주문 통계 요약 */}
            <div className="order-stats">
                <h3>📊 주문 통계</h3>
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon">📋</div>
                        <div className="stat-number">{orderStats.total}</div>
                        <div className="stat-label">전체 주문</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">⏳</div>
                        <div className="stat-number">{orderStats.pending}</div>
                        <div className="stat-label">주문대기</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">⚙️</div>
                        <div className="stat-number">{orderStats.processing}</div>
                        <div className="stat-label">처리중</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">🚚</div>
                        <div className="stat-number">{orderStats.shipping}</div>
                        <div className="stat-label">배송중</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">✅</div>
                        <div className="stat-number">{orderStats.completed}</div>
                        <div className="stat-label">배송완료</div>
                    </div>
                </div>
            </div>

            {/* 주문 목록 */}
            <div className="orders-section">
                <div className="section-header">
                    <h3>🥩 주문 목록</h3>
                    <div className="header-actions">
                        <button className="export-btn" onClick={() => setMessage('내보내기 기능은 준비 중입니다.')}>
                            📊 내보내기
                        </button>
                        <button className="refresh-btn" onClick={fetchOrders} disabled={loading}>
                            🔄 새로고침
                        </button>
                    </div>
                </div>
                
                {loading ? (
                    <div className="loading">주문 목록을 불러오는 중...</div>
                ) : filteredOrders.length === 0 ? (
                    <div className="no-orders">
                        {activeTab === 'all' ? '등록된 주문이 없습니다.' : `${tabs.find(t => t.id === activeTab)?.label} 주문이 없습니다.`}
                    </div>
                ) : (
                    <div className="orders-grid">
                        {filteredOrders.map((order, index) => (
                            <div key={order.saleOrderId || index} className="order-card">
                                <div className="order-header">
                                    <div className="order-info">
                                        <span className="order-number">#{order.saleOrderId}</span>
                                        <span className="order-date">{formatDate(order.orderDate)}</span>
                                    </div>
                                    <div 
                                        className="order-status"
                                        style={{ backgroundColor: getStatusColor(order.orderStatus) }}
                                    >
                                        {getStatusIcon(order.orderStatus)} {getOrderStatusText(order.orderStatus)}
                                    </div>
                                </div>
                                
                                <div className="order-details">
                                    <div className="customer-info">
                                        <p><strong>고객명:</strong> {order.buyerName || '고객명 없음'}</p>
                                        <p><strong>판매자:</strong> {order.sellerName || '판매자명 없음'}</p>
                                    </div>
                                    
                                    <div className="product-info">
                                        <div className="product-image">🥩</div>
                                        <div className="product-details">
                                            <div className="product-name">{order.productTitle || '상품명 없음'}</div>
                                            <div className="product-price">{formatPrice(order.totalPrice)}</div>
                                            <div className="product-quantity">{order.orderQuantity}개</div>
                                        </div>
                                    </div>
                                    
                                    <div className="order-total">
                                        <span className="total-label">총 결제금액:</span>
                                        <span className="total-amount">{formatPrice(order.totalPrice)}</span>
                                    </div>
                                </div>
                                
                                <div className="order-actions">
                                    {(order.orderStatus === 'ORDERED' || order.orderStatus === 'PENDING') && (
                                        <>
                                            <button 
                                                className="action-btn primary"
                                                onClick={() => handleConfirmOrder(order.saleOrderId)}
                                                disabled={loading}
                                            >
                                                주문확정
                                            </button>
                                            <button 
                                                className="action-btn primary"
                                                onClick={() => handleStatusChange(order.saleOrderId, 'PROCESSING')}
                                                disabled={loading}
                                            >
                                                처리하기
                                            </button>
                                        </>
                                    )}
                                    {order.orderStatus === 'PROCESSING' && (
                                        <>
                                            <button 
                                                className="action-btn primary"
                                                onClick={() => handleStatusChange(order.saleOrderId, 'SHIPPED')}
                                                disabled={loading}
                                            >
                                                배송시작
                                            </button>
                                            <button className="action-btn secondary">운송장등록</button>
                                        </>
                                    )}
                                    {order.orderStatus === 'SHIPPED' && (
                                        <>
                                            <button 
                                                className="action-btn primary"
                                                onClick={() => handleStatusChange(order.saleOrderId, 'DELIVERED')}
                                                disabled={loading}
                                            >
                                                배송완료
                                            </button>
                                            <button className="action-btn secondary">배송추적</button>
                                        </>
                                    )}
                                    {order.orderStatus === 'DELIVERED' && (
                                        <>
                                            <button className="action-btn secondary">상세보기</button>
                                            <button className="action-btn secondary">리뷰확인</button>
                                        </>
                                    )}
                                    {order.orderStatus === 'COMPLETED' && (
                                        <>
                                            <button className="action-btn secondary">상세보기</button>
                                            <button className="action-btn secondary">리뷰확인</button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderList;
