<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8" />
    <title>문의 관리</title>
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
        .inquiries-container { display: grid; gap: 20px; }
        .inquiry-card { background: #f9f9f9; padding: 20px; border-radius: 8px; border-left: 4px solid #4CAF50; }
        .inquiry-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
        .inquiry-info { display: flex; gap: 20px; align-items: center; }
        .product-name { font-weight: bold; color: #2E7D32; font-size: 16px; }
        .inquirer-name { color: #666; }
        .inquiry-date { color: #999; font-size: 14px; }
        .inquiry-status { padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; }
        .status-pending { background: #FFF3E0; color: #F57C00; }
        .status-answered { background: #E8F5E8; color: #2E7D32; }
        .inquiry-content { color: #333; line-height: 1.6; margin-bottom: 15px; }
        .inquiry-actions { display: flex; gap: 10px; }
        .action-btn { padding: 8px 16px; border: none; border-radius: 5px; cursor: pointer; font-size: 14px; }
        .answer-btn { background: #2196F3; color: white; }
        .answer-btn:hover { background: #1976D2; }
        .edit-answer-btn { background: #FF9800; color: white; }
        .edit-answer-btn:hover { background: #F57C00; }
        .back-btn { background: #666; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px; }
        .back-btn:hover { background: #555; }
        .no-inquiries { text-align: center; padding: 40px; color: #666; }
        .answer-form { background: white; padding: 15px; border-radius: 5px; margin-top: 15px; border: 1px solid #ddd; }
        .answer-textarea { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; resize: vertical; min-height: 80px; }
        .answer-actions { display: flex; gap: 10px; margin-top: 10px; }
        .submit-answer { background: #4CAF50; color: white; padding: 8px 16px; border: none; border-radius: 5px; cursor: pointer; }
        .submit-answer:hover { background: #45a049; }
        .cancel-answer { background: #666; color: white; padding: 8px 16px; border: none; border-radius: 5px; cursor: pointer; }
        .cancel-answer:hover { background: #555; }
        .existing-answer { background: #E8F5E8; padding: 15px; border-radius: 5px; margin-top: 15px; border-left: 4px solid #4CAF50; }
        .answer-label { font-weight: bold; color: #2E7D32; margin-bottom: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>❓ 문의 관리</h1>
            <p>고객 문의사항을 확인하고 답변하세요</p>
        </div>

        <div class="stats">
            <div class="stat-item">
                <div class="stat-number">${inquiryStats.totalCount}</div>
                <div class="stat-label">전체 문의</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">${inquiryStats.pendingCount}</div>
                <div class="stat-label">답변 대기</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">${inquiryStats.answeredCount}</div>
                <div class="stat-label">답변 완료</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">${inquiryStats.avgResponseTime}</div>
                <div class="stat-label">평균 응답시간(시간)</div>
            </div>
        </div>

        <div class="filter-section">
            <h3>🔍 문의 검색</h3>
            <form class="filter-form" id="filterForm">
                <div class="form-group">
                    <label for="inquiryType">문의 유형</label>
                    <select id="inquiryType" name="inquiryType">
                        <option value="">전체</option>
                        <option value="PRODUCT">상품 문의</option>
                        <option value="DELIVERY">배송 문의</option>
                        <option value="REFUND">환불/교환</option>
                        <option value="OTHER">기타</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="inquiryStatus">답변 상태</label>
                    <select id="inquiryStatus" name="inquiryStatus">
                        <option value="">전체</option>
                        <option value="PENDING">답변 대기</option>
                        <option value="ANSWERED">답변 완료</option>
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

        <div id="inquiriesContainer">
            <c:choose>
                <c:when test="${not empty inquiries}">
                    <div class="inquiries-container">
                        <c:forEach var="inquiry" items="${inquiries}">
                            <div class="inquiry-card" id="inquiry-${inquiry.INQUIRY_ID}">
                                <div class="inquiry-header">
                                    <div class="inquiry-info">
                                        <span class="product-name">${inquiry.PRODUCT_NAME}</span>
                                        <span class="inquirer-name">${inquiry.INQUIRER_NAME}</span>
                                        <span class="inquiry-date">${inquiry.CREATED_TIME}</span>
                                    </div>
                                    <span class="inquiry-status status-${inquiry.STATUS == 'PENDING' ? 'pending' : 'answered'}">
                                        ${inquiry.STATUS == 'PENDING' ? '답변 대기' : '답변 완료'}
                                    </span>
                                </div>
                                <div class="inquiry-content">
                                    <strong>문의 내용:</strong><br>
                                    ${inquiry.CONTENT}
                                </div>
                                <div class="inquiry-actions">
                                    <c:choose>
                                        <c:when test="${inquiry.STATUS == 'PENDING'}">
                                            <button onclick="showAnswerForm('${inquiry.INQUIRY_ID}')" class="action-btn answer-btn">답변 작성</button>
                                        </c:when>
                                        <c:otherwise>
                                            <button onclick="showAnswerForm('${inquiry.INQUIRY_ID}')" class="action-btn edit-answer-btn">답변 수정</button>
                                        </c:otherwise>
                                    </c:choose>
                                </div>
                                
                                <c:if test="${inquiry.STATUS == 'ANSWERED'}">
                                    <div class="existing-answer" id="answer-${inquiry.INQUIRY_ID}">
                                        <div class="answer-label">판매자 답변:</div>
                                        <p>${inquiry.SELLER_ANSWER}</p>
                                        <div class="answer-actions">
                                            <button onclick="showAnswerForm('${inquiry.INQUIRY_ID}')" class="action-btn edit-answer-btn">수정</button>
                                        </div>
                                    </div>
                                </c:if>
                            </div>
                        </c:forEach>
                    </div>
                </c:when>
                <c:otherwise>
                    <div class="no-inquiries">
                        <h3>문의 내역이 없습니다</h3>
                        <p>아직 고객 문의가 들어오지 않았습니다.</p>
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
            const inquiryType = document.getElementById('inquiryType').value;
            const inquiryStatus = document.getElementById('inquiryStatus').value;
            const startDate = document.getElementById('startDate').value;
            const endDate = document.getElementById('endDate').value;
            
            // API 호출하여 문의 검색
            searchInquiries(inquiryType, inquiryStatus, startDate, endDate);
        });

        // 문의 검색 함수
        function searchInquiries(inquiryType, inquiryStatus, startDate, endDate) {
            const url = `/api/mypage/seller/${userId}/inquiries?inquiryType=${encodeURIComponent(inquiryType)}&inquiryStatus=${encodeURIComponent(inquiryStatus)}&startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`;
            
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    updateInquiriesContainer(data);
                })
                .catch(error => {
                    console.error('문의 검색 오류:', error);
                    alert('문의 검색 중 오류가 발생했습니다.');
                });
        }

        // 문의 컨테이너 업데이트
        function updateInquiriesContainer(inquiries) {
            const container = document.getElementById('inquiriesContainer');
            
            if (inquiries && inquiries.length > 0) {
                let inquiriesHTML = '<div class="inquiries-container">';
                
                inquiries.forEach(inquiry => {
                    const statusClass = inquiry.STATUS === 'PENDING' ? 'pending' : 'answered';
                    const statusText = inquiry.STATUS === 'PENDING' ? '답변 대기' : '답변 완료';
                    const actionButton = inquiry.STATUS === 'PENDING' ? 
                        `<button onclick="showAnswerForm('${inquiry.INQUIRY_ID}')" class="action-btn answer-btn">답변 작성</button>` :
                        `<button onclick="showAnswerForm('${inquiry.INQUIRY_ID}')" class="action-btn edit-answer-btn">답변 수정</button>`;
                    
                    const existingAnswerHTML = inquiry.STATUS === 'ANSWERED' ? 
                        `<div class="existing-answer" id="answer-${inquiry.INQUIRY_ID}">
                            <div class="answer-label">판매자 답변:</div>
                            <p>${inquiry.SELLER_ANSWER}</p>
                            <div class="answer-actions">
                                <button onclick="showAnswerForm('${inquiry.INQUIRY_ID}')" class="action-btn edit-answer-btn">수정</button>
                            </div>
                        </div>` : '';
                    
                    inquiriesHTML += `
                        <div class="inquiry-card" id="inquiry-${inquiry.INQUIRY_ID}">
                            <div class="inquiry-header">
                                <div class="inquiry-info">
                                    <span class="product-name">${inquiry.PRODUCT_NAME}</span>
                                    <span class="inquirer-name">${inquiry.INQUIRER_NAME}</span>
                                    <span class="inquiry-date">${inquiry.CREATED_TIME}</span>
                                </div>
                                <span class="inquiry-status status-${statusClass}">
                                    ${statusText}
                                </span>
                            </div>
                            <div class="inquiry-content">
                                <strong>문의 내용:</strong><br>
                                ${inquiry.CONTENT}
                            </div>
                            <div class="inquiry-actions">
                                ${actionButton}
                            </div>
                            ${existingAnswerHTML}
                        </div>
                    `;
                });
                
                inquiriesHTML += '</div>';
                container.innerHTML = inquiriesHTML;
            } else {
                container.innerHTML = `
                    <div class="no-inquiries">
                        <h3>검색 결과가 없습니다</h3>
                        <p>다른 검색 조건을 시도해보세요.</p>
                    </div>
                `;
            }
        }

        // 답변 폼 표시
        function showAnswerForm(inquiryId) {
            const inquiryCard = document.getElementById(`inquiry-${inquiryId}`);
            const existingForm = inquiryCard.querySelector('.answer-form');
            const existingAnswer = inquiryCard.querySelector('.existing-answer');
            
            if (existingForm) {
                // 기존 폼이 있으면 제거
                existingForm.remove();
                return;
            }
            
            // 기존 답변 내용 가져오기
            let existingAnswerText = '';
            if (existingAnswer) {
                existingAnswerText = existingAnswer.querySelector('p').textContent;
            }
            
            // 답변 폼 생성
            const answerForm = document.createElement('div');
            answerForm.className = 'answer-form';
            answerForm.innerHTML = `
                <h4>답변 작성:</h4>
                <textarea class="answer-textarea" placeholder="답변을 입력하세요">${existingAnswerText}</textarea>
                <div class="answer-actions">
                    <button onclick="submitAnswer('${inquiryId}')" class="submit-answer">저장</button>
                    <button onclick="cancelAnswer('${inquiryId}')" class="cancel-answer">취소</button>
                </div>
            `;
            
            inquiryCard.appendChild(answerForm);
        }

        // 답변 제출
        function submitAnswer(inquiryId) {
            const textarea = document.querySelector(`#inquiry-${inquiryId} .answer-textarea`);
            const answerContent = textarea.value.trim();
            
            if (!answerContent) {
                alert('답변 내용을 입력해주세요.');
                return;
            }
            
            fetch(`/api/mypage/seller/${userId}/inquiries/${inquiryId}/answer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ answer: answerContent })
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
        function cancelAnswer(inquiryId) {
            const inquiryCard = document.getElementById(`inquiry-${inquiryId}`);
            const answerForm = inquiryCard.querySelector('.answer-form');
            
            if (answerForm) {
                answerForm.remove();
            }
        }
    </script>
</body>
</html>

