import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './BuyerWinningAuctions.css';

const BuyerWinningAuctions = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [winningAuctions, setWinningAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    // 낙찰상품 목록 가져오기
    const fetchWinningAuctions = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:8080/mypage/buyer/${userId}/winning-auctions`);
            if (response.ok) {
                const data = await response.json();
                setWinningAuctions(data);
            } else {
                console.error('낙찰상품 조회 실패');
                setMessage('낙찰상품을 불러오는데 실패했습니다.');
            }
        } catch (error) {
            console.error('낙찰상품 조회 오류:', error);
            setMessage('낙찰상품 조회 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchWinningAuctions();
    }, [fetchWinningAuctions]);

    // 낙찰상품 구매 확정
    const handlePurchaseConfirm = async (auctionId, bidPrice) => {
        if (!window.confirm(`낙찰상품을 ${bidPrice.toLocaleString()}원에 구매 확정하시겠습니까?`)) {
            return;
        }

        try {
            // TODO: 실제 구매 확정 API 호출 (추후 구현)
            const response = await fetch(`http://localhost:8080/mypage/api/auctions/${auctionId}/purchase-confirm`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    auctionId: auctionId,
                    bidPrice: bidPrice
                })
            });

            if (response.ok) {
                setMessage('낙찰상품 구매가 확정되었습니다! 🎉');
                // 구매 확정된 상품을 목록에서 제거
                setWinningAuctions(prev => prev.filter(auction => auction.auctionId !== auctionId));
            } else {
                setMessage('구매 확정에 실패했습니다.');
            }
        } catch (error) {
            console.error('구매 확정 오류:', error);
            setMessage('구매 확정 중 오류가 발생했습니다.');
        }
    };

    // 총 납부 금액 계산
    const calculateTotalAmount = () => {
        return winningAuctions.reduce((sum, auction) => sum + (auction.bidPrice || 0), 0);
    };

    if (loading) {
        return <div className="loading">낙찰상품을 불러오는 중...</div>;
    }

    return (
        <div className="buyer-winning-auctions-container">
            {/* 헤더 */}
            <div className="header">
                <h1>🏆 낙찰상품 납부 대기 리스트</h1>
                <p>경매에서 낙찰받은 상품들의 납부를 완료하세요</p>
            </div>

            {/* 메시지 표시 */}
            {message && (
                <div className={`message ${message.includes('성공') ? 'success' : 'error'}`}>
                    {message}
                </div>
            )}

            {/* 낙찰상품 요약 */}
            <div className="auctions-summary">
                <div className="summary-stats">
                    <div className="stat-item">
                        <div className="stat-number">{winningAuctions.length}</div>
                        <div className="stat-label">낙찰상품</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">{calculateTotalAmount().toLocaleString()}원</div>
                        <div className="stat-label">총 납부 금액</div>
                    </div>
                </div>
            </div>

            {/* 낙찰상품 목록 */}
            <div className="auctions-section">
                <h3>📋 낙찰상품 목록</h3>
                
                {winningAuctions.length === 0 ? (
                    <div className="empty-auctions">
                        <div className="empty-auctions-icon">🏆</div>
                        <h4>낙찰상품이 없습니다</h4>
                        <p>경매에 참여하여 낙찰받은 상품이 여기에 표시됩니다.</p>
                        <button 
                            className="auction-now-btn"
                            onClick={() => navigate('/auctions')}
                        >
                            경매 참여하기
                        </button>
                    </div>
                ) : (
                    <div className="auctions-list">
                        {winningAuctions.map((auction, index) => (
                            <div key={auction.auctionId || index} className="auction-item-card">
                                <div className="auction-image">
                                    <div className="placeholder-image">🥩</div>
                                </div>

                                <div className="auction-details">
                                    <h4>{auction.auctionTitle || '상품명 없음'}</h4>
                                    <p className="auction-description">
                                        경매에서 낙찰받은 상품입니다.
                                    </p>
                                    <div className="auction-info">
                                        <div className="info-item">
                                            <span className="info-label">낙찰가:</span>
                                            <span className="info-value">{auction.bidPrice?.toLocaleString()}원</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">경매 종료일:</span>
                                            <span className="info-value">
                                                {auction.auctionEndDate ? 
                                                    new Date(auction.auctionEndDate).toLocaleDateString() : 
                                                    '정보 없음'
                                                }
                                            </span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">상태:</span>
                                            <span className="status-badge pending">납부 대기</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="auction-price">
                                    <div className="price-info">
                                        <p className="bid-price">
                                            낙찰가: <strong>{auction.bidPrice?.toLocaleString()}원</strong>
                                        </p>
                                    </div>
                                </div>

                                <div className="auction-actions">
                                    <button 
                                        className="purchase-confirm-btn"
                                        onClick={() => handlePurchaseConfirm(auction.auctionId, auction.bidPrice)}
                                    >
                                        구매 확정
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* 납부 안내 */}
            {winningAuctions.length > 0 && (
                <div className="payment-guide">
                    <h3>💡 납부 안내</h3>
                    <div className="guide-content">
                        <div className="guide-item">
                            <div className="guide-icon">⏰</div>
                            <div className="guide-text">
                                <h4>납부 기한</h4>
                                <p>낙찰 후 7일 이내에 납부를 완료해주세요.</p>
                            </div>
                        </div>
                        <div className="guide-item">
                            <div className="guide-icon">💳</div>
                            <div className="guide-text">
                                <h4>결제 방법</h4>
                                <p>카드, 계좌이체, 무통장입금 등 다양한 결제 방법을 지원합니다.</p>
                            </div>
                        </div>
                        <div className="guide-item">
                            <div className="guide-icon">🚚</div>
                            <div className="guide-text">
                                <h4>배송 안내</h4>
                                <p>납부 완료 후 1-2일 내에 배송이 시작됩니다.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BuyerWinningAuctions;
