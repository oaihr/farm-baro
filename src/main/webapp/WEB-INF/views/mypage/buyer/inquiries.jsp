<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>문의</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .container { max-width: 1000px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #4CAF50; }
        .inquiry-list { margin-top: 20px; }
        .inquiry-item { border: 1px solid #ddd; border-radius: 8px; margin-bottom: 20px; overflow: hidden; }
        .inquiry-header { background: #f5f5f5; padding: 15px; display: flex; justify-content: space-between; align-items: center; }
        .product-info { font-weight: bold; color: #333; }
        .inquiry-date { color: #666; font-size: 14px; }
        .inquiry-status { padding: 5px 10px; border-radius: 15px; font-size: 12px; font-weight: bold; }
        .status-pending { background: #fff3cd; color: #856404; }
        .status-answered { background: #d4edda; color: #155724; }
        .inquiry-content { padding: 20px; }
        .question { margin-bottom: 20px; }
        .question-title { font-weight: bold; margin-bottom: 10px; color: #333; }
        .question-text { line-height: 1.6; color: #555; }
        .answer { background: #f0f8ff; padding: 15px; border-radius: 4px; margin-top: 15px; border-left: 4px solid #2196F3; }
        .answer-title { font-weight: bold; margin-bottom: 10px; color: #2196F3; }
        .answer-text { line-height: 1.6; }
        .inquiry-actions { display: flex; gap: 10px; margin-top: 15px; }
        .btn { padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; text-decoration: none; display: inline-block; }
        .btn-primary { background: #4CAF50; color: white; }
        .btn-primary:hover { background: #45a049; }
        .btn-danger { background: #f44336; color: white; }
        .btn-danger:hover { background: #d32f2f; }
        .no-inquiries { text-align: center; padding: 40px; color: #666; }
        .back-link { margin-top: 20px; text-align: center; }
        .back-link a { color: #4CAF50; text-decoration: none; }
        .back-link a:hover { text-decoration: underline; }
        .new-inquiry-btn { text-align: center; margin-bottom: 30px; }
        .btn-large { padding: 15px 30px; font-size: 16px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>문의</h1>
            <p>작성한 문의 내역과 답변을 확인하세요</p>
        </div>

        <div class="new-inquiry-btn">
            <button class="btn btn-primary btn-large" onclick="showNewInquiryForm()">새 문의 작성</button>
        </div>

        <div class="inquiry-list">
            <c:choose>
                <c:when test="${empty inquiries}">
                    <div class="no-inquiries">
                        <h3>작성한 문의가 없습니다</h3>
                        <p>상품에 대해 궁금한 점이 있으시면 문의를 작성해주세요.</p>
                    </div>
                </c:when>
                <c:otherwise>
                    <c:forEach var="inquiry" items="${inquiries}">
                        <div class="inquiry-item" id="inquiry-${inquiry.qnaId}">
                            <div class="inquiry-header">
                                <div class="product-info">${inquiry.productName}</div>
                                <div style="display: flex; align-items: center; gap: 15px;">
                                    <span class="inquiry-date">
                                        <fmt:formatDate value="${inquiry.questionDate}" pattern="yyyy-MM-dd HH:mm"/>
                                    </span>
                                    <span class="inquiry-status ${empty inquiry.replyContent ? 'status-pending' : 'status-answered'}">
                                        ${empty inquiry.replyContent ? '답변 대기' : '답변 완료'}
                                    </span>
                                </div>
                            </div>
                            
                            <div class="inquiry-content">
                                <div class="question">
                                    <div class="question-title">📝 문의 내용</div>
                                    <div class="question-text">${inquiry.questionContent}</div>
                                </div>
                                
                                <c:if test="${not empty inquiry.replyContent}">
                                    <div class="answer">
                                        <div class="answer-title">💬 판매자 답변</div>
                                        <div class="answer-text">${inquiry.replyContent}</div>
                                        <div style="margin-top: 10px; font-size: 12px; color: #666;">
                                            답변일: <fmt:formatDate value="${inquiry.replyDate}" pattern="yyyy-MM-dd HH:mm"/>
                                        </div>
                                    </div>
                                </c:if>
                                
                                <div class="inquiry-actions">
                                    <button class="btn btn-primary" onclick="editInquiry(${inquiry.qnaId}, '${inquiry.questionContent}')">
                                        수정
                                    </button>
                                    <button class="btn btn-danger" onclick="deleteInquiry(${inquiry.qnaId})">
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

    <!-- 새 문의 작성 모달 -->
    <div id="newInquiryModal" class="modal" style="display: none;">
        <div class="modal-content">
            <div class="modal-header">
                <h3>새 문의 작성</h3>
                <span class="close" onclick="closeModal()">&times;</span>
            </div>
            <form id="newInquiryForm">
                <div class="form-group">
                    <label>상품 선택</label>
                    <select name="productId" required>
                        <option value="">상품을 선택하세요</option>
                        <!-- 여기에 구매한 상품 목록이 들어갈 예정 -->
                        <option value="1">상품 1</option>
                        <option value="2">상품 2</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>문의 제목</label>
                    <input type="text" name="questionTitle" required placeholder="문의 제목을 입력하세요">
                </div>
                <div class="form-group">
                    <label>문의 내용</label>
                    <textarea name="questionContent" rows="5" required placeholder="문의 내용을 자세히 입력하세요"></textarea>
                </div>
                <div style="text-align: right;">
                    <button type="button" class="btn btn-secondary" onclick="closeModal()">취소</button>
                    <button type="submit" class="btn btn-primary">문의 등록</button>
                </div>
            </form>
        </div>
    </div>

    <!-- 문의 수정 모달 -->
    <div id="editInquiryModal" class="modal" style="display: none;">
        <div class="modal-content">
            <div class="modal-header">
                <h3>문의 수정</h3>
                <span class="close" onclick="closeModal()">&times;</span>
            </div>
            <form id="editInquiryForm">
                <input type="hidden" id="editInquiryId" name="qnaId">
                <div class="form-group">
                    <label>문의 제목</label>
                    <input type="text" id="editQuestionTitle" name="questionTitle" required>
                </div>
                <div class="form-group">
                    <label>문의 내용</label>
                    <textarea id="editQuestionContent" name="questionContent" rows="5" required></textarea>
                </div>
                <div style="text-align: right;">
                    <button type="button" class="btn btn-secondary" onclick="closeModal()">취소</button>
                    <button type="submit" class="btn btn-primary">수정</button>
                </div>
            </form>
        </div>
    </div>

    <style>
        .modal { display: none; position: fixed; z-index: 1000; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); }
        .modal-content { background-color: white; margin: 5% auto; padding: 30px; border-radius: 8px; width: 80%; max-width: 600px; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .close { font-size: 28px; font-weight: bold; cursor: pointer; color: #aaa; }
        .close:hover { color: #000; }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; margin-bottom: 5px; font-weight: bold; }
        .form-group input, .form-group textarea, .form-group select { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px; box-sizing: border-box; }
        .form-group textarea { resize: vertical; }
    </style>

    <script>
        function showNewInquiryForm() {
            document.getElementById('newInquiryModal').style.display = 'block';
        }

        function editInquiry(qnaId, questionContent) {
            document.getElementById('editInquiryId').value = qnaId;
            document.getElementById('editQuestionContent').value = questionContent;
            document.getElementById('editInquiryModal').style.display = 'block';
        }

        function closeModal() {
            document.getElementById('newInquiryModal').style.display = 'none';
            document.getElementById('editInquiryModal').style.display = 'none';
        }

        function deleteInquiry(qnaId) {
            if (confirm('정말로 이 문의를 삭제하시겠습니까?')) {
                fetch(`/api/mypage/inquiries/${qnaId}`, {
                    method: 'DELETE'
                })
                .then(response => response.json())
                .then(result => {
                    if (result) {
                        document.getElementById(`inquiry-${qnaId}`).remove();
                        alert('문의가 삭제되었습니다.');
                    } else {
                        alert('문의 삭제에 실패했습니다. 다시 시도해주세요.');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('오류가 발생했습니다. 다시 시도해주세요.');
                });
            }
        }

        // 새 문의 등록
        document.getElementById('newInquiryForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = {
                productId: formData.get('productId'),
                questionTitle: formData.get('questionTitle'),
                questionContent: formData.get('questionContent'),
                buyerId: '${userId}'
            };
            
            fetch('/api/mypage/inquiries', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(result => {
                if (result) {
                    alert('문의가 등록되었습니다.');
                    location.reload();
                } else {
                    alert('문의 등록에 실패했습니다. 다시 시도해주세요.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('오류가 발생했습니다. 다시 시도해주세요.');
            });
        });

        // 문의 수정
        document.getElementById('editInquiryForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = {
                qnaId: formData.get('qnaId'),
                questionTitle: formData.get('questionTitle'),
                questionContent: formData.get('questionContent')
            };
            
            fetch('/api/mypage/inquiries', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(result => {
                if (result) {
                    alert('문의가 수정되었습니다.');
                    location.reload();
                } else {
                    alert('문의 수정에 실패했습니다. 다시 시도해주세요.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('오류가 발생했습니다. 다시 시도해주세요.');
            });
        });

        // 모달 외부 클릭시 닫기
        window.onclick = function(event) {
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                if (event.target == modal) {
                    closeModal();
                }
            });
        }
    </script>
</body>
</html>

