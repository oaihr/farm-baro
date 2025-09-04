<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>주문/배송</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #4CAF50; }
        .filter-section { background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .filter-form { display: flex; gap: 15px; align-items: center; flex-wrap: wrap; }
        .filter-group { display: flex; flex-direction: column; }
        .filter-group label { font-weight: bold; margin-bottom: 5px; }
        .filter-group select, .filter-group input { padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
        .btn { padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; font-size: 14px; text-decoration: none; display: inline-block; }
        .btn-primary { background: #4CAF50; color: white; }
        .btn-primary:hover { background: #45a049; }
        .btn-secondary { background: #666; color: white; }
        .btn-secondary:hover { background: #555; }
        .btn-success { background: #2196F3; color: white; }
        .btn-success:hover { background: #1976D2; }
        .order-list { margin-top: 20px; }
        .order-item { border: 1px solid #ddd; border-radius: 8px; margin-bottom: 15px; overflow: hidden; }
        .order-header { background: #f5f5f5; padding: 15px; display: flex; justify-content: space-between; align-items: center; }
        .order-number { font-weight: bold; color: #333; }
        .order-date { color: #666; }
        .order-status { padding: 5px 10px; border-radius: 15px; font-size: 12px; font-weight: bold; }
        .status-ordered { background: #fff3cd; color: #856404; }
        .status-shipping { background: #d1ecf1; color: #0c5460; }
        .status-delivered { background: #d4edda; color: #155724; }
        .status-completed { background: #cce5ff; color: #004085; }
        .order-details { padding: 15px; }
        .product-info { display: flex; gap: 15px; margin-bottom: 15px; }
        .product-image { width: 80px; height: 80px; background: #f0f0f0; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #999; }
        .product-details { flex: 1; }
        .product-name { font-weight: bold; margin-bottom: 5px; }
        .product-price { color: #e74c3c; font-weight: bold; }
        .order-summary { background: #f9f9f9; padding: 15px; border-radius: 4px; margin-top: 15px; }
        .summary-row { display: flex; justify-content: space-between; margin-bottom: 5px; }
        .total { font-weight: bold; font-size: 18px; color: #e74c3c; }
        .action-buttons { margin-top: 15px; display: flex; gap: 10px; }
        .no-orders { text-align: center; padding: 40px; color: #666; }
        .back-link { margin-top: 20px; text-align: center; }
        .back-link a { color: #4CAF50; text-decoration: none; }
        .back-link a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>주문/배송</h1>
            <p>주문 내역과 배송 현황을 확인하세요</p>
        </div>

        <div class="filter-section">
            <form class="filter-form" method="GET">
                <div class="filter-group">
                    <label>주문 상태</label>
                    <select name="orderStatus">
                        <option value="">전체</option>
                        <option value="주문완료" ${param.orderStatus == '주문완료' ? 'selected' : ''}>주문완료</option>
                        <option value="배송중" ${param.orderStatus == '배송중' ? 'selected' : ''}>배송중</option>
                        <option value="배송완료" ${param.orderStatus == '배송완료' ? 'selected' : ''}>배송완료</option>
                        <option value="구매확정" ${param.orderStatus == '구매확정' ? 'selected' : ''}>구매확정</option>
                    </select>
                </div>
                <button type="submit" class="btn btn-primary">필터링</button>
                <a href="/mypage/buyer/${userId}/orders" class="btn btn-secondary">초기화</a>
            </form>
        </div>

        <div class="order-list">
            <c:choose>
                <c:when test="${empty orders}">
                    <div class="no-orders">
                        <h3>주문 내역이 없습니다</h3>
                        <p>아직 주문한 상품이 없습니다.</p>
                    </div>
                </c:when>
                <c:otherwise>
                    <c:forEach var="order" items="${orders}">
                        <div class="order-item">
                            <div class="order-header">
                                <div>
                                    <span class="order-number">주문번호: ${order.saleOrderId}</span>
                                    <span class="order-date">주문일: <fmt:formatDate value="${order.orderDate}" pattern="yyyy-MM-dd HH:mm"/></span>
                                </div>
                                <span class="order-status status-${order.orderStatus == '주문완료' ? 'ordered' : 
                                                                      order.orderStatus == '배송중' ? 'shipping' : 
                                                                      order.orderStatus == '배송완료' ? 'delivered' : 'completed'}">
                                    ${order.orderStatus}
                                </span>
                            </div>
                            
                            <div class="order-details">
                                <div class="product-info">
                                    <div class="product-image">📦</div>
                                    <div class="product-details">
                                        <div class="product-name">${order.productName}</div>
                                        <div class="product-price">${order.totalAmount}원</div>
                                        <div>수량: ${order.quantity}개</div>
                                    </div>
                                </div>
                                
                                <div class="order-summary">
                                    <div class="summary-row">
                                        <span>상품 금액:</span>
                                        <span>${order.productPrice * order.quantity}원</span>
                                    </div>
                                    <div class="summary-row">
                                        <span>배송비:</span>
                                        <span>${order.deliveryFee}원</span>
                                    </div>
                                    <div class="summary-row total">
                                        <span>총 결제 금액:</span>
                                        <span>${order.totalAmount}원</span>
                                    </div>
                                </div>
                                
                                <div class="action-buttons">
                                    <c:if test="${order.orderStatus == '배송완료'}">
                                        <button class="btn btn-success" onclick="confirmOrder(${order.saleOrderId})">
                                            구매확정
                                        </button>
                                    </c:if>
                                    <c:if test="${order.orderStatus == '구매확정'}">
                                        <button class="btn btn-primary" onclick="writeReview(${order.saleOrderId})">
                                            리뷰 작성
                                        </button>
                                    </c:if>
                                </div>
                            </div>
                        </div>
                    </c:forEach>
                </c:otherwise>
            </c:choose>
        </div>

        <div class="back-link">
            <a href="/mypage/buyer/${userId}">← 마이페이지로 돌아가기</a>
        </div>
    </div>

    <script>
        function confirmOrder(orderId) {
            if (confirm('구매를 확정하시겠습니까? 구매확정 후에는 취소할 수 없습니다.')) {
                fetch(`/api/mypage/orders/${orderId}/confirm`, {
                    method: 'PUT'
                })
                .then(response => response.json())
                .then(result => {
                    if (result) {
                        alert('구매확정이 완료되었습니다.');
                        location.reload();
                    } else {
                        alert('구매확정에 실패했습니다. 다시 시도해주세요.');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('오류가 발생했습니다. 다시 시도해주세요.');
                });
            }
        }

        function writeReview(orderId) {
            window.location.href = `/mypage/buyer/${userId}/reviews?orderId=${orderId}`;
        }
    </script>
</body>
</html>

