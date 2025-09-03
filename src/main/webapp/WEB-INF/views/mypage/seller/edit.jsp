<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8" />
    <title>개인정보 수정</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #4CAF50; }
        .header h1 { color: #2E7D32; margin: 0; }
        .form-section { background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .form-section h3 { color: #2E7D32; margin-top: 0; }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; font-weight: bold; margin-bottom: 8px; color: #555; }
        .form-group input, .form-group select { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 5px; font-size: 14px; box-sizing: border-box; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .required { color: #f44336; }
        .submit-btn { background: #4CAF50; color: white; padding: 15px 30px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; width: 100%; }
        .submit-btn:hover { background: #45a049; }
        .submit-btn:disabled { background: #ccc; cursor: not-allowed; }
        .back-btn { background: #666; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px; }
        .back-btn:hover { background: #555; }
        .current-value { background: #e8f5e8; padding: 10px; border-radius: 5px; margin-top: 5px; font-size: 14px; color: #2E7D32; }
        .error-message { color: #f44336; font-size: 14px; margin-top: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>👤 개인정보 수정</h1>
            <p>판매자 정보와 계좌 정보를 수정하세요</p>
        </div>

        <form id="editForm">
            <div class="form-section">
                <h3>📋 기본 정보</h3>
                <div class="form-group">
                    <label for="username">이름 <span class="required">*</span></label>
                    <input type="text" id="username" name="username" value="${userInfo.USERNAME}" required>
                    <div class="current-value">현재: ${userInfo.USERNAME}</div>
                </div>
                <div class="form-group">
                    <label for="email">이메일 <span class="required">*</span></label>
                    <input type="email" id="email" name="email" value="${userInfo.EMAIL}" required>
                    <div class="current-value">현재: ${userInfo.EMAIL}</div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="tel">연락처 <span class="required">*</span></label>
                        <input type="tel" id="tel" name="tel" value="${userInfo.TEL}" required placeholder="010-1234-5678">
                        <div class="current-value">현재: ${userInfo.TEL}</div>
                    </div>
                    <div class="form-group">
                        <label for="address">주소 <span class="required">*</span></label>
                        <input type="text" id="address" name="address" value="${userInfo.ADDRESS}" required>
                        <div class="current-value">현재: ${userInfo.ADDRESS}</div>
                    </div>
                </div>
            </div>

            <div class="form-section">
                <h3>🏢 사업자 정보</h3>
                <div class="form-group">
                    <label for="businessNumber">사업자번호</label>
                    <input type="text" id="businessNumber" name="businessNumber" value="${userInfo.BUSINESS_NUMBER}" placeholder="123-45-67890">
                    <div class="current-value">현재: ${userInfo.BUSINESS_NUMBER}</div>
                </div>
            </div>

            <div class="form-section">
                <h3>🔐 보안</h3>
                <div class="form-group">
                    <label for="currentPassword">현재 비밀번호</label>
                    <input type="password" id="currentPassword" name="currentPassword" placeholder="변경하려면 현재 비밀번호를 입력하세요">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="newPassword">새 비밀번호</label>
                        <input type="password" id="newPassword" name="newPassword" placeholder="새 비밀번호를 입력하세요">
                    </div>
                    <div class="form-group">
                        <label for="confirmPassword">새 비밀번호 확인</label>
                        <input type="password" id="confirmPassword" name="confirmPassword" placeholder="새 비밀번호를 다시 입력하세요">
                    </div>
                </div>
            </div>

            <div class="form-section">
                <h3>💰 계좌 정보</h3>
                <div class="form-group">
                    <label for="bankName">은행명</label>
                    <select id="bankName" name="bankName">
                        <option value="">은행을 선택하세요</option>
                        <option value="KB" ${userInfo.BANK_NAME == 'KB' ? 'selected' : ''}>KB국민은행</option>
                        <option value="SHINHAN" ${userInfo.BANK_NAME == 'SHINHAN' ? 'selected' : ''}>신한은행</option>
                        <option value="WOORI" ${userInfo.BANK_NAME == 'WOORI' ? 'selected' : ''}>우리은행</option>
                        <option value="HANA" ${userInfo.BANK_NAME == 'HANA' ? 'selected' : ''}>하나은행</option>
                        <option value="NH" ${userInfo.BANK_NAME == 'NH' ? 'selected' : ''}>NH농협은행</option>
                        <option value="IBK" ${userInfo.BANK_NAME == 'IBK' ? 'selected' : ''}>IBK기업은행</option>
                        <option value="DAEGU" ${userInfo.BANK_NAME == 'DAEGU' ? 'selected' : ''}>대구은행</option>
                        <option value="BUSAN" ${userInfo.BANK_NAME == 'BUSAN' ? 'selected' : ''}>부산은행</option>
                    </select>
                    <div class="current-value">현재: ${userInfo.BANK_NAME}</div>
                </div>
                <div class="form-group">
                    <label for="accountNumber">계좌번호</label>
                    <input type="text" id="accountNumber" name="accountNumber" value="${userInfo.ACCOUNT_NUMBER}" placeholder="계좌번호를 입력하세요">
                    <div class="current-value">현재: ${userInfo.ACCOUNT_NUMBER}</div>
                </div>
                <div class="form-group">
                    <label for="accountHolder">예금주</label>
                    <input type="text" id="accountHolder" name="accountHolder" value="${userInfo.ACCOUNT_HOLDER}" placeholder="예금주명을 입력하세요">
                    <div class="current-value">현재: ${userInfo.ACCOUNT_HOLDER}</div>
                </div>
            </div>

            <button type="submit" class="submit-btn" id="submitBtn">정보 수정하기</button>
        </form>

        <a href="${pageContext.request.contextPath}/mypage/seller/${userId}" class="back-btn">← 마이페이지로 돌아가기</a>
    </div>

    <script>
        // 폼 제출 처리
        document.getElementById('editForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 비밀번호 확인
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (newPassword && newPassword !== confirmPassword) {
                alert('새 비밀번호가 일치하지 않습니다.');
                return;
            }
            
            const submitBtn = document.getElementById('submitBtn');
            submitBtn.disabled = true;
            submitBtn.textContent = '수정 중...';
            
            const formData = new FormData(this);
            formData.append('userId', '${userId}');
            
            // API 호출하여 정보 수정
            fetch('/api/mypage/seller/${userId}/edit', {
                method: 'PUT',
                body: formData
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('정보 수정에 실패했습니다.');
                }
            })
            .then(data => {
                alert('정보가 성공적으로 수정되었습니다!');
                window.location.href = '${pageContext.request.contextPath}/mypage/seller/${userId}';
            })
            .catch(error => {
                console.error('정보 수정 오류:', error);
                alert('정보 수정 중 오류가 발생했습니다: ' + error.message);
                submitBtn.disabled = false;
                submitBtn.textContent = '정보 수정하기';
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

