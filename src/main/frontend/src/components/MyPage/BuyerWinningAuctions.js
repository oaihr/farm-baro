import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './BuyerWinningAuctions.css';

const BuyerWinningAuctions = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [winningAuctions, setWinningAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [isIamportLoaded, setIsIamportLoaded] = useState(false);

    // Iamport SDK를 동적으로 로드하는 useEffect
    useEffect(() => {
        // 이미 SDK가 로드되었는지 확인
        if (typeof window.IMP !== 'undefined') {
            setIsIamportLoaded(true);
            return;
        }

        const script = document.createElement("script");
        script.src = "https://cdn.iamport.kr/js/iamport.payment-1.2.0.js";
        script.async = true;
        
        script.onload = () => {
            const IMP = window.IMP;
            // TODO: 'imp13778606'을 본인의 '가맹점 식별코드'로 변경
            IMP.init("imp13778606"); 
            setIsIamportLoaded(true);
            console.log("Iamport SDK is successfully loaded.");
        };

        script.onerror = () => {
            console.error("Failed to load Iamport SDK.");
            setMessage("결제 모듈을 불러오는 데 실패했습니다. 잠시 후 다시 시도해 주세요.");
        };

        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        };
    }, []);

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
                setMessage('낙찰상품이 없습니다.');
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

    // 낙찰상품 구매 확정 및 결제 처리
    const handlePurchaseConfirm = async (auctionId, bidPrice, auctionTitle) => {
        if (!isIamportLoaded) {
            setMessage('결제 모듈이 아직 로드되지 않았습니다. 잠시 후 다시 시도해 주세요.');
            return;
        }

        const IMP = window.IMP;
        
        // 결제 요청 데이터
        const paymentData = {
            pg: "html5_inicis.INIpayTest", // 테스트 모드용 PG 코드
            pay_method: "card",
            merchant_uid: `order_${new Date().getTime()}_${auctionId}`,
            name: auctionTitle,
            amount: bidPrice,
            buyer_email: "test@example.com", // TODO: 실제 사용자 정보로 변경
            buyer_name: "구매자",
            buyer_tel: "010-1234-5678",
        };

        // 결제창 호출
        IMP.request_pay(paymentData, async (rsp) => {
            if (rsp.success) {
                // 결제 성공 시
                console.log("결제 성공. imp_uid:", rsp.imp_uid);
                
                // 백엔드에 구매 확정 요청
                try {
                    const confirmResponse = await fetch(`http://localhost:8080/mypage/api/auctions/${auctionId}/purchase-confirm`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            auctionId: auctionId,
                            bidPrice: bidPrice
                        })
                    });

                    if (confirmResponse.ok) {
                        setMessage('낙찰상품 구매가 확정되었습니다! 🎉');
                        // 구매 확정된 상품을 목록에서 제거
                        setWinningAuctions(prev => prev.filter(auction => auction.auctionId !== auctionId));
                    } else {
                        console.error('백엔드 구매 확정 실패');
                        setMessage('구매 확정에 실패했습니다.');
                    }
                } catch (error) {
                    console.error('백엔드 통신 오류:', error);
                    setMessage('구매 확정 중 오류가 발생했습니다.');
                }
            } else {
                // 결제 실패 또는 취소 시
                console.error("결제 실패:", rsp.error_msg);
                setMessage(`결제에 실패했습니다: ${rsp.error_msg}`);
            }
        });
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
                                        onClick={() => handlePurchaseConfirm(auction.auctionId, auction.bidPrice, auction.auctionTitle)}
                                        disabled={!isIamportLoaded} // SDK가 로드되지 않으면 버튼 비활성화
                                    >
                                        결제하기
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