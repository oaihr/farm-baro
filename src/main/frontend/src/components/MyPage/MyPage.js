import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './MyPage.css';

const MyPage = () => {
    const { userType, userId } = useParams();
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserInfo();
    }, [userType, userId]);

    const fetchUserInfo = async () => {
        try {
            const response = await fetch(`/api/mypage/${userType}/${userId}`);
            if (response.ok) {
                const data = await response.json();
                setUserInfo(data);
            }
        } catch (error) {
            console.error('Error fetching user info:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMenuClick = (menu) => {
        navigate(`/mypage/${userType}/${userId}/${menu}`);
    };

    if (loading) {
        return <div className="loading">로딩 중...</div>;
    }

    if (!userInfo) {
        return (
            <div className="mypage-container">
                <div className="mypage-header">
                    <h1>마이페이지</h1>
                    <div className="user-info">
                        <div className="user-details">
                            <h2>사용자: {userId}</h2>
                            <p>타입: {userType}</p>
                        </div>
                    </div>
                </div>
                <div className="mypage-content">
                    <iframe 
                        src={`/mypage/${userType}/${userId}`}
                        width="100%" 
                        height="800px"
                        title="마이페이지 내용"
                        style={{border: 'none'}}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="mypage-container">
            <div className="mypage-header">
                <h1>마이페이지</h1>
                <div className="user-info">
                    <img 
                        src={userInfo.user?.profileImage || '/default-profile.png'} 
                        alt="프로필" 
                        className="profile-image"
                    />
                    <div className="user-details">
                        <h2>{userInfo.user?.username}</h2>
                        <p>{userInfo.user?.email}</p>
                        <p>{userInfo.user?.userType === 'BUYER' ? '구매자' : '판매자'}</p>
                    </div>
                </div>
            </div>

            <div className="mypage-content">
                <div className="menu-section">
                    <h3>메뉴</h3>
                    <div className="menu-grid">
                        <button 
                            className="menu-item"
                            onClick={() => handleMenuClick('profile')}
                        >
                            <i className="fas fa-user"></i>
                            <span>프로필</span>
                        </button>
                        
                        <button 
                            className="menu-item"
                            onClick={() => handleMenuClick('edit-info')}
                        >
                            <i className="fas fa-edit"></i>
                            <span>개인정보 수정</span>
                        </button>
                        
                        <button 
                            className="menu-item"
                            onClick={() => handleMenuClick('orders')}
                        >
                            <i className="fas fa-shopping-bag"></i>
                            <span>주문/배송</span>
                        </button>
                        
                        <button 
                            className="menu-item"
                            onClick={() => handleMenuClick('reviews')}
                        >
                            <i className="fas fa-star"></i>
                            <span>리뷰</span>
                        </button>
                        
                        <button 
                            className="menu-item"
                            onClick={() => handleMenuClick('inquiries')}
                        >
                            <i className="fas fa-question-circle"></i>
                            <span>문의</span>
                        </button>

                        {userType === 'buyer' && (
                            <>
                                <button 
                                    className="menu-item"
                                    onClick={() => handleMenuClick('bids')}
                                >
                                    <i className="fas fa-gavel"></i>
                                    <span>경매 상품</span>
                                </button>
                                
                                <button 
                                    className="menu-item"
                                    onClick={() => handleMenuClick('cart')}
                                >
                                    <i className="fas fa-shopping-cart"></i>
                                    <span>장바구니</span>
                                </button>
                            </>
                        )}

                        {userType === 'seller' && (
                            <>
                                <button 
                                    className="menu-item"
                                    onClick={() => handleMenuClick('products')}
                                >
                                    <i className="fas fa-box"></i>
                                    <span>등록 상품 목록</span>
                                </button>
                                
                                <button 
                                    className="menu-item"
                                    onClick={() => handleMenuClick('product-register')}
                                >
                                    <i className="fas fa-plus"></i>
                                    <span>상품 등록</span>
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div className="summary-section">
                    <h3>요약 정보</h3>
                    <div className="summary-grid">
                        {userType === 'buyer' && (
                            <>
                                <div className="summary-item">
                                    <h4>최근 주문</h4>
                                    <p>{userInfo.recentOrders?.length || 0}건</p>
                                </div>
                                <div className="summary-item">
                                    <h4>장바구니</h4>
                                    <p>{userInfo.cartCount || 0}개</p>
                                </div>
                                <div className="summary-item">
                                    <h4>입찰 현황</h4>
                                    <p>{userInfo.recentBids?.length || 0}건</p>
                                </div>
                            </>
                        )}
                        
                        {userType === 'seller' && (
                            <>
                                <div className="summary-item">
                                    <h4>등록 상품</h4>
                                    <p>{userInfo.products?.length || 0}개</p>
                                </div>
                                <div className="summary-item">
                                    <h4>최근 주문</h4>
                                    <p>{userInfo.recentOrders?.length || 0}건</p>
                                </div>
                                <div className="summary-item">
                                    <h4>미답변 문의</h4>
                                    <p>{userInfo.pendingInquiryCount || 0}건</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyPage;
