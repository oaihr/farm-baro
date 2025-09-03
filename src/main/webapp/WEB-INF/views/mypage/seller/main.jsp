<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8" />
    <title>판매자 마이페이지</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #4CAF50; }
        .header h1 { color: #2E7D32; margin: 0; }
        .user-info { background: #E8F5E8; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
        .user-info h3 { color: #2E7D32; margin-top: 0; }
        .info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px; }
        .info-item { background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #4CAF50; }
        .info-label { font-weight: bold; color: #555; margin-bottom: 5px; }
        .info-value { color: #333; }
        .menu-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; }
        .menu-item { background: #f9f9f9; padding: 20px; border-radius: 8px; text-align: center; transition: transform 0.2s; border: 2px solid #e0e0e0; }
        .menu-item:hover { transform: translateY(-5px); border-color: #4CAF50; box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
        .menu-item a { text-decoration: none; color: #333; display: block; }
        .menu-item h3 { color: #2E7D32; margin: 0 0 10px 0; }
        .menu-item p { color: #666; margin: 0; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-bottom: 30px; }
        .stat-item { background: #4CAF50; color: white; padding: 20px; border-radius: 8px; text-align: center; }
        .stat-number { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
        .stat-label { font-size: 14px; opacity: 0.9; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏪 판매자 마이페이지</h1>
            <p>상품 관리와 판매 활동을 한 곳에서 관리하세요</p>
        </div>

        <div class="user-info">
            <h3>📋 판매자 정보</h3>
            <div class="info-grid">
                <div class="info-item">
                    <div class="info-label">아이디</div>
                    <div class="info-value">${userInfo.ID}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">이름</div>
                    <div class="info-value">${userInfo.USERNAME}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">이메일</div>
                    <div class="info-value">${userInfo.EMAIL}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">연락처</div>
                    <div class="info-value">${userInfo.TEL}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">주소</div>
                    <div class="info-value">${userInfo.ADDRESS}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">사업자번호</div>
                    <div class="info-value">${userInfo.BUSINESS_NUMBER != null ? userInfo.BUSINESS_NUMBER : '미등록'}</div>
                </div>
            </div>
        </div>

        <div class="stats">
            <div class="stat-item">
                <div class="stat-number">${userInfo.TOTAL_SALES != null ? userInfo.TOTAL_SALES : 0}원</div>
                <div class="stat-label">총 매출</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">${userInfo.AVAILABLE_BALANCE != null ? userInfo.AVAILABLE_BALANCE : 0}원</div>
                <div class="stat-label">사용 가능 금액</div>
            </div>
        </div>

        <div class="menu-grid">
            <div class="menu-item">
                <a href="${pageContext.request.contextPath}/mypage/seller/${userId}/edit">
                    <h3>👤 개인정보 수정</h3>
                    <p>판매자 정보 및 계좌 정보를 수정합니다</p>
                </a>
            </div>
            <div class="menu-item">
                <a href="${pageContext.request.contextPath}/mypage/seller/${userId}/products">
                    <h3>📦 등록 상품 목록</h3>
                    <p>현재 등록된 상품들을 확인하고 관리합니다</p>
                </a>
            </div>
            <div class="menu-item">
                <a href="${pageContext.request.contextPath}/mypage/seller/${userId}/product-register">
                    <h3>➕ 상품 등록</h3>
                    <p>새로운 상품을 등록합니다</p>
                </a>
            </div>
            <div class="menu-item">
                <a href="${pageContext.request.contextPath}/mypage/seller/${userId}/orders">
                    <h3>📋 주문/배송 관리</h3>
                    <p>주문 현황과 배송 상태를 관리합니다</p>
                </a>
            </div>
            <div class="menu-item">
                <a href="${pageContext.request.contextPath}/mypage/seller/${userId}/reviews">
                    <h3>⭐ 리뷰 관리</h3>
                    <p>상품에 대한 리뷰를 확인하고 관리합니다</p>
                </a>
            </div>
            <div class="menu-item">
                <a href="${pageContext.request.contextPath}/mypage/seller/${userId}/inquiries">
                    <h3>❓ 문의 관리</h3>
                    <p>고객 문의사항을 확인하고 답변합니다</p>
                </a>
            </div>
        </div>
    </div>
</body>
</html>

