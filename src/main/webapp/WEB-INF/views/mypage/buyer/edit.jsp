<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>개인정보 수정</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #4CAF50; }
        .form-group { margin-bottom: 20px; }
        label { display: block; margin-bottom: 5px; font-weight: bold; color: #333; }
        input[type="text"], input[type="email"], input[type="tel"], textarea { 
            width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 5px; font-size: 16px; box-sizing: border-box; 
        }
        input[type="text"]:focus, input[type="email"]:focus, input[type="tel"]:focus, textarea:focus { 
            outline: none; border-color: #4CAF50; box-shadow: 0 0 5px rgba(76,175,80,0.3); 
        }
        .readonly { background-color: #f5f5f5; color: #666; }
        .btn-group { display: flex; gap: 15px; margin-top: 30px; }
        .btn { padding: 12px 25px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; text-decoration: none; display: inline-block; text-align: center; }
        .btn-primary { background: #4CAF50; color: white; }
        .btn-primary:hover { background: #45a049; }
        .btn-secondary { background: #666; color: white; }
        .btn-secondary:hover { background: #555; }
        .success { color: #4CAF50; background: #e8f5e8; padding: 15px; border-radius: 5px; margin-bottom: 20px; text-align: center; }
        .error { color: #f44336; background: #ffebee; padding: 15px; border-radius: 5px; margin-bottom: 20px; text-align: center; }
        .info-box { background: #e3f2fd; padding: 15px; border-radius: 5px; margin-bottom: 20px; border-left: 4px solid #2196F3; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>개인정보 수정</h1>
            <p>수정 가능한 정보만 변경하세요 (아이디는 변경할 수 없습니다)</p>
        </div>

        <c:if test="${not empty success}">
            <div class="success">${success}</div>
        </c:if>
        
        <c:if test="${not empty error}">
            <div class="error">${error}</div>
        </c:if>

        <div class="info-box">
            <strong>안내:</strong> 아이디, 가입일 등은 보안상 수정할 수 없습니다.
        </div>

        <form action="/api/mypage/buyer/${userId}/edit" method="POST" id="editForm">
            <input type="hidden" name="id" value="${userId}">
            
            <div class="form-group">
                <label>아이디 (수정 불가)</label>
                <input type="text" value="${userId}" readonly class="readonly">
            </div>
            
            <div class="form-group">
                <label for="userName">이름 *</label>
                <input type="text" id="userName" name="userName" value="${userInfo.USERNAME}" required>
            </div>
            
            <div class="form-group">
                <label for="email">이메일 *</label>
                <input type="email" id="email" name="email" value="${userInfo.user.email}" required>
            </div>
            
            <div class="form-group">
                <label for="tel">전화번호 *</label>
                <input type="tel" id="tel" name="tel" value="${userInfo.user.tel}" required>
            </div>
            
            <div class="form-group">
                <label for="address">주소 *</label>
                <textarea id="address" name="address" rows="3" required>${userInfo.user.address}</textarea>
            </div>
            
            <div class="btn-group">
                <button type="submit" class="btn btn-primary">저장</button>
                <a href="/mypage/buyer/${userId}" class="btn btn-secondary">취소</a>
            </div>
        </form>
    </div>

    <script>
        document.getElementById('editForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = {
                id: formData.get('id'),
                nickname: formData.get('nickname'),
                email: formData.get('email'),
                tel: formData.get('tel'),
                address: formData.get('address')
            };
            
            fetch('/api/mypage/buyer/${userId}/edit', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(result => {
                if (result) {
                    alert('개인정보가 성공적으로 수정되었습니다.');
                    window.location.href = '/mypage/buyer/' + data.id;
                } else {
                    alert('수정에 실패했습니다. 다시 시도해주세요.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('오류가 발생했습니다. 다시 시도해주세요.');
            });
        });
    </script>
</body>
</html>

