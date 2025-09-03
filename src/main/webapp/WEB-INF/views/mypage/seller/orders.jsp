<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8" />
    <title>주문/배송 관리</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #4CAF50; }
        .header h1 { color: #2E7D32; margin: 0; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-bottom: 30px; }
        .stat-item { background: #4CAF50; color: white; padding: 20px; border-radius: 8px; text-align: center; }
        .stat-number { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
        .stat-label { font-size: 14px; opacity: 0.9; }
        .filter-section { background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
        .filter-form { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; align-items: end; }
        .form-group { display: flex; flex-direction: column; }
        .form-group label { font-weight: bold; margin-bottom: 5px; color: #555; }
        .form-group input, .form-group select { padding: 10px; border: 1px solid #ddd; border-radius: 5px; font-size: 14px; }
        .filter-btn { background: #4CAF50; color: white; padding: 12px 24px; border: none; border-radius: 5px; cursor: pointer; font-size: 14px; }
        .filter-btn:hover { background: #45a049; }
        .orders-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        .orders-table th, .orders-table td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        .orders-table th { background-color: #f2f2f2; font-weight: bold; color: #555; }
        .orders-table tr:hover { background-color: #f5f5f5; }
        .status-pending { color: #FF9800; font-weight: bold; }
        .status-confirmed { color: #2196F3; font-weight: bold; }
        .status-shipping { color: #9C27B0; font-weight: bold; }
        .status-delivered { color: #4CAF50; font-weight: bold; }
        .status-cancelled { color: #f44336; font-weight: bold; }
        .action-btn { padding: 6px 12px; margin: 2px; border: none; border-radius: 3px; cursor: pointer; text-decoration: none; font-size: 12px; }
        .confirm-btn { background: #2196F3; color: white; }
        .confirm-btn:hover { background: #1976D2; }
        .ship-btn { background: #9C27B0; color: white; }
        .ship-btn:hover { background: #7B1FA2; }
        .deliver-btn { background: #4CAF50; color: white; }
        .deliver-btn:hover { background: #45a049; }
        .back-btn { background: #666; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px; }
        .back-btn:hover { background: #555; }
        .no-orders { text-align: center; padding: 40px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📋 주문/배송 관리</h1>
            <p>주문 현황과 배송 상태를 관리하세요</p>
        </div>

        <div class="stats">
            <div class="stat-item">
                <div class="stat-number">${orderStats.pendingCount}</div>
                <div class="stat-label">대기 주문</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">${orderStats.confirmedCount}</div>
                <div class="stat-label">확인 주문</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">${orderStats.shippingCount}</div>
                <div class="stat-label">배송 중</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">${orderStats.deliveredCount}</div>
                <div class="stat-label">배송 완료</div>
            </div>
        </div>

        <div class="filter-section">
            <h3>🔍 주문 검색</h3>
            <form class="filter-form" id="filterForm">
                <div class="form-group">
                    <label for="orderStatus">주문 상태</label>
                    <select id="orderStatus" name="orderStatus">
                        <option value="">전체</option>
                        <option value="PENDING">대기</option>
                        <option value="CONFIRMED">확인</option>
                        <option value="SHIPPING">배송 중</option>
                        <option value="DELIVERED">배송 완료</option>
                        <option value="CANCELLED">취소</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="startDate">시작일</label>
                    <input type="date" id="startDate" name="startDate">
                </div>
                <div class="form-group">
                    <label for="endDate">종료일</label>
                    <input type="date" id="endDate" name="endDate">
                </div>
                <div class="form-group">
                    <button type="submit" class="filter-btn">검색</button>
                </div>
            </form>
        </div>

        <div id="ordersContainer">
            <c:choose>
                <c:when test="${not empty orders}">
                    <table class="orders-table">
                        <thead>
                            <tr>
                                <th>주문번호</th>
                                <th>주문일</th>
                                <th>구매자</th>
                                <th>상품명</th>
                                <th>수량</th>
                                <th>주문금액</th>
                                <th>주문상태</th>
                                <th>배송지</th>
                                <th>관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            <c:forEach var="order" items="${orders}">
                                <tr>
                                    <td>${order.ORDER_ID}</td>
                                    <td>${order.ORDER_DATE}</td>
                                    <td>${order.BUYER_NAME}</td>
                                    <td>${order.PRODUCT_NAME}</td>
                                    <td>${order.QUANTITY}개</td>
                                    <td>${order.TOTAL_AMOUNT}원</td>
                                    <td>
                                        <span class="status-${order.ORDER_STATUS.toLowerCase()}">
                                            ${order.ORDER_STATUS_TEXT}
                                        </span>
                                    </td>
                                    <td>${order.DELIVERY_ADDRESS}</td>
                                    <td>
                                        <c:choose>
                                            <c:when test="${order.ORDER_STATUS == 'PENDING'}">
                                                <button onclick="confirmOrder('${order.ORDER_ID}')" class="action-btn confirm-btn">주문확인</button>
                                            </c:when>
                                            <c:when test="${order.ORDER_STATUS == 'CONFIRMED'}">
                                                <button onclick="startShipping('${order.ORDER_ID}')" class="action-btn ship-btn">배송시작</button>
                                            </c:when>
                                            <c:when test="${order.ORDER_STATUS == 'SHIPPING'}">
                                                <button onclick="completeDelivery('${order.ORDER_ID}')" class="action-btn deliver-btn">배송완료</button>
                                            </c:when>
                                        </c:choose>
                                    </td>
                                </tr>
                            </c:forEach>
                        </tbody>
                    </table>
                </c:when>
                <c:otherwise>
                    <div class="no-orders">
                        <h3>주문 내역이 없습니다</h3>
                        <p>아직 주문이 들어오지 않았습니다.</p>
                    </div>
                </c:otherwise>
            </c:choose>
        </div>

        <a href="${pageContext.request.contextPath}/mypage/seller/${userId}" class="back-btn">← 마이페이지로 돌아가기</a>
    </div>

    <script>
        // 필터 폼 제출 처리
        document.getElementById('filterForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const orderStatus = document.getElementById('orderStatus').value;
            const startDate = document.getElementById('startDate').value;
            const endDate = document.getElementById('endDate').value;
            
            // API 호출하여 주문 검색
            searchOrders(orderStatus, startDate, endDate);
        });

        // 주문 검색 함수
        function searchOrders(orderStatus, startDate, endDate) {
            const url = `/api/mypage/seller/${userId}/orders?orderStatus=${encodeURIComponent(orderStatus)}&startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`;
            
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    updateOrdersTable(data);
                })
                .catch(error => {
                    console.error('주문 검색 오류:', error);
                    alert('주문 검색 중 오류가 발생했습니다.');
                });
        }

        // 주문 테이블 업데이트
        function updateOrdersTable(orders) {
            const container = document.getElementById('ordersContainer');
            
            if (orders && orders.length > 0) {
                let tableHTML = `
                    <table class="orders-table">
                        <thead>
                            <tr>
                                <th>주문번호</th>
                                <th>주문일</th>
                                <th>구매자</th>
                                <th>상품명</th>
                                <th>수량</th>
                                <th>주문금액</th>
                                <th>주문상태</th>
                                <th>배송지</th>
                                <th>관리</th>
                            </tr>
                        </thead>
                        <tbody>
                `;
                
                orders.forEach(order => {
                    const statusClass = getStatusClass(order.ORDER_STATUS);
                    const statusText = getStatusText(order.ORDER_STATUS);
                    const actionButtons = getActionButtons(order.ORDER_STATUS, order.ORDER_ID);
                    
                    tableHTML += `
                        <tr>
                            <td>${order.ORDER_ID}</td>
                            <td>${order.ORDER_DATE}</td>
                            <td>${order.BUYER_NAME}</td>
                            <td>${order.PRODUCT_NAME}</td>
                            <td>${order.QUANTITY}개</td>
                            <td>${order.TOTAL_AMOUNT}원</td>
                            <td>
                                <span class="status-${statusClass}">
                                    ${statusText}
                                </span>
                            </td>
                            <td>${order.DELIVERY_ADDRESS}</td>
                            <td>${actionButtons}</td>
                        </tr>
                    `;
                });
                
                tableHTML += '</tbody></table>';
                container.innerHTML = tableHTML;
            } else {
                container.innerHTML = `
                    <div class="no-orders">
                        <h3>검색 결과가 없습니다</h3>
                        <p>다른 검색 조건을 시도해보세요.</p>
                    </div>
                `;
            }
        }

        // 상태별 CSS 클래스 반환
        function getStatusClass(status) {
            const statusMap = {
                'PENDING': 'pending',
                'CONFIRMED': 'confirmed',
                'SHIPPING': 'shipping',
                'DELIVERED': 'delivered',
                'CANCELLED': 'cancelled'
            };
            return statusMap[status] || 'pending';
        }

        // 상태별 텍스트 반환
        function getStatusText(status) {
            const statusMap = {
                'PENDING': '대기',
                'CONFIRMED': '확인',
                'SHIPPING': '배송 중',
                'DELIVERED': '배송 완료',
                'CANCELLED': '취소'
            };
            return statusMap[status] || '대기';
        }

        // 상태별 액션 버튼 반환
        function getActionButtons(status, orderId) {
            switch(status) {
                case 'PENDING':
                    return `<button onclick="confirmOrder('${orderId}')" class="action-btn confirm-btn">주문확인</button>`;
                case 'CONFIRMED':
                    return `<button onclick="startShipping('${orderId}')" class="action-btn ship-btn">배송시작</button>`;
                case 'SHIPPING':
                    return `<button onclick="completeDelivery('${orderId}')" class="action-btn deliver-btn">배송완료</button>`;;
                default:
                    return '';
            }
        }

        // 주문 확인
        function confirmOrder(orderId) {
            if (confirm('이 주문을 확인하시겠습니까?')) {
                updateOrderStatus(orderId, 'CONFIRMED');
            }
        }

        // 배송 시작
        function startShipping(orderId) {
            if (confirm('배송을 시작하시겠습니까?')) {
                updateOrderStatus(orderId, 'SHIPPING');
            }
        }

        // 배송 완료
        function completeDelivery(orderId) {
            if (confirm('배송을 완료하시겠습니까?')) {
                updateOrderStatus(orderId, 'DELIVERED');
            }
        }

        // 주문 상태 업데이트
        function updateOrderStatus(orderId, newStatus) {
            fetch(`/api/mypage/seller/${userId}/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            })
            .then(response => {
                if (response.ok) {
                    alert('주문 상태가 업데이트되었습니다.');
                    location.reload();
                } else {
                    alert('주문 상태 업데이트에 실패했습니다.');
                }
            })
            .catch(error => {
                console.error('주문 상태 업데이트 오류:', error);
                alert('주문 상태 업데이트 중 오류가 발생했습니다.');
            });
        }
    </script>
</body>
</html>

