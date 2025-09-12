import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './BuyerAuctions.css';

const BuyerAuctions = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [filter, setFilter] = useState('all'); // all, bidding, won, lost, completed

    // 경매 목록 가져오기
    const fetchAuctions = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/mypage/buyers/${userId}/auctions`);
            if (response.ok) {
                const data = await response.json();
                setAuctions(data);
            } else {
                console.error('경매 목록 조회 실패');
                setMessage('경매 목록을 불러오는데 실패했습니다.');
            }
        } catch (error) {
            console.error('경매 목록 조회 오류:', error);
            setMessage('경매 목록 조회 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAuctions();
        // 1초마다 경매 상태 업데이트 (실시간 카운트다운)
        const interval = setInterval(fetchAuctions, 1000);
        return () => clearInterval(interval);
    }, [userId]);

    // 경매 상태별 필터링
    const filteredAuctions = auctions.filter(auction => {
        if (filter === 'all') return true;
        return auction.status === filter;
    });

    // 경매 상태별 색상 및 텍스트
    const getStatusInfo = (status) => {
        switch (status) {
            case 'BIDDING':
                return { text: '입찰 중', color: '#3498db', bgColor: '#dbeafe' };
            case 'WON':
                return { text: '낙찰 성공', color: '#2ecc71', bgColor: '#dcfce7' };
            case 'LOST':
                return { text: '낙찰 실패', color: '#e74c3c', bgColor: '#fee2e2' };
            case 'COMPLETED':
                return { text: '경매 완료', color: '#27ae60', bgColor: '#d1fae5' };
            case 'EXPIRED':
                return { text: '경매 만료', color: '#95a5a6', bgColor: '#f8f9fa' };
            default:
                return { text: '상태 미정', color: '#95a5a6', bgColor: '#f8f9fa' };
        }
    };

    // 경매 상태별 필터 옵션
    const filterOptions = [
        { value: 'all', label: '전체 경매' },
        { value: 'BIDDING', label: '입찰 중' },
        { value: 'WON', label: '낙찰 성공' },
        { value: 'LOST', label: '낙찰 실패' },
        { value: 'COMPLETED', label: '경매 완료' },
        { value: 'EXPIRED', label: '경매 만료' }
    ];

    // 남은 시간 계산 (초 단위)
    const getTimeRemaining = (endTime) => {
        if (!endTime) return 0;
        const now = new Date().getTime();
        const end = new Date(endTime).getTime();
        const remaining = Math.max(0, Math.floor((end - now) / 1000));
        return remaining;
    };

    // 시간 포맷팅 (일:시:분:초)
    const formatTime = (seconds) => {
        if (seconds <= 0) return '00:00:00:00';
        
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        return `${days.toString().padStart(2, '0')}:${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // 낙찰 결제 처리
    const handlePayment = async (auctionId) => {
        if (!window.confirm('낙찰된 상품을 결제하시겠습니까?')) {
            return;
        }

        try {
            // 결제 API 호출 (실제 결제 시스템 연동)
            const response = await fetch(`/mypage/api/auctions/${auctionId}/payment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    paymentMethod: 'card', // 또는 'bank', 'mobile' 등
                    amount: auctions.find(a => a.auctionId === auctionId)?.currentPrice || 0
                })
            });

            if (response.ok) {
                setMessage('결제가 성공적으로 완료되었습니다! 🎉');
                fetchAuctions(); // 경매 목록 새로고침
            } else {
                setMessage('결제 처리에 실패했습니다.');
            }
        } catch (error) {
            console.error('결제 오류:', error);
            setMessage('결제 처리 중 오류가 발생했습니다.');
        }
    };

    // 입찰 취소
    const handleCancelBid = async (auctionId) => {
        if (!window.confirm('정말로 이 입찰을 취소하시겠습니까?')) {
            return;
        }

        try {
            const response = await fetch(`/mypage/api/auctions/${auctionId}/cancel-bid`, {
                method: 'PUT'
            });

            if (response.ok) {
                setMessage('입찰이 성공적으로 취소되었습니다.');
                fetchAuctions(); // 경매 목록 새로고침
            } else {
                setMessage('입찰 취소에 실패했습니다.');
            }
        } catch (error) {
            console.error('입찰 취소 오류:', error);
            setMessage('입찰 취소 중 오류가 발생했습니다.');
        }
    };

    if (loading) {
        return <div className="loading">경매 내역을 불러오는 중...</div>;
    }

    return (
        <div className="buyer-auctions-container">
            {/* 헤더 */}
            <div className="header">
                <h1>🏆 경매 상품</h1>
                <p>입찰/낙찰 현황과 결제를 관리하세요</p>
            </div>

            {/* 메시지 표시 */}
            {message && (
                <div className={`message ${message.includes('성공') ? 'success' : 'error'}`}>
                    {message}
                </div>
            )}

            {/* 필터 및 통계 */}
            <div className="auctions-summary">
                <div className="summary-stats">
                    <div className="stat-item">
                        <div className="stat-number">{auctions.length}</div>
                        <div className="stat-label">총 경매</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">
                            {auctions.filter(a => a.status === 'BIDDING').length}
                        </div>
                        <div className="stat-label">입찰 중</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">
                            {auctions.filter(a => a.status === 'WON').length}
                        </div>
                        <div className="stat-label">낙찰 성공</div>
                    </div>
                </div>

                <div className="filter-section">
                    <label>경매 상태 필터:</label>
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

            {/* 경매 목록 */}
            <div className="auctions-section">
                <h3>📋 경매 내역</h3>
                
                {filteredAuctions.length === 0 ? (
                    <div className="no-auctions">
                        <div className="no-auctions-icon">🏆</div>
                        <h4>참여한 경매가 없습니다</h4>
                        <p>흥미로운 경매에 참여해보세요!</p>
                        <button 
                            className="browse-auctions-btn"
                            onClick={() => navigate('/auctions')}
                        >
                            경매 둘러보기
                        </button>
                    </div>
                ) : (
                    <div className="auctions-list">
                        {filteredAuctions.map((auction, index) => {
                            const statusInfo = getStatusInfo(auction.status);
                            const timeRemaining = getTimeRemaining(auction.endTime);
                            const isExpired = timeRemaining <= 0;
                            
                            return (
                                <div key={auction.auctionId || index} className="auction-card">
                                    <div className="auction-header">
                                        <div className="auction-info">
                                            <h4>{auction.title || '제목 없음'}</h4>
                                            <p className="auction-category">
                                                카테고리: {auction.category || '일반 경매'}
                                            </p>
                                            <p className="auction-end">
                                                경매 종료: {auction.endTime ? new Date(auction.endTime).toLocaleString() : '날짜 정보 없음'}
                                            </p>
                                        </div>
                                        <div 
                                            className="auction-status"
                                            style={{ 
                                                color: statusInfo.color, 
                                                backgroundColor: statusInfo.bgColor 
                                            }}
                                        >
                                            {statusInfo.text}
                                        </div>
                                    </div>

                                    <div className="auction-content">
                                        <div className="product-info">
                                            <div className="product-image">
                                                {auction.productImageUrl ? (
                                                    <img src={auction.productImageUrl} alt={auction.title} />
                                                ) : (
                                                    <div className="placeholder-image">🏆</div>
                                                )}
                                            </div>
                                            <div className="product-details">
                                                <h5>{auction.title || '상품명 없음'}</h5>
                                                <p className="product-description">
                                                    {auction.description || '상품 설명이 없습니다.'}
                                                </p>
                                                <p className="starting-price">
                                                    시작가: {auction.startingPrice ? `${auction.startingPrice.toLocaleString()}원` : '가격 정보 없음'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="auction-details">
                                            <div className="price-info">
                                                <h6>💰 현재 입찰 현황</h6>
                                                <p className="current-price">
                                                    현재가: <strong>{auction.currentPrice ? `${auction.currentPrice.toLocaleString()}원` : '입찰 없음'}</strong>
                                                </p>
                                                {auction.myBid && (
                                                    <p className="my-bid">
                                                        내 입찰가: {auction.myBid.toLocaleString()}원
                                                    </p>
                                                )}
                                                <p className="bid-count">
                                                    총 입찰: {auction.bidCount || 0}회
                                                </p>
                                            </div>

                                            {auction.status === 'BIDDING' && !isExpired && (
                                                <div className="countdown">
                                                    <h6>⏰ 남은 시간</h6>
                                                    <div className="time-remaining">
                                                        {formatTime(timeRemaining)}
                                                    </div>
                                                    {timeRemaining < 3600 && (
                                                        <p className="urgent">⚠️ 1시간 미만 남았습니다!</p>
                                                    )}
                                                </div>
                                            )}

                                            {auction.status === 'WON' && (
                                                <div className="payment-info">
                                                    <h6>💳 결제 정보</h6>
                                                    <p className="payment-deadline">
                                                        결제 마감: {auction.paymentDeadline ? new Date(auction.paymentDeadline).toLocaleString() : '날짜 정보 없음'}
                                                    </p>
                                                    <p className="payment-amount">
                                                        결제 금액: <strong>{auction.currentPrice ? `${auction.currentPrice.toLocaleString()}원` : '금액 정보 없음'}</strong>
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="auction-actions">
                                        {auction.status === 'BIDDING' && !isExpired && (
                                            <>
                                                <button className="bid-btn">
                                                    💰 입찰하기
                                                </button>
                                                {auction.myBid && (
                                                    <button 
                                                        className="cancel-bid-btn"
                                                        onClick={() => handleCancelBid(auction.auctionId)}
                                                    >
                                                        ❌ 입찰 취소
                                                    </button>
                                                )}
                                            </>
                                        )}
                                        
                                        {auction.status === 'WON' && (
                                            <button 
                                                className="payment-btn"
                                                onClick={() => handlePayment(auction.auctionId)}
                                            >
                                                💳 결제하기
                                            </button>
                                        )}
                                        
                                        <button className="detail-btn">
                                            📋 상세보기
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* 경매 참여 가이드 */}
            <div className="auction-guide">
                <h3>📚 경매 참여 가이드</h3>
                <div className="guide-content">
                    <div className="guide-item">
                        <div className="guide-icon">💰</div>
                        <div className="guide-text">
                            <h4>입찰 전략</h4>
                            <p>최고가를 미리 설정하고 마지막 순간에 입찰하는 전략을 사용해보세요.</p>
                        </div>
                    </div>
                    <div className="guide-item">
                        <div className="guide-icon">⏰</div>
                        <div className="guide-text">
                            <h4>시간 관리</h4>
                            <p>경매 종료 시간을 잘 확인하고 마감 직전에 입찰하는 것이 효과적입니다.</p>
                        </div>
                    </div>
                    <div className="guide-item">
                        <div className="guide-icon">💳</div>
                        <div className="guide-text">
                            <h4>빠른 결제</h4>
                            <p>낙찰 후에는 결제 마감 시간을 확인하고 빠르게 결제를 완료하세요.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 실시간 경매 현황 */}
            <div className="live-auctions">
                <h3>🔥 실시간 경매 현황</h3>
                <p>현재 진행 중인 경매를 실시간으로 확인하세요!</p>
                <button 
                    className="live-auctions-btn"
                    onClick={() => navigate('/auctions/live')}
                >
                    🔥 실시간 경매 보기
                </button>
            </div>
        </div>
    );
};

export default BuyerAuctions;
