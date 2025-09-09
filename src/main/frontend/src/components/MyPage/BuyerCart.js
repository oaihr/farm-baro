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

    // 장바구니 목록 가져오기
    const fetchCartItems = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:8080/api/mypage/buyers/${userId}/cart`);
            if (response.ok) {
                const data = await response.json();
                setCartItems(data);
                // 모든 아이템 선택 해제
                setSelectedItems(new Set());
                setSelectAll(false);
            } else {
                console.error('장바구니 조회 실패');
                setMessage('장바구니를 불러오는데 실패했습니다.');
            }
        } catch (error) {
            console.error('장바구니 조회 오류:', error);
            setMessage('장바구니 조회 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchCartItems();
    }, [fetchCartItems]);

    // 전체 선택/해제
    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedItems(new Set());
            setSelectAll(false);
        } else {
            const allItemIds = new Set(cartItems.map(item => item.cartItemId));
            setSelectedItems(allItemIds);
            setSelectAll(true);
        }
    };

    // 개별 아이템 선택/해제
    const handleSelectItem = (itemId) => {
        const newSelectedItems = new Set(selectedItems);
        if (newSelectedItems.has(itemId)) {
            newSelectedItems.delete(itemId);
        } else {
            newSelectedItems.add(itemId);
        }
        setSelectedItems(newSelectedItems);
        setSelectAll(newSelectedItems.size === cartItems.length);
    };

    // 수량 변경
    const handleQuantityChange = async (itemId, newQuantity) => {
        if (newQuantity < 1) return;

        try {
            const response = await fetch(`http://localhost:8080/mypage/api/cart/${itemId}/quantity`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ quantity: newQuantity })
            });

            if (response.ok) {
                setCartItems(prev => prev.map(item => 
                    item.cartItemId === itemId 
                        ? { ...item, quantity: newQuantity }
                        : item
                ));
                setMessage('수량이 성공적으로 변경되었습니다.');
            } else {
                setMessage('수량 변경에 실패했습니다.');
            }
        } catch (error) {
            console.error('수량 변경 오류:', error);
            setMessage('수량 변경 중 오류가 발생했습니다.');
        }
    };

    // 장바구니에서 삭제
    const handleRemoveItem = async (itemId) => {
        if (!window.confirm('정말로 이 상품을 장바구니에서 삭제하시겠습니까?')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/mypage/api/cart/${itemId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setCartItems(prev => prev.filter(item => item.cartItemId !== itemId));
                setSelectedItems(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(itemId);
                    return newSet;
                });
                setMessage('상품이 장바구니에서 삭제되었습니다.');
            } else {
                setMessage('상품 삭제에 실패했습니다.');
            }
        } catch (error) {
            console.error('상품 삭제 오류:', error);
            setMessage('상품 삭제 중 오류가 발생했습니다.');
        }
    };

    // 개별 상품 구매 확정
    const handlePurchaseConfirm = async (itemId) => {
        const item = cartItems.find(item => item.cartItemId === itemId);
        if (!item) return;

        const totalAmount = item.price * item.quantity;
        
        if (!window.confirm(`${item.title} 상품을 ${totalAmount.toLocaleString()}원에 구매 확정하시겠습니까?`)) {
            return;
        }

        try {
            // TODO: 실제 구매 확정 API 호출 (추후 구현)
            const response = await fetch(`http://localhost:8080/mypage/api/cart/${itemId}/purchase-confirm`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    itemId: itemId,
                    totalAmount: totalAmount
                })
            });

            if (response.ok) {
                setMessage('구매가 확정되었습니다! 🎉');
                // 구매 확정된 상품을 장바구니에서 제거
                setCartItems(prev => prev.filter(cartItem => cartItem.cartItemId !== itemId));
                setSelectedItems(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(itemId);
                    return newSet;
                });
            } else {
                setMessage('구매 확정에 실패했습니다.');
            }
        } catch (error) {
            console.error('구매 확정 오류:', error);
            setMessage('구매 확정 중 오류가 발생했습니다.');
        }
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
            const response = await fetch(`http://localhost:8080/mypage/api/cart/batch-remove`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ itemIds: Array.from(selectedItems) })
            });

            if (response.ok) {
                setCartItems(prev => prev.filter(item => !selectedItems.has(item.cartItemId)));
                setSelectedItems(new Set());
                setSelectAll(false);
                setMessage('선택된 상품들이 장바구니에서 삭제되었습니다.');
            } else {
                setMessage('상품 삭제에 실패했습니다.');
            }
        } catch (error) {
            console.error('상품 삭제 오류:', error);
            setMessage('상품 삭제 중 오류가 발생했습니다.');
        }
    };

    // 선택된 상품들 결제
    const handleCheckout = async () => {
        if (selectedItems.size === 0) {
            setMessage('결제할 상품을 선택해주세요.');
            return;
        }

        const selectedCartItems = cartItems.filter(item => selectedItems.has(item.cartItemId));
        const totalAmount = selectedCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        if (!window.confirm(`선택된 ${selectedItems.size}개 상품을 ${totalAmount.toLocaleString()}원에 결제하시겠습니까?`)) {
            return;
        }

        try {
            // 결제 API 호출 (실제 결제 시스템 연동)
            const response = await fetch(`http://localhost:8080/mypage/api/cart/checkout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    itemIds: Array.from(selectedItems),
                    totalAmount: totalAmount,
                    paymentMethod: 'card' // 또는 'bank', 'mobile' 등
                })
            });

            if (response.ok) {
                setMessage('결제가 성공적으로 완료되었습니다! 🎉');
                // 결제된 상품들을 장바구니에서 제거
                setCartItems(prev => prev.filter(item => !selectedItems.has(item.cartItemId)));
                setSelectedItems(new Set());
                setSelectAll(false);
            } else {
                setMessage('결제 처리에 실패했습니다.');
            }
        } catch (error) {
            console.error('결제 오류:', error);
            setMessage('결제 처리 중 오류가 발생했습니다.');
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
            {/* 헤더 */}
            <div className="header">
                <h1>🛒 장바구니</h1>
                <p>담아둔 상품들을 확인하고 결제하세요</p>
            </div>

            {/* 메시지 표시 */}
            {message && (
                <div className={`message ${message.includes('성공') ? 'success' : 'error'}`}>
                    {message}
                </div>
            )}

            {/* 장바구니 요약 */}
            <div className="cart-summary">
                <div className="summary-stats">
                    <div className="stat-item">
                        <div className="stat-number">{cartItems.length}</div>
                        <div className="stat-label">총 상품</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">{calculateTotal().toLocaleString()}원</div>
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

            {/* 장바구니 목록 */}
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
                                    <p className="item-category">
                                        카테고리: {item.category || '일반 상품'}
                                    </p>
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
                                            단가: {item.price ? `${item.price.toLocaleString()}원` : '가격 정보 없음'}
                                        </p>
                                        <p className="total-price">
                                            총액: <strong>
                                                {item.price && item.quantity 
                                                    ? `${(item.price * item.quantity).toLocaleString()}원`
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
                                        💳 구매 확정
                                    </button>
                                    <button 
                                        className="remove-item-btn"
                                        onClick={() => handleRemoveItem(item.cartItemId)}
                                    >
                                        🗑️ 삭제
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* 결제 요약 */}
            {selectedCount > 0 && (
                <div className="checkout-summary">
                    <h3>💳 결제 요약</h3>
                    <div className="checkout-details">
                        <div className="checkout-info">
                            <p><strong>선택된 상품:</strong> {selectedCount}개</p>
                            <p><strong>총 결제 금액:</strong> {calculateTotal().toLocaleString()}원</p>
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

            {/* 장바구니 팁 */}
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
