<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8" />
    <title>리뷰 관리</title>
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
        .reviews-container { display: grid; gap: 20px; }
        .review-card { background: #f9f9f9; padding: 20px; border-radius: 8px; border-left: 4px solid #4CAF50; }
        .review-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
        .review-info { display: flex; gap: 20px; align-items: center; }
        .product-name { font-weight: bold; color: #2E7D32; font-size: 16px; }
        .reviewer-name { color: #666; }
        .review-date { color: #999; font-size: 14px; }
        .rating { display: flex; gap: 5px; }
        .star { color: #FFD700; font-size: 18px; }
        .star.empty { color: #ddd; }
        .review-content { color: #333; line-height: 1.6; margin-bottom: 15px; }
        .review-actions { display: flex; gap: 10px; }
        .action-btn { padding: 8px 16px; border: none; border-radius: 5px; cursor: pointer; font-size: 14px; }
        .reply-btn { background: #2196F3; color: white; }
        .reply-btn:hover { background: #1976D2; }
        .report-btn { background: #f44336; color: white; }
        .report-btn:hover { background: #d32f2f; }
        .back-btn { background: #666; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px; }
        .back-btn:hover { background: #555; }
        .no-reviews { text-align: center; padding: 40px; color: #666; }
        .reply-form { background: white; padding: 15px; border-radius: 5px; margin-top: 15px; border: 1px solid #ddd; }
        .reply-textarea { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; resize: vertical; min-height: 80px; }
        .reply-actions { display: flex; gap: 10px; margin-top: 10px; }
        .submit-reply { background: #4CAF50; color: white; padding: 8px 16px; border: none; border-radius: 5px; cursor: pointer; }
        .submit-reply:hover { background: #45a049; }
        .cancel-reply { background: #666; color: white; padding: 8px 16px; border: none; border-radius: 5px; cursor: pointer; }
        .cancel-reply:hover { background: #555; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>⭐ 리뷰 관리</h1>
            <p>상품에 대한 고객 리뷰를 확인하고 관리하세요</p>
        </div>

        <div class="stats">
            <div class="stat-item">
                <div class="stat-number">${reviewStats.totalCount}</div>
                <div class="stat-label">전체 리뷰</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">${reviewStats.avgRating}</div>
                <div class="stat-label">평균 평점</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">${reviewStats.repliedCount}</div>
                <div class="stat-label">답변 완료</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">${reviewStats.pendingReplyCount}</div>
                <div class="stat-label">답변 대기</div>
            </div>
        </div>

        <div class="filter-section">
            <h3>🔍 리뷰 검색</h3>
            <form class="filter-form" id="filterForm">
                <div class="form-group">
                    <label for="rating">평점</label>
                    <select id="rating" name="rating">
                        <option value="">전체</option>
                        <option value="5">5점</option>
                        <option value="4">4점</option>
                        <option value="3">3점</option>
                        <option value="2">2점</option>
                        <option value="1">1점</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="hasReply">답변 상태</label>
                    <select id="hasReply" name="hasReply">
                        <option value="">전체</option>
                        <option value="true">답변 완료</option>
                        <option value="false">답변 대기</option>
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

        <div id="reviewsContainer">
            <c:choose>
                <c:when test="${not empty reviews}">
                    <div class="reviews-container">
                        <c:forEach var="review" items="${reviews}">
                            <div class="review-card" id="review-${review.REVIEW_ID}">
                                <div class="review-header">
                                    <div class="review-info">
                                        <span class="product-name">${review.PRODUCT_NAME}</span>
                                        <span class="reviewer-name">${review.REVIEWER_NAME}</span>
                                        <span class="review-date">${review.CREATED_TIME}</span>
                                    </div>
                                    <div class="rating">
                                        <c:forEach begin="1" end="5" var="i">
                                            <span class="star ${i <= review.RATING ? '' : 'empty'}">★</span>
                                        </c:forEach>
                                    </div>
                                </div>
                                <div class="review-content">${review.CONTENT}</div>
                                <div class="review-actions">
                                    <button onclick="showReplyForm('${review.REVIEW_ID}')" class="action-btn reply-btn">
                                        ${review.HAS_REPLY ? '답변 수정' : '답변 작성'}
                                    </button>
                                    <button onclick="reportReview('${review.REVIEW_ID}')" class="action-btn report-btn">신고</button>
                                </div>
                                
                                <c:if test="${review.HAS_REPLY}">
                                    <div class="reply-form" id="reply-${review.REVIEW_ID}">
                                        <h4>판매자 답변:</h4>
                                        <p>${review.SELLER_REPLY}</p>
                                        <div class="reply-actions">
                                            <button onclick="showReplyForm('${review.REVIEW_ID}')" class="action-btn reply-btn">수정</button>
                                        </div>
                                    </div>
                                </c:if>
                            </div>
                        </c:forEach>
                    </div>
                </c:when>
                <c:otherwise>
                    <div class="no-reviews">
                        <h3>리뷰가 없습니다</h3>
                        <p>아직 상품에 대한 리뷰가 작성되지 않았습니다.</p>
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
            const rating = document.getElementById('rating').value;
            const hasReply = document.getElementById('hasReply').value;
            const startDate = document.getElementById('startDate').value;
            const endDate = document.getElementById('endDate').value;
            
            // API 호출하여 리뷰 검색
            searchReviews(rating, hasReply, startDate, endDate);
        });

        // 리뷰 검색 함수
        function searchReviews(rating, hasReply, startDate, endDate) {
            const url = `/api/mypage/seller/${userId}/reviews?rating=${encodeURIComponent(rating)}&hasReply=${encodeURIComponent(hasReply)}&startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`;
            
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    updateReviewsContainer(data);
                })
                .catch(error => {
                    console.error('리뷰 검색 오류:', error);
                    alert('리뷰 검색 중 오류가 발생했습니다.');
                });
        }

        // 리뷰 컨테이너 업데이트
        function updateReviewsContainer(reviews) {
            const container = document.getElementById('reviewsContainer');
            
            if (reviews && reviews.length > 0) {
                let reviewsHTML = '<div class="reviews-container">';
                
                reviews.forEach(review => {
                    const starsHTML = generateStars(review.RATING);
                    const replyFormHTML = review.HAS_REPLY ? 
                        `<div class="reply-form" id="reply-${review.REVIEW_ID}">
                            <h4>판매자 답변:</h4>
                            <p>${review.SELLER_REPLY}</p>
                            <div class="reply-actions">
                                <button onclick="showReplyForm('${review.REVIEW_ID}')" class="action-btn reply-btn">수정</button>
                            </div>
                        </div>` : '';
                    
                    reviewsHTML += `
                        <div class="review-card" id="review-${review.REVIEW_ID}">
                            <div class="review-header">
                                <div class="review-info">
                                    <span class="product-name">${review.PRODUCT_NAME}</span>
                                    <span class="reviewer-name">${review.REVIEWER_NAME}</span>
                                    <span class="review-date">${review.CREATED_TIME}</span>
                                </div>
                                <div class="rating">${starsHTML}</div>
                            </div>
                            <div class="review-content">${review.CONTENT}</div>
                            <div class="review-actions">
                                <button onclick="showReplyForm('${review.REVIEW_ID}')" class="action-btn reply-btn">
                                    ${review.HAS_REPLY ? '답변 수정' : '답변 작성'}
                                </button>
                                <button onclick="reportReview('${review.REVIEW_ID}')" class="action-btn report-btn">신고</button>
                            </div>
                            ${replyFormHTML}
                        </div>
                    `;
                });
                
                reviewsHTML += '</div>';
                container.innerHTML = reviewsHTML;
            } else {
                container.innerHTML = `
                    <div class="no-reviews">
                        <h3>검색 결과가 없습니다</h3>
                        <p>다른 검색 조건을 시도해보세요.</p>
                    </div>
                `;
            }
        }

        // 별점 HTML 생성
        function generateStars(rating) {
            let starsHTML = '';
            for (let i = 1; i <= 5; i++) {
                starsHTML += `<span class="star ${i <= rating ? '' : 'empty'}">★</span>`;
            }
            return starsHTML;
        }

        // 답변 폼 표시
        function showReplyForm(reviewId) {
            const reviewCard = document.getElementById(`review-${reviewId}`);
            const existingForm = reviewCard.querySelector('.reply-form');
            
            if (existingForm && !existingForm.querySelector('textarea')) {
                // 기존 답변 폼이 있으면 수정 모드로 변경
                const replyText = existingForm.querySelector('p').textContent;
                existingForm.innerHTML = `
                    <h4>답변 작성:</h4>
                    <textarea class="reply-textarea" placeholder="답변을 입력하세요">${replyText}</textarea>
                    <div class="reply-actions">
                        <button onclick="submitReply('${reviewId}')" class="submit-reply">저장</button>
                        <button onclick="cancelReply('${reviewId}')" class="cancel-reply">취소</button>
                    </div>
                `;
            } else {
                // 새로운 답변 폼 생성
                const replyForm = document.createElement('div');
                replyForm.className = 'reply-form';
                replyForm.innerHTML = `
                    <h4>답변 작성:</h4>
                    <textarea class="reply-textarea" placeholder="답변을 입력하세요"></textarea>
                    <div class="reply-actions">
                        <button onclick="submitReply('${reviewId}')" class="submit-reply">저장</button>
                        <button onclick="cancelReply('${reviewId}')" class="cancel-reply">취소</button>
                    </div>
                `;
                
                // 기존 답변 폼이 있으면 교체
                if (existingForm) {
                    existingForm.remove();
                }
                
                reviewCard.appendChild(replyForm);
            }
        }

        // 답변 제출
        function submitReply(reviewId) {
            const textarea = document.querySelector(`#review-${reviewId} .reply-textarea`);
            const replyContent = textarea.value.trim();
            
            if (!replyContent) {
                alert('답변 내용을 입력해주세요.');
                return;
            }
            
            fetch(`/api/mypage/seller/${userId}/reviews/${reviewId}/reply`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ reply: replyContent })
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('답변 저장에 실패했습니다.');
                }
            })
            .then(data => {
                alert('답변이 저장되었습니다.');
                location.reload();
            })
            .catch(error => {
                console.error('답변 저장 오류:', error);
                alert('답변 저장 중 오류가 발생했습니다: ' + error.message);
            });
        }

        // 답변 취소
        function cancelReply(reviewId) {
            const reviewCard = document.getElementById(`review-${reviewId}`);
            const replyForm = reviewCard.querySelector('.reply-form');
            
            if (replyForm) {
                replyForm.remove();
            }
        }

        // 리뷰 신고
        function reportReview(reviewId) {
            const reason = prompt('신고 사유를 입력해주세요:');
            if (reason) {
                fetch(`/api/mypage/seller/${userId}/reviews/${reviewId}/report`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ reason: reason })
                })
                .then(response => {
                    if (response.ok) {
                        alert('리뷰가 신고되었습니다.');
                    } else {
                        alert('리뷰 신고에 실패했습니다.');
                    }
                })
                .catch(error => {
                    console.error('리뷰 신고 오류:', error);
                    alert('리뷰 신고 중 오류가 발생했습니다.');
                });
            }
        }
    </script>
</body>
</html>

