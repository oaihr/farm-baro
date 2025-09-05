<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>경매 상품</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #4CAF50; }
        .section { margin-bottom: 40px; }
        .section-title { font-size: 24px; color: #333; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid #eee; }
        .bid-list, .winning-list { display: grid; gap: 20px; }
        .bid-item, .winning-item { border: 1px solid #ddd; border-radius: 8px; padding: 20px; background: white; }
        .bid-header, .winning-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
        .product-name { font-size: 18px; font-weight: bold; color: #333; }
        .bid-status { padding: 5px 12px; border-radius: 15px; font-size: 12px; font-weight: bold; }
        .status-active { background: #d4edda; color: #155724; }
        .status-won { background: #cce5ff; color: #004085; }
        .status-lost { background: #f8d7da; color: #721c24; }
        .bid-details { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 15px; }
        .detail-item { background: #f8f9fa; padding: 10px; border-radius: 4px; }
        .detail-label { font-size: 12px; color: #666; margin-bottom: 5px; }
        .detail-value { font-weight: bold; color: #333; }
        .countdown { background: #fff3cd; padding: 15px; border-radius: 8px; margin: 15px 0; text-align: center; border-left: 4px solid #ffc107; }
        .countdown-title { font-weight: bold; color: #856404; margin-bottom: 10px; }
        .countdown-timer { font-size: 24px; font-weight: bold; color: #e74c3c; }
        .payment-section { background: #e8f5e8; padding: 20px; border-radius: 8px; margin-top: 15px; border-left: 4px solid #4CAF50; }
        .payment-title { font-weight: bold; color: #155724; margin-bottom: 15px; }
        .payment-info { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-bottom: 20px; }
        .payment-amount { font-size: 20px; font-weight: bold; color: #e74c3c; }
        .btn { padding: 12px 24px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; text-decoration: none; display: inline-block; text-align: center; }
        .btn-primary { background: #4CAF50; color: white; }
        .btn-primary:hover { background: #45a049; }
        .btn-warning { background: #ff9800; color: white; }
        .btn-warning:hover { background: #f57c00; }
        .btn-danger { background: #f44336; color: white; }
        .btn-danger:hover { background: #d32f2f; }
        .no-bids, .no-winnings { text-align: center; padding: 40px; color: #666; }
        .back-link { margin-top: 20px; text-align: center; }
        .back-link a { color: #4CAF50; text-decoration: none; }
        .back-link a:hover { text-decoration: underline; }
        .urgent { animation: pulse 2s infinite; }
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.7; } 100% { opacity: 1; } }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>경매 상품</h1>
            <p>입찰 현황과 낙찰 상품을 확인하세요</p>
        </div>

        <!-- 입찰 현황 -->
        <div class="section">
            <h2 class="section-title">🏷️ 입찰 현황</h2>
            <div class="bid-list">
                <c:choose>
                    <c:when test="${empty bids}">
                        <div class="no-bids">
                            <h3>진행 중인 입찰이 없습니다</h3>
                            <p>경매 상품에 입찰해보세요!</p>
                        </div>
                    </c:when>
                    <c:otherwise>
                        <c:forEach var="bid" items="${bids}">
                            <div class="bid-item">
                                <div class="bid-header">
                                    <div class="product-name">${bid.productName}</div>
                                    <span class="bid-status status-${bid.bidStatus == '낙찰' ? 'won' : bid.bidStatus == '진행중' ? 'active' : 'lost'}">
                                        ${bid.bidStatus}
                                    </span>
                                </div>
                                
                                <div class="bid-details">
                                    <div class="detail-item">
                                        <div class="detail-label">입찰 금액</div>
                                        <div class="detail-value">${bid.bidPrice}원</div>
                                    </div>
                                    <div class="detail-item">
                                        <div class="detail-label">입찰 시간</div>
                                        <div class="detail-value">
                                            <fmt:formatDate value="${bid.bidDate}" pattern="yyyy-MM-dd HH:mm"/>
                                        </div>
                                    </div>
                                    <div class="detail-item">
                                        <div class="detail-label">경매 종료</div>
                                        <div class="detail-value">
                                            <fmt:formatDate value="${bid.auctionEndDate}" pattern="yyyy-MM-dd HH:mm"/>
                                        </div>
                                    </div>
                                </div>
                                
                                <c:if test="${bid.bidStatus == '진행중'}">
                                    <div class="countdown" id="countdown-${bid.bidId}">
                                        <div class="countdown-title">⏰ 경매 종료까지 남은 시간</div>
                                        <div class="countdown-timer" id="timer-${bid.bidId}">계산 중...</div>
                                    </div>
                                </c:if>
                            </div>
                        </c:forEach>
                    </c:otherwise>
                </c:choose>
            </div>
        </div>

        <!-- 낙찰 내역 -->
        <div class="section">
            <h2 class="section-title">🏆 낙찰 내역</h2>
            <div class="winning-list">
                <c:choose>
                    <c:when test="${empty winningBids}">
                        <div class="no-winnings">
                            <h3>낙찰된 상품이 없습니다</h3>
                            <p>경매에서 낙찰받은 상품이 여기에 표시됩니다.</p>
                        </div>
                    </c:when>
                    <c:otherwise>
                        <c:forEach var="winning" items="${winningBids}">
                            <div class="winning-item">
                                <div class="winning-header">
                                    <div class="product-name">${winning.productName}</div>
                                    <span class="bid-status status-won">낙찰 완료</span>
                                </div>
                                
                                <div class="bid-details">
                                    <div class="detail-item">
                                        <div class="detail-label">낙찰 금액</div>
                                        <div class="detail-value">${winning.bidPrice}원</div>
                                    </div>
                                    <div class="detail-item">
                                        <div class="detail-label">낙찰 시간</div>
                                        <div class="detail-value">
                                            <fmt:formatDate value="${winning.bidDate}" pattern="yyyy-MM-dd HH:mm"/>
                                        </div>
                                    </div>
                                    <div class="detail-item">
                                        <div class="detail-label">결제 마감</div>
                                        <div class="detail-value">
                                            <fmt:formatDate value="${winning.paymentDeadline}" pattern="yyyy-MM-dd HH:mm"/>
                                        </div>
                                    </div>
                                </div>
                                
                                <c:if test="${winning.paymentStatus != '결제완료'}">
                                    <div class="countdown ${winning.urgent ? 'urgent' : ''}" id="payment-countdown-${winning.bidId}">
                                        <div class="countdown-title">💳 결제 마감까지 남은 시간</div>
                                        <div class="countdown-timer" id="payment-timer-${winning.bidId}">계산 중...</div>
                                    </div>
                                    
                                    <div class="payment-section">
                                        <div class="payment-title">결제 정보</div>
                                        <div class="payment-info">
                                            <div class="detail-item">
                                                <div class="detail-label">상품명</div>
                                                <div class="detail-value">${winning.productName}</div>
                                            </div>
                                            <div class="detail-item">
                                                <div class="detail-label">낙찰가</div>
                                                <div class="payment-amount">${winning.bidPrice}원</div>
                                            </div>
                                            <div class="detail-item">
                                                <div class="detail-label">배송비</div>
                                                <div class="detail-value">${winning.deliveryFee}원</div>
                                            </div>
                                        </div>
                                        <div style="text-align: center;">
                                            <button class="btn btn-primary" onclick="processPayment(${winning.bidId}, ${winning.bidPrice + winning.deliveryFee})">
                                                💳 바로 결제하기
                                            </button>
                                        </div>
                                    </div>
                                </c:if>
                                
                                <c:if test="${winning.paymentStatus == '결제완료'}">
                                    <div style="background: #d4edda; padding: 15px; border-radius: 8px; margin-top: 15px; text-align: center; color: #155724;">
                                        ✅ 결제가 완료되었습니다. 상품 준비 중입니다.
                                    </div>
                                </c:if>
                            </div>
                        </c:forEach>
                    </c:otherwise>
                </c:choose>
            </div>
        </div>

        <div class="back-link">
            <a href="/mypage/buyer/${userId}">← 마이페이지로 돌아가기</a>
        </div>
    </div>

    <script>
        // 카운트다운 타이머 함수들
        function updateCountdown(endDate, elementId) {
            const now = new Date().getTime();
            const end = new Date(endDate).getTime();
            const distance = end - now;
            
            if (distance < 0) {
                document.getElementById(elementId).innerHTML = "종료됨";
                return;
            }
            
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            let timeString = "";
            if (days > 0) timeString += days + "일 ";
            if (hours > 0) timeString += hours + "시간 ";
            if (minutes > 0) timeString += minutes + "분 ";
            timeString += seconds + "초";
            
            document.getElementById(elementId).innerHTML = timeString;
            
            // 1초마다 업데이트
            setTimeout(() => updateCountdown(endDate, elementId), 1000);
        }

        // 페이지 로드 시 모든 카운트다운 시작
        document.addEventListener('DOMContentLoaded', function() {
            // 입찰 카운트다운
            <c:forEach var="bid" items="${bids}">
                <c:if test="${bid.bidStatus == '진행중'}">
                    updateCountdown('${bid.auctionEndDate}', 'timer-${bid.bidId}');
                </c:if>
            </c:forEach>
            
            // 결제 카운트다운
            <c:forEach var="winning" items="${winningBids}">
                <c:if test="${winning.paymentStatus != '결제완료'}">
                    updateCountdown('${winning.paymentDeadline}', 'payment-timer-${winning.bidId}');
                </c:if>
            </c:forEach>
        });

        // 결제 처리 함수
        function processPayment(bidId, totalAmount) {
            if (confirm(`총 ${totalAmount.toLocaleString()}원을 결제하시겠습니까?`)) {
                // 실제 결제 API 호출
                const paymentData = {
                    bidId: bidId,
                    amount: totalAmount,
                    paymentMethod: 'card', // 기본값
                    buyerId: '${userId}'
                };
                
                // 결제 API 호출 (실제 구현 시 결제 게이트웨이 연동)
                fetch('/api/payment/process', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(paymentData)
                })
                .then(response => response.json())
                .then(result => {
                    if (result.success) {
                        alert('결제가 완료되었습니다!');
                        location.reload();
                    } else {
                        alert('결제에 실패했습니다: ' + result.message);
                    }
                })
                .catch(error => {
                    console.error('Payment Error:', error);
                    // 실제 결제 게이트웨이 연동 시에는 여기서 결제 페이지로 리다이렉트
                    alert('결제 시스템에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.');
                    
                    // 임시로 결제 완료 처리 (테스트용)
                    if (confirm('테스트 모드: 결제를 완료된 것으로 처리하시겠습니까?')) {
                        updatePaymentStatus(bidId);
                    }
                });
            }
        }

        // 결제 상태 업데이트 (테스트용)
        function updatePaymentStatus(bidId) {
            fetch(`/api/mypage/bids/${bidId}/payment-status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ paymentStatus: '결제완료' })
            })
            .then(response => response.json())
            .then(result => {
                if (result) {
                    alert('결제 상태가 업데이트되었습니다.');
                    location.reload();
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('상태 업데이트에 실패했습니다.');
            });
        }
    </script>
</body>
</html>

