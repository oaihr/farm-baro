import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
    const { userType, userId } = useParams();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedItems, setSelectedItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
        fetchCartItems();
    }, [userType, userId]);

    useEffect(() => {
        calculateTotal();
    }, [selectedItems, cartItems]);

    const fetchCartItems = async () => {
        try {
            const response = await fetch(`/api/mypage/${userType}/${userId}/cart`);
            if (response.ok) {
                const data = await response.json();
                setCartItems(data);
            }
        } catch (error) {
            console.error('Error fetching cart items:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTotalAmount = async () => {
        try {
            const response = await fetch(`/api/mypage/${userType}/${userId}/cart/total`);
            if (response.ok) {
                const data = await response.json();
                setTotalAmount(data);
            }
        } catch (error) {
            console.error('Error fetching total amount:', error);
        }
    };

    const calculateTotal = () => {
        const total = cartItems
            .filter(item => selectedItems.includes(item.cartId))
            .reduce((sum, item) => sum + (item.price * item.quantity), 0);
        setTotalAmount(total);
    };

    const handleQuantityChange = async (cartId, newQuantity) => {
        if (newQuantity < 1) return;

        try {
            const response = await fetch(`/api/mypage/cart/${cartId}/quantity?quantity=${newQuantity}`, {
                method: 'PUT'
            });
            if (response.ok) {
                fetchCartItems();
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    const handleRemoveItem = async (saleItemId) => {
        if (!window.confirm('정말로 이 상품을 장바구니에서 삭제하시겠습니까?')) {
            return;
        }

        try {
            console.log('장바구니 삭제 요청 - saleItemId:', saleItemId);
            
            const response = await fetch(`/mypage/api/cart/${saleItemId}`, {
                method: 'DELETE',
                credentials: 'include' // 세션 쿠키 포함
            });

            console.log('삭제 응답 상태:', response.status);

            if (response.ok) {
                setSelectedItems(prev => prev.filter(id => id !== saleItemId));
                fetchCartItems();
                console.log('장바구니에서 상품 삭제 성공');
            } else {
                const errorText = await response.text();
                console.error('삭제 실패:', response.status, errorText);
                alert('상품 삭제에 실패했습니다.');
            }
        } catch (error) {
            console.error('Error removing item:', error);
            alert('상품 삭제 중 오류가 발생했습니다.');
        }
    };

    const handleSelectItem = (cartId) => {
        setSelectedItems(prev => 
            prev.includes(cartId) 
                ? prev.filter(id => id !== cartId)
                : [...prev, cartId]
        );
    };

    const handleSelectAll = () => {
        if (selectedItems.length === cartItems.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(cartItems.map(item => item.cartId));
        }
    };

    const handleCheckout = () => {
        if (selectedItems.length === 0) {
            alert('선택된 상품이 없습니다.');
            return;
        }

        // 결제 API 연결 로직
        const selectedCartItems = cartItems.filter(item => selectedItems.includes(item.cartId));
        console.log('결제할 상품들:', selectedCartItems);
        console.log('총 금액:', totalAmount);
        
        // 여기에 실제 결제 API 호출 로직을 구현
        alert('결제 기능이 구현되어야 합니다.');
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('ko-KR').format(price) + '원';
    };

    if (loading) {
        return <div className="loading">장바구니를 불러오는 중...</div>;
    }

    return (
        <div className="cart-container">
            <div className="cart-header">
                <h2>장바구니</h2>
                <div className="cart-summary">
                    <span>총 {cartItems.length}개 상품</span>
                    <span>선택된 상품: {selectedItems.length}개</span>
                </div>
            </div>

            {cartItems.length === 0 ? (
                <div className="empty-cart">
                    <p>장바구니가 비어있습니다.</p>
                </div>
            ) : (
                <>
                    <div className="cart-controls">
                        <label className="select-all">
                            <input
                                type="checkbox"
                                checked={selectedItems.length === cartItems.length && cartItems.length > 0}
                                onChange={handleSelectAll}
                            />
                            <span>전체 선택</span>
                        </label>
                        
                        {selectedItems.length > 0 && (
                            <button 
                                className="btn btn-danger"
                                onClick={() => {
                                    if (window.confirm('선택된 상품을 삭제하시겠습니까?')) {
                                        selectedItems.forEach(cartId => handleRemoveItem(cartId));
                                    }
                                }}
                            >
                                선택 삭제
                            </button>
                        )}
                    </div>

                    <div className="cart-items">
                        {cartItems.map((item) => (
                            <div key={item.cartId} className="cart-item">
                                <div className="item-select">
                                    <input
                                        type="checkbox"
                                        checked={selectedItems.includes(item.cartId)}
                                        onChange={() => handleSelectItem(item.cartId)}
                                    />
                                </div>

                                <div className="item-image">
                                    <img 
                                        src={item.productImage || '/default-product.png'} 
                                        alt={item.productName}
                                    />
                                </div>

                                <div className="item-info">
                                    <h4>{item.productName}</h4>
                                    <p className="seller">판매자: {item.sellerName}</p>
                                    <p className="price">{formatPrice(item.price)}</p>
                                </div>

                                <div className="item-quantity">
                                    <button 
                                        className="quantity-btn"
                                        onClick={() => handleQuantityChange(item.cartId, item.quantity - 1)}
                                        disabled={item.quantity <= 1}
                                    >
                                        -
                                    </button>
                                    <span className="quantity">{item.quantity}</span>
                                    <button 
                                        className="quantity-btn"
                                        onClick={() => handleQuantityChange(item.cartId, item.quantity + 1)}
                                        disabled={item.quantity >= item.availableQuantity}
                                    >
                                        +
                                    </button>
                                </div>

                                <div className="item-total">
                                    <p>{formatPrice(item.price * item.quantity)}</p>
                                </div>

                                <div className="item-actions">
                                    <button 
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleRemoveItem(item.saleItemId)}
                                    >
                                        삭제
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="cart-footer">
                        <div className="cart-total">
                            <h3>선택된 상품 총 금액: {formatPrice(totalAmount)}</h3>
                        </div>
                        
                        <div className="cart-actions">
                            <button 
                                className="btn btn-primary btn-large"
                                onClick={handleCheckout}
                                disabled={selectedItems.length === 0}
                            >
                                선택 상품 주문하기
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;
