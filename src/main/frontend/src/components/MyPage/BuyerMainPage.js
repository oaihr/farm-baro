import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCurrentUser } from '../../store/store';
import './BuyerMainPage.css';

const BuyerMainPage = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { totalBalance, bidDeposit } = useSelector((state) => state.auth);
    const [userInfo, setUserInfo] = useState(null);
    const [depositAmount, setDepositAmount] = useState('');
    const [showDepositModal, setShowDepositModal] = useState(false);
    const [showBankTransfer, setShowBankTransfer] = useState(false);
    const [cartItems, setCartItems] = useState([]);
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

    // 장바구니 아이템 가져오기
    const fetchCartItems = useCallback(async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/mypage/cart`, {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                console.log('마이페이지 장바구니 데이터:', data);
                setCartItems(data || []);
            } else {
                console.error('장바구니 조회 실패');
            }
        } catch (error) {
            console.error('장바구니 조회 오류:', error);
        }
    }, []);

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
        fetchCartItems();
        fetchStats();
        setLoading(false);
    }, [fetchCartItems, fetchStats]);

    // 예치금 입금 처리
    const handleDepositClick = () => {
        setShowDepositModal(true);
    };

    const handleDepositSubmit = async () => {
        if (!depositAmount || depositAmount <= 0) {
            alert('올바른 금액을 입력해주세요.');
            return;
        }

        // 입금 모달을 닫고 은행 이체 안내를 보여줌
        setShowDepositModal(false);
        setShowBankTransfer(true);
    };

    const handleDepositComplete = async () => {
        try {
            console.log('예치금 입금 시작:', depositAmount);
            console.log('현재 사용자 정보:', userInfo);
            console.log('Redux 상태:', { totalBalance, bidDeposit });
            
            // 먼저 현재 사용자 정보를 확인
            const userCheckResponse = await fetch('http://localhost:8080/api/auth/me', {
                credentials: 'include'
            });
            console.log('사용자 확인 응답:', userCheckResponse.status);
            
            if (!userCheckResponse.ok) {
                alert('로그인이 필요합니다. 다시 로그인해주세요.');
                return;
            }
            
            const response = await fetch('http://localhost:8080/api/mypage/buyer/deposit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    amount: parseFloat(depositAmount),
                    userId: userInfo?.id || userId
                })
            });

            console.log('응답 상태:', response.status);
            console.log('응답 OK:', response.ok);

            if (response.ok) {
                const result = await response.json();
                console.log('입금 성공:', result);
                alert('예치금이 성공적으로 입금되었습니다.');
                setShowBankTransfer(false);
                setDepositAmount('');
                // 사용자 정보 다시 가져오기
                await fetchUserInfo();
                dispatch(fetchCurrentUser());
            } else {
                const errorData = await response.json();
                console.error('입금 실패 응답:', errorData);
                alert(errorData.message || '예치금 입금에 실패했습니다.');
            }
        } catch (error) {
            console.error('예치금 입금 오류 상세:', error);
            console.error('오류 메시지:', error.message);
            console.error('오류 스택:', error.stack);
            alert(`예치금 입금 중 오류가 발생했습니다: ${error.message}`);
        }
    };

    const handleDepositCancel = () => {
        setShowDepositModal(false);
        setShowBankTransfer(false);
        setDepositAmount('');
    };

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
            icon: '🏆',
            label: '낙찰상품',
            path: `/mypage/buyer/${userId}/winning-auctions`
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
                    <div className="deposit-info">
                        <div className="deposit-card">
                            <h4>예치금 정보</h4>
                            <div className="deposit-item">
                                <span className="deposit-label">총 예치금:</span>
                                <span className="deposit-amount">{userInfo?.totalBalance || 0}원</span>
                            </div>
                            <div className="deposit-item">
                                <span className="deposit-label">사용 가능 예치금:</span>
                                <span className="deposit-amount available">
                                    {(userInfo?.totalBalance || 0) - (userInfo?.bidDeposit || 0)}원
                                </span>
                            </div>
                            <button 
                                className="deposit-btn"
                                onClick={() => handleDepositClick()}
                            >
                                입금하기
                            </button>
                        </div>
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
                        <div className="stat-number">{cartItems.length}</div>
                        <div className="stat-label">장바구니 상품</div>
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

            {/* 예치금 입금 모달 */}
            {showDepositModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>예치금 입금</h3>
                        <div className="form-group">
                            <label>입금할 금액:</label>
                            <input
                                type="number"
                                value={depositAmount}
                                onChange={(e) => setDepositAmount(e.target.value)}
                                placeholder="금액을 입력하세요"
                                min="1"
                            />
                        </div>
                        <div className="modal-actions">
                            <button 
                                className="btn-primary"
                                onClick={handleDepositSubmit}
                            >
                                입금하기
                            </button>
                            <button 
                                className="btn-secondary"
                                onClick={handleDepositCancel}
                            >
                                취소
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 은행 이체 안내 모달 */}
            {showBankTransfer && (
                <div className="modal-overlay">
                    <div className="modal-content bank-transfer-modal">
                        <h3>예치금 입금 안내</h3>
                        <div className="bank-transfer-info">
                            <div className="bank-account">
                                <p><strong>OO은행 1570 9385 3527</strong>으로</p>
                                <p>한시간 이내에 입금해주세요</p>
                            </div>
                            <div className="deposit-amount-display">
                                <p>입금 금액: <strong>{parseInt(depositAmount).toLocaleString()}원</strong></p>
                            </div>
                            <div className="dev-notice">
                                <p>*개발환경에서 테스트로 실제 입금을 하기 어려워</p>
                                <p>개발용 로직으로 대체됩니다</p>
                            </div>
                        </div>
                        <div className="modal-actions">
                            <button 
                                className="btn-primary"
                                onClick={handleDepositComplete}
                            >
                                입금 완료
                            </button>
                            <button 
                                className="btn-secondary"
                                onClick={handleDepositCancel}
                            >
                                취소
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BuyerMainPage;
