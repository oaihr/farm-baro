import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentUser } from '../../store/store';
import './BuyerOrders.css';

const BuyerOrders = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const { userId: currentUserId } = useSelector((state) => state.auth);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [filter, setFilter] = useState('all'); // all, pending, shipped, delivered, completed

    // 주문 목록 가져오기
    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:8080/api/mypage/buyers/${userId}/orders`);
            if (response.ok) {
                const data = await response.json();
                setOrders(data);
            } else {
                console.error('주문 목록 조회 실패');
                setMessage('주문 목록을 불러오는데 실패했습니다.');
            }
        } catch (error) {
            console.error('주문 목록 조회 오류:', error);
            setMessage('주문 목록 조회 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [userId]);

    // 구매확정 처리
    const handleConfirmOrder = async (orderId) => {
        if (!window.confirm('정말로 구매확정하시겠습니까?\n구매확정 후에는 환불이 어려울 수 있습니다.')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/mypage/api/orders/${orderId}/confirm`, {
                method: 'PUT'
            });

            if (response.ok) {
                setMessage('구매확정이 완료되었습니다! 🎉');
                fetchOrders(); // 주문 목록 새로고침
            } else {
                setMessage('구매확정 처리에 실패했습니다.');
            }
        } catch (error) {
            console.error('구매확정 오류:', error);
            setMessage('구매확정 처리 중 오류가 발생했습니다.');
        }
    };

    // 주문 상태별 필터링
    const filteredOrders = orders.filter(order => {
        if (filter === 'all') return true;
        return order.status === filter;
    });

    // 주문 상태별 색상 및 텍스트
    const getStatusInfo = (status) => {
        switch (status) {
            case 'PENDING':
                return { text: '결제 대기', color: '#f39c12', bgColor: '#fef3c7' };
            case 'PAID':
                return { text: '결제 완료', color: '#3498db', bgColor: '#dbeafe' };
            case 'SHIPPED':
                return { text: '배송 중', color: '#9b59b6', bgColor: '#f3e8ff' };
            case 'DELIVERED':
                return { text: '배송 완료', color: '#2ecc71', bgColor: '#dcfce7' };
            case 'COMPLETED':
                return { text: '구매 완료', color: '#27ae60', bgColor: '#d1fae5' };
            case 'CANCELLED':
                return { text: '주문 취소', color: '#e74c3c', bgColor: '#fee2e2' };
            default:
                return { text: '상태 미정', color: '#95a5a6', bgColor: '#f8f9fa' };
        }
    };

    // 주문 상태별 필터 옵션
    const filterOptions = [
        { value: 'all', label: '전체 주문' },
        { value: 'PENDING', label: '결제 대기' },
        { value: 'PAID', label: '결제 완료' },
        { value: 'SHIPPED', label: '배송 중' },
        { value: 'DELIVERED', label: '배송 완료' },
        { value: 'COMPLETED', label: '구매 완료' },
        { value: 'CANCELLED', label: '주문 취소' }
    ];

    if (loading) {
        return <div className="loading">주문 내역을 불러오는 중...</div>;
    }

    return (
        <div className="buyer-orders-container">
            {/* 헤더 */}
            <div className="header">
                <h1>📦 주문/배송</h1>
                <p>주문 내역과 배송 상태를 한눈에 확인하세요</p>
            </div>

            {/* 메시지 표시 */}
            {message && (
                <div className={`message ${message.includes('완료') ? 'success' : 'error'}`}>
                    {message}
                </div>
            )}

            {/* 필터 및 통계 */}
            <div className="orders-summary">
                <div className="summary-stats">
                    <div className="stat-item">
                        <div className="stat-number">{orders.length}</div>
                        <div className="stat-label">총 주문</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">{orders.filter(o => o.status === 'DELIVERED').length}</div>
                        <div className="stat-label">배송 완료</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">{orders.filter(o => o.status === 'COMPLETED').length}</div>
                        <div className="stat-label">구매 완료</div>
                    </div>
                </div>

                <div className="filter-section">
                    <label>주문 상태 필터:</label>
                    <select 
                        value={filter} 
                        onChange={(e) => setFilter(e.target.value)}
                        className="filter-select"
                    >
                        {filterOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* 주문 목록 */}
            <div className="orders-section">
                <h3>📋 주문 내역</h3>
                
                {filteredOrders.length === 0 ? (
                    <div className="no-orders">
                        <div className="no-orders-icon">📦</div>
                        <h4>주문 내역이 없습니다</h4>
                        <p>첫 주문을 시작해보세요!</p> <br />
                        <button 
                            className="shop-now-btn"
                            onClick={() => navigate('/')}
                        >
                            쇼핑하러 가기
                        </button>
                    </div>
                ) : (
                    <div className="orders-list">
                        {filteredOrders.map((order, index) => {
                            const statusInfo = getStatusInfo(order.status);
                            return (
                                <div key={order.orderId || index} className="order-card">
                                    <div className="order-header">
                                        <div className="order-info">
                                            <h4>주문번호: {order.orderId || `ORDER-${index + 1}`}</h4>
                                            <p className="order-date">
                                                주문일: {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : '날짜 정보 없음'}
                                            </p>
                                        </div>
                                        <div 
                                            className="order-status"
                                            style={{ 
                                                color: statusInfo.color, 
                                                backgroundColor: statusInfo.bgColor 
                                            }}
                                        >
                                            {statusInfo.text}
                                        </div>
                                    </div>

                                    <div className="order-items">
                                        {order.items && order.items.map((item, itemIndex) => (
                                            <div key={itemIndex} className="order-item">
                                                <div className="item-image">
                                                    {item.imageUrl ? (
                                                        <img src={item.imageUrl} alt={item.productName} />
                                                    ) : (
                                                        <div className="placeholder-image">📦</div>
                                                    )}
                                                </div>
                                                <div className="item-info">
                                                    <h5>{item.productName || '상품명 없음'}</h5>
                                                    <p className="item-details">
                                                        수량: {item.quantity || 1}개 | 
                                                        가격: {item.price ? `${item.price.toLocaleString()}원` : '가격 정보 없음'}
                                                    </p>
                                                    {item.options && (
                                                        <p className="item-options">
                                                            옵션: {item.options}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="order-summary">
                                        <div className="order-total">
                                            <strong>총 주문 금액: {order.totalAmount ? `${order.totalAmount.toLocaleString()}원` : '금액 정보 없음'}</strong>
                                        </div>
                                        
                                        {order.deliveryInfo && (
                                            <div className="delivery-info">
                                                <h5>배송 정보</h5>
                                                <p>수령인: {order.deliveryInfo.recipientName || '정보 없음'}</p>
                                                <p>연락처: {order.deliveryInfo.phone || '정보 없음'}</p>
                                                <p>주소: {order.deliveryInfo.address || '정보 없음'}</p>
                                                {order.deliveryInfo.trackingNumber && (
                                                    <p>운송장번호: {order.deliveryInfo.trackingNumber}</p>
                                                )}
                                            </div>
                                        )}

                                        <div className="order-actions">
                                            {order.status === 'DELIVERED' && (
                                                <button 
                                                    className="confirm-order-btn"
                                                    onClick={() => handleConfirmOrder(order.orderId)}
                                                >
                                                    ✅ 구매확정
                                                </button>
                                            )}
                                            
                                            {order.status === 'PENDING' && (
                                                <button className="cancel-order-btn">
                                                    ❌ 주문 취소
                                                </button>
                                            )}
                                            
                                            <button className="order-detail-btn">
                                                📋 상세보기
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* 배송 안내 */}
            <div className="delivery-guide">
                <h3>🚚 배송 안내</h3>
                <div className="guide-content">
                    <div className="guide-item">
                        <div className="guide-icon">📦</div>
                        <div className="guide-text">
                            <h4>주문 접수</h4>
                            <p>주문이 접수되면 결제 확인 후 상품을 준비합니다.</p>
                        </div>
                    </div>
                    <div className="guide-item">
                        <div className="guide-icon">🚚</div>
                        <div className="guide-text">
                            <h4>배송 시작</h4>
                            <p>상품 준비가 완료되면 배송을 시작합니다.</p>
                        </div>
                    </div>
                    <div className="guide-item">
                        <div className="guide-icon">📮</div>
                        <div className="guide-text">
                            <h4>배송 완료</h4>
                            <p>상품이 도착하면 구매확정을 해주세요.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BuyerOrders;
