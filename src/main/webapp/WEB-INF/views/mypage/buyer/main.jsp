<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>구매자 마이페이지</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #4CAF50; }
        .profile-section { display: flex; gap: 30px; margin-bottom: 30px; }
        .profile-info { flex: 1; padding: 20px; background: #f9f9f9; border-radius: 8px; }
        .quick-stats { flex: 2; display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; }
        .stat-card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); text-align: center; }
        .stat-number { font-size: 24px; font-weight: bold; color: #4CAF50; }
        .stat-label { color: #666; margin-top: 5px; }
        .menu-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 30px; }
        .menu-item { background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); text-align: center; transition: transform 0.2s; }
        .menu-item:hover { transform: translateY(-5px); box-shadow: 0 5px 15px rgba(0,0,0,0.2); }
        .menu-item a { text-decoration: none; color: inherit; display: block; }
        .menu-icon { font-size: 40px; margin-bottom: 15px; }
        .menu-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; color: #333; }
        .menu-desc { color: #666; font-size: 14px; }
        .btn { background: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; text-decoration: none; display: inline-block; }
        .btn:hover { background: #45a049; }
        .error { color: red; text-align: center; padding: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <c:if test="${not empty error}">
            <div class="error">오류: ${error}</div>
        </c:if>
        
        <div class="header">
            <h1>구매자 마이페이지</h1>
            <p>안녕하세요, <strong>${userInfo.USERNAME}</strong>님!</p>
        </div>

        <div class="profile-section">
            <div class="profile-info">
                <h3>프로필 정보</h3>
                <p><strong>아이디:</strong> ${userInfo.ID}</p>
                <p><strong>이름:</strong> ${userInfo.USERNAME}</p>
                <p><strong>이메일:</strong> ${userInfo.EMAIL}</p>
                <p><strong>전화번호:</strong> ${userInfo.TEL}</p>
                <p><strong>주소:</strong> ${userInfo.ADDRESS}</p>
                <a href="/mypage/buyer/${userId}/edit-info" class="btn">개인정보 수정</a>
            </div>
            
            <div class="quick-stats">
                <div class="stat-card">
                    <div class="stat-number">${userInfo.orderCount}</div>
                    <div class="stat-label">총 주문</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${userInfo.reviewCount}</div>
                    <div class="stat-label">작성 리뷰</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${userInfo.cartCount}</div>
                    <div class="stat-label">장바구니</div>
                </div>
            </div>
        </div>

        <div class="menu-grid">
            <div class="menu-item">
                <a href="/mypage/buyer/${userId}/orders">
                    <div class="menu-icon">📦</div>
                    <div class="menu-title">주문/배송</div>
                    <div class="menu-desc">주문 내역과 배송 현황을 확인하세요</div>
                </a>
            </div>
            
            <div class="menu-item">
                <a href="/mypage/buyer/${userId}/reviews">
                    <div class="menu-icon">⭐</div>
                    <div class="menu-title">리뷰</div>
                    <div class="menu-desc">작성한 리뷰를 확인하고 수정하세요</div>
                </a>
            </div>
            
            <div class="menu-item">
                <a href="/mypage/buyer/${userId}/inquiries">
                    <div class="menu-icon">❓</div>
                    <div class="menu-title">문의</div>
                    <div class="menu-desc">문의 내역과 답변을 확인하세요</div>
                </a>
            </div>
            
            <div class="menu-item">
                <a href="/mypage/buyer/${userId}/bids">
                    <div class="menu-icon">🏷️</div>
                    <div class="menu-title">경매 상품</div>
                    <div class="menu-desc">입찰 현황과 낙찰 상품을 확인하세요</div>
                </a>
            </div>
            
            <div class="menu-item">
                <a href="/mypage/buyer/${userId}/cart">
                    <div class="menu-icon">🛒</div>
                    <div class="menu-title">장바구니</div>
                    <div class="menu-desc">담은 상품을 확인하고 결제하세요</div>
                </a>
            </div>
            
            <div class="menu-item">
                <a href="/mypage/buyer/${userId}/edit-info">
                    <div class="menu-icon">⚙️</div>
                    <div class="menu-title">개인정보 수정</div>
                    <div class="menu-desc">프로필 정보를 수정하세요</div>
                </a>
            </div>
        </div>
    </div>
</body>
</html>

