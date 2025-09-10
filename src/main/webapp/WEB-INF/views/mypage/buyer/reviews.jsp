<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>리뷰</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .container { max-width: 1000px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #4CAF50; }
        .review-list { margin-top: 20px; }
        .review-item { border: 1px solid #ddd; border-radius: 8px; margin-bottom: 20px; overflow: hidden; }
        .review-header { background: #f5f5f5; padding: 15px; display: flex; justify-content: space-between; align-items: center; }
        .product-info { font-weight: bold; color: #333; }
        .review-date { color: #666; font-size: 14px; }
        .review-content { padding: 20px; }
        .rating { margin-bottom: 15px; }
        .stars { color: #ffc107; font-size: 20px; }
        .review-text { margin-bottom: 15px; line-height: 1.6; }
        .review-actions { display: flex; gap: 10px; }
        .btn { padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; text-decoration: none; display: inline-block; }
        .btn-primary { background: #4CAF50; color: white; }
        .btn-primary:hover { background: #45a049; }
        .btn-secondary { background: #666; color: white; }
        .btn-secondary:hover { background: #555; }
        .btn-danger { background: #f44336; color: white; }
        .btn-danger:hover { background: #d32f2f; }
        .no-reviews { text-align: center; padding: 40px; color: #666; }
        .back-link { margin-top: 20px; text-align: center; }
        .back-link a { color: #4CAF50; text-decoration: none; }
        .back-link a:hover { text-decoration: underline; }
        .modal { display: none; position: fixed; z-index: 1000; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); }
        .modal-content { background-color: white; margin: 5% auto; padding: 30px; border-radius: 8px; width: 80%; max-width: 600px; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .close { font-size: 28px; font-weight: bold; cursor: pointer; color: #aaa; }
        .close:hover { color: #000; }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; margin-bottom: 5px; font-weight: bold; }
        .form-group input, .form-group textarea, .form-group select { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px; box-sizing: border-box; }
        .form-group textarea { height: 100px; resize: vertical; }
        .rating-input { display: flex; gap: 10px; align-items: center; }
        .rating-input select { width: auto; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>리뷰</h1>
            <p>작성한 리뷰를 확인하고 수정하세요</p>
        </div>

        <div class="review-list">
            <c:choose>
                <c:when test="${empty reviews}">
                    <div class="no-reviews">
                        <h3>작성한 리뷰가 없습니다</h3>
                        <p>구매확정된 상품에 대해 리뷰를 작성할 수 있습니다.</p>
                    </div>
                </c:when>
                <c:otherwise>
                    <c:forEach var="review" items="${reviews}">
                        <div class="review-item" id="review-${review.reviewId}">
                            <div class="review-header">
                                <div class="product-info">${review.productName}</div>
                                <div class="review-date">
                                    <fmt:formatDate value="${review.reviewDate}" pattern="yyyy-MM-dd HH:mm"/>
                                </div>
                            </div>
                            
                            <div class="review-content">
                                <div class="rating">
                                    <span class="stars">
                                        <c:forEach begin="1" end="5" var="i">
                                            <c:choose>
                                                <c:when test="${i <= review.rating}">★</c:when>
                                                <c:otherwise>☆</c:otherwise>
                                            </c:choose>
                                        </c:forEach>
                                    </span>
                                    <span>(${review.rating}/5점)</span>
                                </div>
                                
                                <div class="review-text">${review.reviewComment}</div>
                                
                                <c:if test="${not empty review.sellerReply}">
                                    <div style="background: #f0f8ff; padding: 15px; border-radius: 4px; margin-top: 15px; border-left: 4px solid #2196F3;">
                                        <strong>판매자 답변:</strong> ${review.sellerReply}
                                    </div>
                                </c:if>
                                
                                <div class="review-actions">
                                    <button class="btn btn-primary" onclick="editReview(${review.reviewId}, '${review.reviewComment}', ${review.rating})">
                                        수정
                                    </button>
                                    <button class="btn btn-danger" onclick="deleteReview(${review.reviewId})">
                                        삭제
                                    </button>
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

    <!-- 리뷰 수정 모달 -->
    <div id="editModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>리뷰 수정</h3>
                <span class="close" onclick="closeModal()">&times;</span>
            </div>
            <form id="editReviewForm">
                <input type="hidden" id="editReviewId" name="reviewId">
                <div class="form-group">
                    <label>평점</label>
                    <div class="rating-input">
                        <select id="editRating" name="rating" required>
                            <option value="1">1점</option>
                            <option value="2">2점</option>
                            <option value="3">3점</option>
                            <option value="4">4점</option>
                            <option value="5">5점</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label>리뷰 내용</label>
                    <textarea id="editReviewText" name="reviewComment" required></textarea>
                </div>
                <div style="text-align: right;">
                    <button type="button" class="btn btn-secondary" onclick="closeModal()">취소</button>
                    <button type="submit" class="btn btn-primary">수정</button>
                </div>
            </form>
        </div>
    </div>

    <script>
        function editReview(reviewId, reviewText, rating) {
            document.getElementById('editReviewId').value = reviewId;
            document.getElementById('editReviewText').value = reviewText;
            document.getElementById('editRating').value = rating;
            document.getElementById('editModal').style.display = 'block';
        }

        function closeModal() {
            document.getElementById('editModal').style.display = 'none';
        }

        function deleteReview(reviewId) {
            if (confirm('정말로 이 리뷰를 삭제하시겠습니까?')) {
                fetch(`/api/mypage/reviews/${reviewId}`, {
                    method: 'DELETE'
                })
                .then(response => response.json())
                .then(result => {
                    if (result) {
                        document.getElementById(`review-${reviewId}`).remove();
                        alert('리뷰가 삭제되었습니다.');
                    } else {
                        alert('리뷰 삭제에 실패했습니다. 다시 시도해주세요.');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('오류가 발생했습니다. 다시 시도해주세요.');
                });
            }
        }

        document.getElementById('editReviewForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = {
                reviewId: formData.get('reviewId'),
                rating: parseInt(formData.get('rating')),
                reviewComment: formData.get('reviewComment')
            };
            
            fetch('/api/mypage/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(result => {
                if (result) {
                    alert('리뷰가 수정되었습니다.');
                    location.reload();
                } else {
                    alert('리뷰 수정에 실패했습니다. 다시 시도해주세요.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('오류가 발생했습니다. 다시 시도해주세요.');
            });
        });

        // 모달 외부 클릭시 닫기
        window.onclick = function(event) {
            const modal = document.getElementById('editModal');
            if (event.target == modal) {
                closeModal();
            }
        }
    </script>
</body>
</html>

