<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8" />
    <title>등록 상품 목록</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #4CAF50; }
        .header h1 { color: #2E7D32; margin: 0; }
        .search-section { background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
        .search-form { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; align-items: end; }
        .form-group { display: flex; flex-direction: column; }
        .form-group label { font-weight: bold; margin-bottom: 5px; color: #555; }
        .form-group input, .form-group select { padding: 10px; border: 1px solid #ddd; border-radius: 5px; font-size: 14px; }
        .search-btn { background: #4CAF50; color: white; padding: 12px 24px; border: none; border-radius: 5px; cursor: pointer; font-size: 14px; }
        .search-btn:hover { background: #45a049; }
        .add-product-btn { background: #2196F3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin-bottom: 20px; }
        .add-product-btn:hover { background: #1976D2; }
        .products-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        .products-table th, .products-table td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        .products-table th { background-color: #f2f2f2; font-weight: bold; color: #555; }
        .products-table tr:hover { background-color: #f5f5f5; }
        .status-active { color: #4CAF50; font-weight: bold; }
        .status-inactive { color: #f44336; font-weight: bold; }
        .action-btn { padding: 6px 12px; margin: 2px; border: none; border-radius: 3px; cursor: pointer; text-decoration: none; font-size: 12px; }
        .edit-btn { background: #FF9800; color: white; }
        .edit-btn:hover { background: #F57C00; }
        .delete-btn { background: #f44336; color: white; }
        .delete-btn:hover { background: #d32f2f; }
        .back-btn { background: #666; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px; }
        .back-btn:hover { background: #555; }
        .no-products { text-align: center; padding: 40px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📦 등록 상품 목록</h1>
            <p>현재 등록된 상품들을 확인하고 관리하세요</p>
        </div>

        <a href="${pageContext.request.contextPath}/mypage/seller/${userId}/product-register" class="add-product-btn">➕ 새 상품 등록</a>

        <div class="search-section">
            <h3>🔍 상품 검색</h3>
            <form class="search-form" id="searchForm">
                <div class="form-group">
                    <label for="productName">상품명</label>
                    <input type="text" id="productName" name="productName" placeholder="상품명을 입력하세요">
                </div>
                <div class="form-group">
                    <label for="productType">상품 유형</label>
                    <select id="productType" name="productType">
                        <option value="">전체</option>
                        <option value="VEGETABLE">채소</option>
                        <option value="FRUIT">과일</option>
                        <option value="GRAIN">곡물</option>
                        <option value="MEAT">육류</option>
                        <option value="DAIRY">유제품</option>
                        <option value="OTHER">기타</option>
                    </select>
                </div>
                <div class="form-group">
                    <button type="submit" class="search-btn">검색</button>
                </div>
            </form>
        </div>

        <div id="productsContainer">
            <c:choose>
                <c:when test="${not empty products}">
                    <table class="products-table">
                        <thead>
                            <tr>
                                <th>상품명</th>
                                <th>상품 유형</th>
                                <th>가격</th>
                                <th>재고</th>
                                <th>상태</th>
                                <th>등록일</th>
                                <th>관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            <c:forEach var="product" items="${products}">
                                <tr>
                                    <td>${product.PRODUCT_NAME}</td>
                                    <td>${product.PRODUCT_TYPE}</td>
                                    <td>${product.PRICE}원</td>
                                    <td>${product.STOCK_QUANTITY}개</td>
                                    <td>
                                        <span class="status-${product.STATUS == 'ACTIVE' ? 'active' : 'inactive'}">
                                            ${product.STATUS == 'ACTIVE' ? '활성' : '비활성'}
                                        </span>
                                    </td>
                                    <td>${product.CREATED_TIME}</td>
                                    <td>
                                        <a href="${pageContext.request.contextPath}/mypage/seller/${userId}/products/${product.PRODUCT_ID}/edit" class="action-btn edit-btn">수정</a>
                                        <button onclick="deleteProduct('${product.PRODUCT_ID}')" class="action-btn delete-btn">삭제</button>
                                    </td>
                                </tr>
                            </c:forEach>
                        </tbody>
                    </table>
                </c:when>
                <c:otherwise>
                    <div class="no-products">
                        <h3>등록된 상품이 없습니다</h3>
                        <p>새로운 상품을 등록해보세요!</p>
                    </div>
                </c:otherwise>
            </c:choose>
        </div>

        <a href="${pageContext.request.contextPath}/mypage/seller/${userId}" class="back-btn">← 마이페이지로 돌아가기</a>
    </div>

    <script>
        // 검색 폼 제출 처리
        document.getElementById('searchForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const productName = document.getElementById('productName').value;
            const productType = document.getElementById('productType').value;
            
            // API 호출하여 상품 검색
            searchProducts(productName, productType);
        });

        // 상품 검색 함수
        function searchProducts(productName, productType) {
            const url = `/api/mypage/seller/${userId}/products?productName=${encodeURIComponent(productName)}&productType=${encodeURIComponent(productType)}`;
            
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    updateProductsTable(data);
                })
                .catch(error => {
                    console.error('상품 검색 오류:', error);
                    alert('상품 검색 중 오류가 발생했습니다.');
                });
        }

        // 상품 테이블 업데이트
        function updateProductsTable(products) {
            const container = document.getElementById('productsContainer');
            
            if (products && products.length > 0) {
                let tableHTML = `
                    <table class="products-table">
                        <thead>
                            <tr>
                                <th>상품명</th>
                                <th>상품 유형</th>
                                <th>가격</th>
                                <th>재고</th>
                                <th>상태</th>
                                <th>등록일</th>
                                <th>관리</th>
                            </tr>
                        </thead>
                        <tbody>
                `;
                
                products.forEach(product => {
                    tableHTML += `
                        <tr>
                            <td>${product.PRODUCT_NAME}</td>
                            <td>${product.PRODUCT_TYPE}</td>
                            <td>${product.PRICE}원</td>
                            <td>${product.STOCK_QUANTITY}개</td>
                            <td>
                                <span class="status-${product.STATUS === 'ACTIVE' ? 'active' : 'inactive'}">
                                    ${product.STATUS === 'ACTIVE' ? '활성' : '비활성'}
                                </span>
                            </td>
                            <td>${product.CREATED_TIME}</td>
                            <td>
                                <a href="${pageContext.request.contextPath}/mypage/seller/${userId}/products/${product.PRODUCT_ID}/edit" class="action-btn edit-btn">수정</a>
                                <button onclick="deleteProduct('${product.PRODUCT_ID}')" class="action-btn delete-btn">삭제</button>
                            </td>
                        </tr>
                    `;
                });
                
                tableHTML += '</tbody></table>';
                container.innerHTML = tableHTML;
            } else {
                container.innerHTML = `
                    <div class="no-products">
                        <h3>검색 결과가 없습니다</h3>
                        <p>다른 검색 조건을 시도해보세요.</p>
                    </div>
                `;
            }
        }

        // 상품 삭제 함수
        function deleteProduct(productId) {
            if (confirm('정말로 이 상품을 삭제하시겠습니까?')) {
                fetch(`/api/mypage/seller/${userId}/products/${productId}`, {
                    method: 'DELETE'
                })
                .then(response => {
                    if (response.ok) {
                        alert('상품이 삭제되었습니다.');
                        location.reload();
                    } else {
                        alert('상품 삭제에 실패했습니다.');
                    }
                })
                .catch(error => {
                    console.error('상품 삭제 오류:', error);
                    alert('상품 삭제 중 오류가 발생했습니다.');
                });
            }
        }
    </script>
</body>
</html>

