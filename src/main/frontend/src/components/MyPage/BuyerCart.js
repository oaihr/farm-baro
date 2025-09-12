import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './BuyerCart.css';

const BuyerCart = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [selectedItems, setSelectedItems] = useState(new Set());
    const [selectAll, setSelectAll] = useState(false);
    const [isIamportLoaded, setIsIamportLoaded] = useState(false);

    // I'mport SDK 로드 및 초기화
    useEffect(() => {
        if (typeof window.IMP !== 'undefined') {
            setIsIamportLoaded(true);
            return;
        }

        const script = document.createElement("script");
        script.src = "https://cdn.iamport.kr/js/iamport.payment-1.2.0.js";
        script.async = true;
        
        script.onload = () => {
            const IMP = window.IMP;
            IMP.init("imp13778606"); // 'imp13778606'는 테스트용 가맹점 식별코드입니다.
            setIsIamportLoaded(true);
            console.log("아임포트 SDK is successfully loaded.");
        };

        script.onerror = () => {
            console.error("Failed to load Iamport SDK.");
            setMessage("아임포트 SDK 로드 실패. 잠시 후 다시 시도해 주세요.");
        };

        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        };
    }, []);

    // 장바구니 목록 가져오기
    const fetchCartItems = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/mypage/cart`, {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                setCartItems(data);
                setSelectedItems(new Set());
                setSelectAll(false);
            } else {
                setMessage('장바구니를 불러오는데 실패했습니다.');
            }
        } catch (error) {
            setMessage('장바구니 조회 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCartItems();
    }, [fetchCartItems]);

    // 전체 선택/해제
    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedItems(new Set());
            setSelectAll(false);
        } else {
            // NOTE: saleItemId 대신 cartItemId를 사용합니다.
            const allItemIds = new Set(cartItems.map(item => item.cartItemId));
            setSelectedItems(allItemIds);
            setSelectAll(true);
        }
    };

    // 개별 아이템 선택/해제
    const handleSelectItem = (cartItemId) => {
        const newSelectedItems = new Set(selectedItems);
        if (newSelectedItems.has(cartItemId)) {
            newSelectedItems.delete(cartItemId);
        } else {
            newSelectedItems.add(cartItemId);
        }
        setSelectedItems(newSelectedItems);
        setSelectAll(newSelectedItems.size === cartItems.length);
    };

    // 수량 변경
    const handleQuantityChange = async (cartItemId, newQuantity) => {
        if (newQuantity < 1) return;
        try {
            const response = await fetch(`/api/mypage/cart/${cartItemId}/quantity`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ quantity: newQuantity })
            });
            if (response.ok) {
                setCartItems(prev => prev.map(item => 
                    item.cartItemId === cartItemId 
                        ? { ...item, quantity: newQuantity }
                        : item
                ));
                setMessage('수량이 성공적으로 변경되었습니다.');
            } else {
                setMessage('수량 변경에 실패했습니다.');
            }
        } catch (error) {
            setMessage('수량 변경 중 오류가 발생했습니다.');
        }
    };

    // 장바구니에서 삭제
    const handleRemoveItem = async (cartItemId) => {
        if (!window.confirm('정말로 이 상품을 장바구니에서 삭제하시겠습니까?')) {
            return;
        }

        try {
            const response = await fetch(`/api/mypage/cart/${cartItemId}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (response.ok) {
                await fetchCartItems();
                setMessage('상품이 장바구니에서 삭제되었습니다.');
            } else {
                setMessage('상품 삭제에 실패했습니다.');
            }
        } catch (error) {
            setMessage('상품 삭제 중 오류가 발생했습니다.');
        }
    };

    // 공통 결제 핸들러 함수
    const startPayment = async (itemsToPay, orderName, totalAmount) => {
        if (!isIamportLoaded) {
            setMessage("결제 모듈이 아직 로드되지 않았습니다. 잠시 후 다시 시도해 주세요.");
            return;
        }

        const IMP = window.IMP;
        const merchant_uid = `order_no_${new Date().getTime()}`;

        IMP.request_pay(
            {
                pg: "html5_inicis.INIpayTest", // 테스트 모드용 PG 코드
                pay_method: "card",
                merchant_uid,
                name: orderName,
                amount: totalAmount,
                buyer_email: "test@example.com",
                buyer_name: "홍길동",
                buyer_tel: "010-1234-5678",
            },
            async (rsp) => {
                if (rsp.success) {
                    console.log("결제 성공. imp_uid:", rsp.imp_uid);
                    setMessage("결제가 성공적으로 완료되었습니다. 🎉");
                    
                    // 결제된 상품을 장바구니에서 제거
                    // NOTE: 서버 API에 따라 수정 필요
                    setCartItems(prev => prev.filter(item => !itemsToPay.some(paidItem => paidItem.cartItemId === item.cartItemId)));
                    setSelectedItems(new Set());
                    setSelectAll(false);
                } else {
                    console.error("결제 실패:", rsp.error_msg);
                    setMessage(`${rsp.error_msg}`);
                }
            }
        );
    };

    // 개별 상품 결제
    const handlePurchaseConfirm = async (cartItemId) => {
        const item = cartItems.find(item => item.cartItemId === cartItemId);
        if (!item) return;

        const totalAmount = Math.round(item.price * item.quantity);
        const orderName = item.title;
        
        
        await startPayment([item], orderName, totalAmount);
      
    };

    // 선택된 상품들 결제
    const handleCheckout = async () => {
        if (selectedItems.size === 0) {
            setMessage('결제할 상품을 선택해주세요.');
            return;
        }

        const selectedCartItems = cartItems.filter(item => selectedItems.has(item.cartItemId));
        const totalAmount = selectedCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const orderName = selectedCartItems.length > 1 
            ? `${selectedCartItems[0].title} 외 ${selectedCartItems.length - 1}건` 
            : selectedCartItems[0].title;

         await startPayment(selectedCartItems, orderName, Math.round(totalAmount));
        
    };

    // 선택된 상품들 삭제
    const handleRemoveSelected = async () => {
        if (selectedItems.size === 0) {
            setMessage('삭제할 상품을 선택해주세요.');
            return;
        }

        if (!window.confirm(`선택된 ${selectedItems.size}개 상품을 장바구니에서 삭제하시겠습니까?`)) {
            return;
        }

        try {
            const response = await fetch(`/api/mypage/cart/batch-remove`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // 세션 쿠키 포함
                body: JSON.stringify({ itemIds: Array.from(selectedItems) })
            });

            if (response.ok) {
                const deleteResult = await response.json();
                console.log('배치 삭제 결과:', deleteResult);
                
                if (deleteResult) {
                    // 삭제 성공 시 서버에서 최신 장바구니 데이터 다시 조회
                    console.log('배치 삭제 성공, 장바구니 데이터 다시 조회');
                    await fetchCartItems();
                    setSelectedItems(new Set());
                    setSelectAll(false);
                    setMessage('선택된 상품들이 장바구니에서 삭제되었습니다.');
                } else {
                    console.log('배치 삭제 실패 - 서버에서 false 반환');
                    setMessage('상품 삭제에 실패했습니다.');
                }
            } else {
                setMessage('상품 삭제에 실패했습니다.');
            }
        } catch (error) {
            console.error('상품 삭제 오류:', error);
            setMessage('상품 삭제 중 오류가 발생했습니다.');
        }
    };

    // 총 금액 계산
    const calculateTotal = () => {
        return cartItems
            .filter(item => selectedItems.has(item.cartItemId))
            .reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    // 선택된 상품 수
    const selectedCount = selectedItems.size;

    if (loading) {
        return <div className="loading">장바구니를 불러오는 중...</div>;
    }

    return (
        <div className="buyer-cart-container">
            {/* ... (기존 UI 코드) ... */}
            <div className="header">
                <h1>🛒 장바구니</h1>
                <p>담아둔 상품들을 확인하고 결제하세요</p>
            </div>
            {message && (
                <div className={`message ${message.includes('성공') ? 'success' : 'error'}`}>
                    {message}
                </div>
            )}
            <div className="cart-summary">
                <div className="summary-stats">
                    <div className="stat-item">
                        <div className="stat-number">{cartItems.length}</div>
                        <div className="stat-label">총 상품</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">{Math.round(calculateTotal()).toLocaleString()}원</div>
                        <div className="stat-label">총 결제 금액</div>
                    </div>
                </div>
                {cartItems.length > 0 && (
                    <div className="cart-actions">
                        <button 
                            className="select-all-btn"
                            onClick={handleSelectAll}
                        >
                            {selectAll ? '❌ 전체 해제' : '✅ 전체 선택'}
                        </button>
                        {selectedCount > 0 && (
                            <>
                                <button 
                                    className="remove-selected-btn"
                                    onClick={handleRemoveSelected}
                                >
                                    🗑️ 선택 삭제
                                </button>
                                <button 
                                    className="checkout-btn"
                                    onClick={handleCheckout}
                                >
                                    💳 선택 상품 결제
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
            <div className="cart-section">
                <h3>📋 장바구니 상품</h3>
                
                {cartItems.length === 0 ? (
                    <div className="empty-cart">
                        <div className="empty-cart-icon">🛒</div>
                        <h4>장바구니가 비어있습니다</h4>
                        <p>맛있는 고기를 찾아보세요!</p>
                        <button 
                            className="shop-now-btn"
                            onClick={() => navigate('/products')}
                        >
                            🥩 상품 둘러보기
                        </button>
                    </div>
                ) : (
                    <div className="cart-items-list">
                        {cartItems.map((item, index) => (
                            <div key={item.cartItemId || index} className="cart-item-card">
                                <div className="item-selection">
                                    <input
                                        type="checkbox"
                                        checked={selectedItems.has(item.cartItemId)}
                                        onChange={() => handleSelectItem(item.cartItemId)}
                                        className="item-checkbox"
                                    />
                                </div>
                                <div className="item-image">
                                    {item.productImageUrl ? (
                                        <img src={item.productImageUrl} alt={item.title} />
                                    ) : (
                                        <div className="placeholder-image">🥩</div>
                                    )}
                                </div>
                                <div className="item-details">
                                    <h4>{item.title || '상품명 없음'}</h4>
                                    <p className="item-description">
                                        {item.description || '상품 설명이 없습니다.'}
                                    </p>
                                    <div className="item-options">
                                        {item.grade && (
                                            <span className="grade-badge">
                                                {item.grade}등급
                                            </span>
                                        )}
                                        {item.weight && (
                                            <span className="weight-badge">
                                                {item.weight}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="item-price">
                                    <div className="price-info">
                                        <p className="unit-price">
                                            단가: {item.price ? `${Math.round(item.price).toLocaleString()}원` : '가격 정보 없음'}
                                        </p>
                                        <p className="total-price">
                                            총액: <strong>
                                                {item.price && item.quantity 
                                                    ? `${Math.round(item.price * item.quantity).toLocaleString()}원`
                                                    : item.totalPrice 
                                                        ? `${Math.round(item.totalPrice).toLocaleString()}원`
                                                        : '계산 불가'
                                                }
                                            </strong>
                                        </p>
                                    </div>
                                </div>
                                <div className="item-quantity">
                                    <label>수량:</label>
                                    <div className="quantity-controls">
                                        <button 
                                            className="quantity-btn"
                                            onClick={() => handleQuantityChange(item.cartItemId, item.quantity - 1)}
                                            disabled={item.quantity <= 1}
                                        >
                                            -
                                        </button>
                                        <span className="quantity-display">{item.quantity}</span>
                                        <button 
                                            className="quantity-btn"
                                            onClick={() => handleQuantityChange(item.cartItemId, item.quantity + 1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                <div className="item-actions">
                                    <button 
                                        className="purchase-confirm-btn"
                                        onClick={() => handlePurchaseConfirm(item.cartItemId)}
                                    >
                                        결제
                                    </button>
                                    <button 
                                        className="remove-item-btn"
                                        onClick={() => handleRemoveItem(item.cartItemId)}
                                    >
                                        삭제
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {selectedCount > 0 && (
                <div className="checkout-summary">
                    <h3>💳 결제 요약</h3>
                    <div className="checkout-details">
                        <div className="checkout-info">
                            <p><strong>선택된 상품:</strong> {selectedCount}개</p>
                            <p><strong>총 결제 금액:</strong> {Math.round(calculateTotal()).toLocaleString()}원</p>
                            <p><strong>배송비:</strong> 무료</p>
                        </div>
                        <div className="checkout-actions">
                            <button 
                                className="checkout-now-btn"
                                onClick={handleCheckout}
                            >
                                💳 바로 결제하기
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className="cart-tips">
                <h3>💡 장바구니 활용 팁</h3>
                <div className="tips-content">
                    <div className="tip-item">
                        <div className="tip-icon">💰</div>
                        <div className="tip-text">
                            <h4>할인 혜택</h4>
                            <p>여러 상품을 함께 구매하면 추가 할인을 받을 수 있습니다.</p>
                        </div>
                    </div>
                    <div className="tip-item">
                        <div className="tip-icon">🚚</div>
                        <div className="tip-text">
                            <h4>무료 배송</h4>
                            <p>일정 금액 이상 구매 시 무료 배송 서비스를 제공합니다.</p>
                        </div>
                    </div>
                    <div className="tip-item">
                        <div className="tip-icon">⏰</div>
                        <div className="tip-text">
                            <h4>재고 확인</h4>
                            <p>장바구니에 담은 상품의 재고를 실시간으로 확인하세요.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BuyerCart;