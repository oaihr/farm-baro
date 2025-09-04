<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8" />
    <title>상품 등록</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #4CAF50; }
        .header h1 { color: #2E7D32; margin: 0; }
        .form-section { background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .form-section h3 { color: #2E7D32; margin-top: 0; }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; font-weight: bold; margin-bottom: 8px; color: #555; }
        .form-group input, .form-group select, .form-group textarea { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 5px; font-size: 14px; box-sizing: border-box; }
        .form-group textarea { height: 100px; resize: vertical; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .required { color: #f44336; }
        .submit-btn { background: #4CAF50; color: white; padding: 15px 30px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; width: 100%; }
        .submit-btn:hover { background: #45a049; }
        .submit-btn:disabled { background: #ccc; cursor: not-allowed; }
        .back-btn { background: #666; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px; }
        .back-btn:hover { background: #555; }
        .file-upload { border: 2px dashed #ddd; padding: 20px; text-align: center; border-radius: 5px; cursor: pointer; transition: border-color 0.3s; }
        .file-upload:hover { border-color: #4CAF50; }
        .file-upload input[type="file"] { display: none; }
        .upload-text { color: #666; }
        .preview-image { max-width: 200px; max-height: 200px; margin-top: 10px; border-radius: 5px; }
        .error-message { color: #f44336; font-size: 14px; margin-top: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>➕ 상품 등록</h1>
            <p>새로운 상품을 등록하여 판매를 시작하세요</p>
        </div>

        <form id="productForm" enctype="multipart/form-data">
            <div class="form-section">
                <h3>📋 기본 정보</h3>
                <div class="form-group">
                    <label for="productName">상품명 <span class="required">*</span></label>
                    <input type="text" id="productName" name="productName" required placeholder="상품명을 입력하세요">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="productType">상품 유형 <span class="required">*</span></label>
                        <select id="productType" name="productType" required>
                            <option value="">상품 유형을 선택하세요</option>
                            <option value="VEGETABLE">채소</option>
                            <option value="FRUIT">과일</option>
                            <option value="GRAIN">곡물</option>
                            <option value="MEAT">육류</option>
                            <option value="DAIRY">유제품</option>
                            <option value="OTHER">기타</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="price">가격 (원) <span class="required">*</span></label>
                        <input type="number" id="price" name="price" required min="0" placeholder="가격을 입력하세요">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="stockQuantity">재고 수량 <span class="required">*</span></label>
                        <input type="number" id="stockQuantity" name="stockQuantity" required min="0" placeholder="재고 수량을 입력하세요">
                    </div>
                    <div class="form-group">
                        <label for="unit">단위</label>
                        <select id="unit" name="unit">
                            <option value="KG">킬로그램 (KG)</option>
                            <option value="G">그램 (G)</option>
                            <option value="EA">개 (EA)</option>
                            <option value="BOX">박스 (BOX)</option>
                            <option value="BAG">봉 (BAG)</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="form-section">
                <h3>📝 상품 설명</h3>
                <div class="form-group">
                    <label for="description">상품 설명</label>
                    <textarea id="description" name="description" placeholder="상품에 대한 자세한 설명을 입력하세요"></textarea>
                </div>
            </div>

            <div class="form-section">
                <h3>🌾 농산물 정보</h3>
                <div class="form-row">
                    <div class="form-group">
                        <label for="harvestDate">수확일</label>
                        <input type="date" id="harvestDate" name="harvestDate">
                    </div>
                    <div class="form-group">
                        <label for="expiryDate">유통기한</label>
                        <input type="date" id="expiryDate" name="expiryDate">
                    </div>
                </div>
                <div class="form-group">
                    <label for="origin">원산지</label>
                    <input type="text" id="origin" name="origin" placeholder="원산지를 입력하세요">
                </div>
            </div>

            <div class="form-section">
                <h3>🖼️ 상품 이미지</h3>
                <div class="form-group">
                    <label for="productImage">상품 이미지</label>
                    <div class="file-upload" onclick="document.getElementById('productImage').click()">
                        <input type="file" id="productImage" name="productImage" accept="image/*" onchange="previewImage(this)">
                        <div class="upload-text">
                            <p>📁 이미지를 클릭하여 업로드하세요</p>
                            <p>JPG, PNG, GIF 파일만 가능합니다</p>
                        </div>
                    </div>
                    <img id="imagePreview" class="preview-image" style="display: none;">
                </div>
            </div>

            <div class="form-section">
                <h3>🚚 배송 정보</h3>
                <div class="form-row">
                    <div class="form-group">
                        <label for="shippingFee">배송비 (원)</label>
                        <input type="number" id="shippingFee" name="shippingFee" min="0" value="0" placeholder="배송비를 입력하세요">
                    </div>
                    <div class="form-group">
                        <label for="minOrderQuantity">최소 주문 수량</label>
                        <input type="number" id="minOrderQuantity" name="minOrderQuantity" min="1" value="1" placeholder="최소 주문 수량을 입력하세요">
                    </div>
                </div>
            </div>

            <button type="submit" class="submit-btn" id="submitBtn">상품 등록하기</button>
        </form>

        <a href="${pageContext.request.contextPath}/mypage/seller/${userId}/products" class="back-btn">← 상품 목록으로 돌아가기</a>
    </div>

    <script>
        // 이미지 미리보기
        function previewImage(input) {
            const preview = document.getElementById('imagePreview');
            const file = input.files[0];
            
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    preview.src = e.target.result;
                    preview.style.display = 'block';
                }
                reader.readAsDataURL(file);
            }
        }

        // 폼 제출 처리
        document.getElementById('productForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = document.getElementById('submitBtn');
            submitBtn.disabled = true;
            submitBtn.textContent = '등록 중...';
            
            const formData = new FormData(this);
            formData.append('sellerId', '${userId}');
            
            // API 호출하여 상품 등록
            fetch('/api/mypage/seller/${userId}/products', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('상품 등록에 실패했습니다.');
                }
            })
            .then(data => {
                alert('상품이 성공적으로 등록되었습니다!');
                window.location.href = '${pageContext.request.contextPath}/mypage/seller/${userId}/products';
            })
            .catch(error => {
                console.error('상품 등록 오류:', error);
                alert('상품 등록 중 오류가 발생했습니다: ' + error.message);
                submitBtn.disabled = false;
                submitBtn.textContent = '상품 등록하기';
            });
        });

        // 필수 필드 검증
        document.querySelectorAll('[required]').forEach(field => {
            field.addEventListener('blur', function() {
                if (!this.value.trim()) {
                    this.style.borderColor = '#f44336';
                    showError(this, '이 필드는 필수입니다.');
                } else {
                    this.style.borderColor = '#ddd';
                    hideError(this);
                }
            });
        });

        function showError(field, message) {
            let errorDiv = field.parentNode.querySelector('.error-message');
            if (!errorDiv) {
                errorDiv = document.createElement('div');
                errorDiv.className = 'error-message';
                field.parentNode.appendChild(errorDiv);
            }
            errorDiv.textContent = message;
        }

        function hideError(field) {
            const errorDiv = field.parentNode.querySelector('.error-message');
            if (errorDiv) {
                errorDiv.remove();
            }
        }
    </script>
</body>
</html>

