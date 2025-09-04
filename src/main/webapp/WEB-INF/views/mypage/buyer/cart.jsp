<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>장바구니</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #4CAF50; }
        .cart-summary { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
        .summary-info { display: flex; gap: 30px; }
        .summary-item { text-align: center; }
        .summary-label { font-size: 14px; color: #666; margin-bottom: 5px; }
        .summary-value { font-size: 24px; font-weight: bold; color: #4CAF50; }
        .cart-actions { display: flex; gap: 15px; }
        .btn { padding: 12px 24px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; text-decoration: none; display: inline-block; text-align: center; }
        .btn-primary { background: #4CAF50; color: white; }
        .btn-primary:hover { background: #45a049; }
        .btn-secondary { background: #666; color: white; }
        .btn-secondary:hover { background: #555; }
        .btn-danger { background: #f44336; color: white; }
        .btn-danger:hover { background: #d32f2f; }
        .btn-warning { background: #ff9800; color: white; }
        .btn-warning:hover { background: #f57c00; }
        .cart-list { margin-bottom: 30px; }
        .cart-item { border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin-bottom: 15px; display: flex; align-items: center; gap: 20px; }
        .item-checkbox { width: 20px; height: 20px; cursor: pointer; }
        .item-image { width: 80px; height: 80px; background: #f0f0f0; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #999; }
        .item-details { flex: 1; }
        .item-name { font-size: 18px; font-weight: bold; margin-bottom: 5px; color: #333; }
        .item-price { font-size: 16px; color: #e74c3c; font-weight: bold; margin-bottom: 5px; }
        .item-seller { color: #666; font-size: 14px; margin-bottom: 10px; }
        .quantity-controls { display: flex; align-items: center; gap: 10px; }
        .quantity-btn { width: 30px; height: 30px; border: 1px solid #ddd; background: white; cursor: pointer; border-radius: 4px; }
        .quantity-btn:hover { background: #f5f5f5; }
        .quantity-input { width: 50px; text-align: center; padding: 5px; border: 1px solid #ddd; border-radius: 4px; }
        .item-total { font-size: 18px; font-weight: bold; color: #e74c3c; text-align: right; min-width: 120px; }
        .item-actions { display: flex; flex-direction: column; gap: 10px; }
        .no-cart { text-align: center; padding: 60px; color: #666; }
        .no-cart h3 { margin-bottom: 15px; }
        .back-link { margin-top: 20px; text-align: center; }
        .back-link a { color: #4CAF50; text-decoration: none; }
        .back-link a:hover { text-decoration: underline; }
        .payment-modal { display: none; position: fixed; z-index: 1000; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); }
        .payment-content { background-color: white; margin: 5% auto; padding: 30px; border-radius: 8px; width: 80%; max-width: 600px; }
        .payment-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .close { font-size: 28px; font-weight: bold; cursor: pointer; color: #aaa; }
        .close:hover { color: #000; }
        .payment-details { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .payment-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
        .payment-total { font-size: 20px; font-weight: bold; color: #e74c3c; border-top: 2px solid #ddd; padding-top: 10px; margin-top: 10px; }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; margin-bottom: 5px; font-weight: bold; }
        .form-group input, .form-group select { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px; box-sizing: border-box; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>장바구니</h1>
            <p>담은 상품을 확인하고 결제하세요</p>
        </div>

        <c:choose>
            <c:when test="${empty cartItems}">
                <div class="no-cart">
                    <h3>장바구니가 비어있습니다</h3>
                    <p>상품을 장바구니에 담아보세요!</p>
                    <a href="/" class="btn btn-primary">쇼핑하러 가기</a>
                </div>
            </c:when>
            <c:otherwise>
                <!-- 장바구니 요약 -->
                <div class="cart-summary">
                    <div class="summary-info">
                        <div class="summary-item">
                            <div class="summary-label">총 상품 수</div>
                            <div class="summary-value" id="totalItems">0</div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-label">선택된 상품</div>
                            <div class="summary-value" id="selectedItems">0</div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-label">총 결제 금액</div>
                            <div class="summary-value" id="totalAmount">0원</div>
                        </div>
                    </div>
                    <div class="cart-actions">
                        <button class="btn btn-warning" onclick="selectAll()">전체 선택</button>
                        <button class="btn btn-secondary" onclick="deselectAll()">전체 해제</button>
                        <button class="btn btn-primary" onclick="showPaymentModal()" id="paymentBtn" disabled>
                            선택 상품 결제
                        </button>
                    </div>
                </div>

                <!-- 장바구니 상품 목록 -->
                <div class="cart-list">
                    <c:forEach var="item" items="${cartItems}">
                        <div class="cart-item" data-item-id="${item.saleItemId}" data-price="${item.productPrice}">
                            <input type="checkbox" class="item-checkbox" onchange="updateSummary()">
                            <div class="item-image">📦</div>
                            <div class="item-details">
                                <div class="item-name">${item.productName}</div>
                                <div class="item-price">${item.productPrice}원</div>
                                <div class="item-seller">판매자: ${item.sellerName}</div>
                                <div class="quantity-controls">
                                    <button class="quantity-btn" onclick="changeQuantity(${item.saleItemId}, -1)">-</button>
                                    <input type="number" class="quantity-input" value="${item.quantity}" min="1" 
                                           onchange="updateQuantity(${item.saleItemId}, this.value)">
                                    <button class="quantity-btn" onclick="changeQuantity(${item.saleItemId}, 1)">+</button>
                                </div>
                            </div>
                            <div class="item-total" id="total-${item.saleItemId}">
                                ${item.productPrice * item.quantity}원
                            </div>
                            <div class="item-actions">
                                <button class="btn btn-danger" onclick="removeFromCart('${item.userId}', ${item.saleItemId})">
                                    삭제
                                </button>
                            </div>
                        </div>
                    </c:forEach>
                </div>
            </c:otherwise>
        </c:choose>

        <div class="back-link">
            <a href="/mypage/buyer/${userId}">← 마이페이지로 돌아가기</a>
        </div>
    </div>

    <!-- 결제 모달 -->
    <div id="paymentModal" class="payment-modal">
        <div class="payment-content">
            <div class="payment-header">
                <h3>결제하기</h3>
                <span class="close" onclick="closePaymentModal()">&times;</span>
            </div>
            
            <div class="payment-details" id="paymentDetails">
                <!-- 결제 상세 정보가 여기에 동적으로 추가됩니다 -->
            </div>
            
            <form id="paymentForm">
                <div class="form-group">
                    <label>결제 수단</label>
                    <select name="paymentMethod" required>
                        <option value="">결제 수단을 선택하세요</option>
                        <option value="card">신용카드</option>
                        <option value="bank">계좌이체</option>
                        <option value="phone">휴대폰 결제</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label>배송 주소</label>
                    <input type="text" name="deliveryAddress" value="${userInfo.user.address}" required>
                </div>
                
                <div class="form-group">
                    <label>연락처</label>
                    <input type="tel" name="phone" value="${userInfo.user.tel}" required>
                </div>
                
                <div style="text-align: right;">
                    <button type="button" class="btn btn-secondary" onclick="closePaymentModal()">취소</button>
                    <button type="submit" class="btn btn-primary">결제 진행</button>
                </div>
            </form>
        </div>
    </div>

    <script>
        let selectedItems = new Set();
        let cartItems = new Map();

        // 페이지 로드 시 장바구니 아이템 초기화
        document.addEventListener('DOMContentLoaded', function() {
            <c:forEach var="item" items="${cartItems}">
                cartItems.set(${item.saleItemId}, {
                    id: ${item.saleItemId},
                    name: '${item.productName}',
                    price: ${item.productPrice},
                    quantity: ${item.quantity},
                    seller: '${item.sellerName}'
                });
            </c:forEach>
            updateSummary();
        });

        // 수량 변경
        function changeQuantity(itemId, change) {
            const item = cartItems.get(itemId);
            if (item) {
                const newQuantity = Math.max(1, item.quantity + change);
                updateQuantity(itemId, newQuantity);
            }
        }

        // 수량 업데이트
        function updateQuantity(itemId, newQuantity) {
            const item = cartItems.get(itemId);
            if (item && newQuantity > 0) {
                item.quantity = parseInt(newQuantity);
                
                // UI 업데이트
                const quantityInput = document.querySelector(`[data-item-id="${itemId}"] .quantity-input`);
                if (quantityInput) {
                    quantityInput.value = newQuantity;
                }
                
                // 총액 업데이트
                const totalElement = document.getElementById(`total-${itemId}`);
                if (totalElement) {
                    totalElement.textContent = (item.price * item.quantity).toLocaleString() + '원';
                }
                
                // 서버에 수량 업데이트
                fetch(`/api/mypage/cart/${itemId}/quantity`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userId: '${userId}',
                        saleItemId: itemId,
                        quantity: newQuantity
                    })
                })
                .then(response => response.json())
                .then(result => {
                    if (!result) {
                        alert('수량 업데이트에 실패했습니다.');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('수량 업데이트 중 오류가 발생했습니다.');
                });
                
                updateSummary();
            }
        }

        // 장바구니에서 상품 제거
        function removeFromCart(userId, saleItemId) {
            if (confirm('정말로 이 상품을 장바구니에서 제거하시겠습니까?')) {
                fetch(`/api/mypage/cart/${userId}/${saleItemId}`, {
                    method: 'DELETE'
                })
                .then(response => response.json())
                .then(result => {
                    if (result) {
                        // UI에서 제거
                        const cartItem = document.querySelector(`[data-item-id="${saleItemId}"]`);
                        if (cartItem) {
                            cartItem.remove();
                        }
                        
                        // 데이터에서 제거
                        cartItems.delete(saleItemId);
                        selectedItems.delete(saleItemId);
                        
                        updateSummary();
                        
                        // 장바구니가 비었는지 확인
                        if (cartItems.size === 0) {
                            location.reload();
                        }
                    } else {
                        alert('상품 제거에 실패했습니다.');
                    }
                })
                catch(error => {
                    console.error('Error:', error);
                    alert('상품 제거 중 오류가 발생했습니다.');
                });
            }
        }

        // 전체 선택
        function selectAll() {
            document.querySelectorAll('.item-checkbox').forEach(checkbox => {
                checkbox.checked = true;
                selectedItems.add(parseInt(checkbox.closest('.cart-item').dataset.itemId));
            });
            updateSummary();
        }

        // 전체 해제
        function deselectAll() {
            document.querySelectorAll('.item-checkbox').forEach(checkbox => {
                checkbox.checked = false;
            });
            selectedItems.clear();
            updateSummary();
        }

        // 요약 정보 업데이트
        function updateSummary() {
            selectedItems.clear();
            let totalItems = 0;
            let selectedCount = 0;
            let totalAmount = 0;
            
            document.querySelectorAll('.item-checkbox').forEach(checkbox => {
                const cartItem = checkbox.closest('.cart-item');
                const itemId = parseInt(cartItem.dataset.itemId);
                const item = cartItems.get(itemId);
                
                if (item) {
                    totalItems += item.quantity;
                    if (checkbox.checked) {
                        selectedItems.add(itemId);
                        selectedCount += item.quantity;
                        totalAmount += item.price * item.quantity;
                    }
                }
            });
            
            document.getElementById('totalItems').textContent = totalItems;
            document.getElementById('selectedItems').textContent = selectedCount;
            document.getElementById('totalAmount').textContent = totalAmount.toLocaleString() + '원';
            
            // 결제 버튼 활성화/비활성화
            const paymentBtn = document.getElementById('paymentBtn');
            if (paymentBtn) {
                paymentBtn.disabled = selectedCount === 0;
            }
        }

        // 결제 모달 표시
        function showPaymentModal() {
            if (selectedItems.size === 0) {
                alert('결제할 상품을 선택해주세요.');
                return;
            }
            
            // 결제 상세 정보 생성
            let paymentHTML = '<h4>결제 상품</h4>';
            let totalAmount = 0;
            
            selectedItems.forEach(itemId => {
                const item = cartItems.get(itemId);
                if (item) {
                    const itemTotal = item.price * item.quantity;
                    totalAmount += itemTotal;
                    paymentHTML += `
                        <div class="payment-row">
                            <span>${item.name} x ${item.quantity}개</span>
                            <span>${itemTotal.toLocaleString()}원</span>
                        </div>
                    `;
                }
            });
            
            paymentHTML += `
                <div class="payment-row">
                    <span>배송비</span>
                    <span>3,000원</span>
                </div>
                <div class="payment-row payment-total">
                    <span>총 결제 금액</span>
                    <span>${(totalAmount + 3000).toLocaleString()}원</span>
                </div>
            `;
            
            document.getElementById('paymentDetails').innerHTML = paymentHTML;
            document.getElementById('paymentModal').style.display = 'block';
        }

        // 결제 모달 닫기
        function closePaymentModal() {
            document.getElementById('paymentModal').style.display = 'none';
        }

        // 결제 폼 제출
        document.getElementById('paymentForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const paymentData = {
                items: Array.from(selectedItems),
                paymentMethod: formData.get('paymentMethod'),
                deliveryAddress: formData.get('deliveryAddress'),
                phone: formData.get('phone'),
                buyerId: '${userId}',
                totalAmount: calculateTotalAmount()
            };
            
            // 실제 결제 API 호출
            fetch('/api/payment/cart', {
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
                    closePaymentModal();
                    location.reload();
                } else {
                    alert('결제에 실패했습니다: ' + result.message);
                }
            })
            .catch(error => {
                console.error('Payment Error:', error);
                alert('결제 시스템에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.');
                
                // 테스트 모드: 결제 완료 처리
                if (confirm('테스트 모드: 결제를 완료된 것으로 처리하시겠습니까?')) {
                    alert('테스트 결제가 완료되었습니다!');
                    closePaymentModal();
                    location.reload();
                }
            });
        });

        // 총 결제 금액 계산
        function calculateTotalAmount() {
            let total = 0;
            selectedItems.forEach(itemId => {
                const item = cartItems.get(itemId);
                if (item) {
                    total += item.price * item.quantity;
                }
            });
            return total + 3000; // 배송비 포함
        }

        // 모달 외부 클릭시 닫기
        window.onclick = function(event) {
            const modal = document.getElementById('paymentModal');
            if (event.target == modal) {
                closePaymentModal();
            }
        }
    </script>
</body>
</html>

