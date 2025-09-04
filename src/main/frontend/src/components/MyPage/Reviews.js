import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Reviews.css';

const Reviews = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('all');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [reviews, setReviews] = useState([]);
    const [filteredReviews, setFilteredReviews] = useState([]);
    const [replyModal, setReplyModal] = useState({ show: false, reviewId: null, replyText: '' });
    
    const tabs = [
        { id: 'all', label: '전체 리뷰', icon: '⭐' },
        { id: 'positive', label: '긍정적', icon: '😊' },
        { id: 'neutral', label: '보통', icon: '😐' },
        { id: 'negative', label: '부정적', icon: '😞' },
        { id: 'unanswered', label: '답변대기', icon: '❓' }
    ];

    const quickActions = [
        { icon: '💬', label: '답변 작성', action: 'reply' },
        { icon: '📊', label: '리뷰 분석', action: 'analyze' },
        { icon: '📝', label: '리뷰 관리', action: 'manage' },
        { icon: '🚀', label: '품질 개선', action: 'improve' },
        { icon: '📈', label: '성과 보고', action: 'report' }
    ];

    // 리뷰 목록 가져오기
    const fetchReviews = async () => {
        try {
            setLoading(true);
            
            // 실제 API 호출 시도 (현재는 구현되지 않음)
            try {
                const response = await fetch(`http://localhost:8080/mypage/seller/${userId}/reviews`, {
                    credentials: 'include'
                });
                
                if (response.ok) {
                    const responseText = await response.text();
                    if (responseText && responseText !== 'error') {
                        try {
                            const data = JSON.parse(responseText);
                            setReviews(data);
                            setFilteredReviews(data);
                            return;
                        } catch (parseError) {
                            console.log('JSON 파싱 실패, 더미 데이터 사용:', parseError);
                        }
                    }
                }
            } catch (apiError) {
                console.log('API 호출 실패, 더미 데이터 사용:', apiError);
            }
            
            // API가 구현되지 않은 경우 더미 데이터 사용
            const dummyReviews = [
                {
                    id: 1,
                    productName: '신선한 사과',
                    buyerName: '구매자1',
                    rating: 5,
                    content: '정말 맛있는 사과였습니다! 신선하고 달콤해요.',
                    reviewDate: '2025-09-03',
                    sellerReply: null
                },
                {
                    id: 2,
                    productName: '고급 쌀',
                    buyerName: '구매자2',
                    rating: 4,
                    content: '품질이 좋네요. 다음에도 주문할 예정입니다.',
                    reviewDate: '2025-09-02',
                    sellerReply: '감사합니다! 더 좋은 상품으로 보답하겠습니다.'
                }
            ];
            setReviews(dummyReviews);
            setFilteredReviews(dummyReviews);
            
        } catch (error) {
            console.error('리뷰 목록 조회 오류:', error);
            setMessage('리뷰 목록 조회 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 리뷰 답변 작성
    const handleReply = async () => {
        if (!replyModal.replyText.trim()) {
            setMessage('답변 내용을 입력해주세요.');
            return;
        }

        try {
            setLoading(true);
            setMessage('');

            // 실제 API 호출 시도
            try {
                const response = await fetch(`http://localhost:8080/api/reviews/${replyModal.reviewId}/reply`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        sellerReply: replyModal.replyText
                    })
                });

                if (response.ok) {
                    setMessage('리뷰 답변이 성공적으로 작성되었습니다! ✨');
                } else {
                    throw new Error('API 호출 실패');
                }
            } catch (apiError) {
                console.log('API 호출 실패, 로컬 상태 업데이트:', apiError);
                setMessage('리뷰 답변이 성공적으로 작성되었습니다! ✨ (시뮬레이션 모드)');
            }
            
            // 로컬 상태 업데이트 (API 성공/실패 관계없이)
            setReviews(prevReviews => 
                prevReviews.map(review => 
                    review.id === replyModal.reviewId 
                        ? { 
                            ...review, 
                            sellerReply: replyModal.replyText,
                            replyDate: new Date().toLocaleDateString('ko-KR'),
                            status: '답변완료'
                        }
                        : review
                )
            );
            
            // 필터링된 리뷰도 업데이트
            setFilteredReviews(prevReviews => 
                prevReviews.map(review => 
                    review.id === replyModal.reviewId 
                        ? { 
                            ...review, 
                            sellerReply: replyModal.replyText,
                            replyDate: new Date().toLocaleDateString('ko-KR'),
                            status: '답변완료'
                        }
                        : review
                )
            );
            
            // 모달 닫기
            setReplyModal({ show: false, reviewId: null, replyText: '' });
            
            setTimeout(() => {
                setMessage('');
            }, 3000);
            
        } catch (error) {
            console.error('리뷰 답변 작성 오류:', error);
            setMessage('리뷰 답변 작성 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 답변 모달 열기
    const openReplyModal = (reviewId) => {
        setReplyModal({ show: true, reviewId, replyText: '' });
    };

    // 답변 모달 닫기
    const closeReplyModal = () => {
        setReplyModal({ show: false, reviewId: null, replyText: '' });
    };

    // 탭 변경 시 리뷰 필터링
    useEffect(() => {
        if (activeTab === 'all') {
            setFilteredReviews(reviews);
        } else if (activeTab === 'unanswered') {
            const filtered = reviews.filter(review => review.status === '답변대기');
            setFilteredReviews(filtered);
        } else {
            const ratingMap = {
                'positive': 4,
                'neutral': 3,
                'negative': 2
            };
            const minRating = ratingMap[activeTab];
            const filtered = reviews.filter(review => review.rating >= minRating);
            setFilteredReviews(filtered);
        }
    }, [activeTab, reviews]);

    // 컴포넌트 마운트 시 리뷰 목록 가져오기
    useEffect(() => {
        fetchReviews();
    }, [userId]);

    const reviewStats = {
        total: reviews.length,
        positive: reviews.filter(r => r.rating >= 4).length,
        neutral: reviews.filter(r => r.rating === 3).length,
        negative: reviews.filter(r => r.rating <= 2).length,
        unanswered: reviews.filter(r => r.status === '답변대기').length,
        averageRating: reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '0.0'
    };

    const getRatingStars = (rating) => {
        return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
    };

    const getRatingColor = (rating) => {
        if (rating >= 4) return '#27ae60';
        if (rating === 3) return '#f39c12';
        return '#e74c3c';
    };

    // 리뷰 정렬 기능
    const [sortBy, setSortBy] = useState('date'); // date, rating, status
    const [sortOrder, setSortOrder] = useState('desc'); // asc, desc

    const sortReviews = (reviewsToSort) => {
        return [...reviewsToSort].sort((a, b) => {
            let comparison = 0;
            
            switch (sortBy) {
                case 'date':
                    comparison = new Date(a.reviewDate) - new Date(b.reviewDate);
                    break;
                case 'rating':
                    comparison = a.rating - b.rating;
                    break;
                case 'status':
                    comparison = a.status.localeCompare(b.status);
                    break;
                default:
                    comparison = 0;
            }
            
            return sortOrder === 'asc' ? comparison : -comparison;
        });
    };

    // 검색 기능
    const [searchTerm, setSearchTerm] = useState('');

    const searchReviews = (reviewsToSearch) => {
        if (!searchTerm.trim()) return reviewsToSearch;
        
        return reviewsToSearch.filter(review => 
            review.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            review.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            review.content.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    // 필터링된 리뷰 업데이트
    useEffect(() => {
        let filtered = reviews;

        // 탭별 필터링
        if (activeTab === 'all') {
            filtered = reviews;
        } else if (activeTab === 'unanswered') {
            filtered = reviews.filter(review => review.status === '답변대기');
        } else {
            const ratingMap = {
                'positive': 4,
                'neutral': 3,
                'negative': 2
            };
            const minRating = ratingMap[activeTab];
            filtered = reviews.filter(review => review.rating >= minRating);
        }

        // 검색 필터링
        filtered = searchReviews(filtered);

        // 정렬
        filtered = sortReviews(filtered);

        setFilteredReviews(filtered);
    }, [activeTab, reviews, searchTerm, sortBy, sortOrder]);

    // 빠른 액션 처리
    const handleQuickAction = (action) => {
        switch (action) {
            case 'reply':
                setMessage('답변 작성 기능을 사용하세요!');
                break;
            case 'analyze':
                setMessage(`리뷰 분석: 전체 ${reviewStats.total}개, 평균 ${reviewStats.averageRating}점, 답변대기 ${reviewStats.unanswered}개`);
                break;
            case 'manage':
                setMessage('리뷰 관리: 필터링과 정렬 기능을 활용하세요!');
                break;
            case 'improve':
                setMessage('품질 개선: 부정적 리뷰를 확인하고 개선점을 찾아보세요!');
                break;
            case 'report':
                setMessage(`성과 보고: 긍정적 리뷰 ${reviewStats.positive}개, 중립 ${reviewStats.neutral}개, 부정적 ${reviewStats.negative}개`);
                break;
            default:
                setMessage('알 수 없는 액션입니다.');
        }
        
        setTimeout(() => setMessage(''), 3000);
    };

    // 리뷰 삭제 기능 (관리자용)
    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm('정말로 이 리뷰를 삭제하시겠습니까?')) {
            return;
        }

        try {
            setLoading(true);
            
            // 실제 API 호출 시도
            try {
                const response = await fetch(`http://localhost:8080/api/reviews/${reviewId}`, {
                    method: 'DELETE',
                    credentials: 'include'
                });

                if (response.ok) {
                    setMessage('리뷰가 성공적으로 삭제되었습니다.');
                } else {
                    throw new Error('API 호출 실패');
                }
            } catch (apiError) {
                console.log('API 호출 실패, 로컬 상태 업데이트:', apiError);
                setMessage('리뷰가 성공적으로 삭제되었습니다. (시뮬레이션 모드)');
            }
            
            // 로컬 상태에서 제거
            setReviews(prevReviews => prevReviews.filter(review => review.id !== reviewId));
            
            setTimeout(() => setMessage(''), 3000);
            
        } catch (error) {
            console.error('리뷰 삭제 오류:', error);
            setMessage('리뷰 삭제 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 리뷰 신고 기능
    const handleReportReview = (reviewId) => {
        const reason = prompt('신고 사유를 입력하세요:');
        if (reason && reason.trim()) {
            setMessage(`리뷰가 신고되었습니다. 사유: ${reason}`);
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const getStatusColor = (status) => {
        return status === '답변완료' ? '#27ae60' : '#e74c3c';
    };

    return (
        <div className="reviews-container">
            {/* 헤더 */}
            <div className="header">
                <h1>⭐ 리뷰 확인</h1>
                <p>고객들의 소중한 리뷰를 확인하고 답변하세요</p>
            </div>

            {/* 검색 및 정렬 컨트롤 */}
            <div className="controls-container">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="상품명, 구매자명, 리뷰 내용으로 검색..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <span className="search-icon">🔍</span>
                </div>
                
                <div className="sort-controls">
                    <select 
                        value={sortBy} 
                        onChange={(e) => setSortBy(e.target.value)}
                        className="sort-select"
                    >
                        <option value="date">날짜순</option>
                        <option value="rating">평점순</option>
                        <option value="status">상태순</option>
                    </select>
                    
                    <button 
                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                        className="sort-order-btn"
                        title={sortOrder === 'asc' ? '오름차순' : '내림차순'}
                    >
                        {sortOrder === 'asc' ? '↑' : '↓'}
                    </button>
                </div>
            </div>

            {/* 탭 메뉴 */}
            <div className="tab-container">
                <div className="tabs">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <span className="tab-icon">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* 빠른 액션 카드 */}
            <div className="quick-actions">
                {quickActions.map((action, index) => (
                    <button 
                        key={index} 
                        className="quick-action-card" 
                        onClick={() => handleQuickAction(action.action)}
                    >
                        <div className="action-icon">{action.icon}</div>
                        <div className="action-label">{action.label}</div>
                    </button>
                ))}
            </div>

            {/* 메시지 표시 */}
            {message && (
                <div className={`message ${message.includes('성공') || message.includes('작성') ? 'success' : 'info'}`}>
                    {message}
                </div>
            )}

            {/* 리뷰 통계 요약 */}
            <div className="review-stats">
                <h3>📊 리뷰 통계</h3>
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon">⭐</div>
                        <div className="stat-number">{reviewStats.total}</div>
                        <div className="stat-label">전체 리뷰</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">😊</div>
                        <div className="stat-number">{reviewStats.positive}</div>
                        <div className="stat-label">긍정적</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">😐</div>
                        <div className="stat-number">{reviewStats.neutral}</div>
                        <div className="stat-label">보통</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">😞</div>
                        <div className="stat-number">{reviewStats.negative}</div>
                        <div className="stat-label">부정적</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">❓</div>
                        <div className="stat-number">{reviewStats.unanswered}</div>
                        <div className="stat-label">답변대기</div>
                    </div>
                    <div className="stat-card highlight">
                        <div className="stat-icon">📈</div>
                        <div className="stat-number">{reviewStats.averageRating}</div>
                        <div className="stat-label">평균 평점</div>
                    </div>
                </div>
            </div>

            {/* 리뷰 목록 */}
            <div className="reviews-section">
                <div className="section-header">
                    <h3>🥩 고객 리뷰</h3>
                    <div className="header-actions">
                        <button className="export-btn" onClick={() => setMessage('내보내기 기능은 준비 중입니다.')}>
                            📊 내보내기
                        </button>
                        <button className="refresh-btn" onClick={fetchReviews} disabled={loading}>
                            🔄 새로고침
                        </button>
                    </div>
                </div>
                
                {loading ? (
                    <div className="loading">리뷰 목록을 불러오는 중...</div>
                ) : filteredReviews.length === 0 ? (
                    <div className="no-reviews">
                        {activeTab === 'all' ? '등록된 리뷰가 없습니다.' : `${tabs.find(t => t.id === activeTab)?.label} 리뷰가 없습니다.`}
                    </div>
                ) : (
                    <div className="reviews-grid">
                        {filteredReviews.map((review, index) => (
                            <div key={index} className="review-card">
                                <div className="review-header">
                                    <div className="review-info">
                                        <span className="review-number">{review.id}</span>
                                        <span className="review-date">{review.reviewDate || review.date}</span>
                                    </div>
                                    <div 
                                        className="review-status"
                                        style={{ backgroundColor: getStatusColor(review.status) }}
                                    >
                                        {review.status === '답변완료' ? '✅ 답변완료' : '❓ 답변대기'}
                                    </div>
                                </div>
                                
                                <div className="review-content">
                                    <div className="customer-info">
                                        <p><strong>고객명:</strong> {review.buyerName || review.customer}</p>
                                        <p><strong>상품:</strong> {review.productName || review.product}</p>
                                    </div>
                                    
                                    <div className="rating-section">
                                        <div className="rating-stars">
                                            {getRatingStars(review.rating)}
                                        </div>
                                        <div 
                                            className="rating-number"
                                            style={{ color: getRatingColor(review.rating) }}
                                        >
                                            {review.rating}/5
                                        </div>
                                    </div>
                                    
                                    <div className="review-text">
                                        <h4 className="review-title">{review.title}</h4>
                                        <p className="review-content-text">{review.content}</p>
                                    </div>
                                    
                                    {review.sellerReply && (
                                        <div className="reply-section">
                                            <h5>📝 판매자 답변</h5>
                                            <p className="reply-text">{review.sellerReply}</p>
                                            <span className="reply-date">{review.replyDate}</span>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="review-actions">
                                    {review.status === '답변대기' ? (
                                        <button 
                                            className="action-btn primary"
                                            onClick={() => openReplyModal(review.id)}
                                            disabled={loading}
                                        >
                                            💬 답변 작성
                                        </button>
                                    ) : (
                                        <button 
                                            className="action-btn secondary"
                                            onClick={() => openReplyModal(review.id)}
                                        >
                                            ✏️ 답변 수정
                                        </button>
                                    )}
                                    
                                    <button 
                                        className="action-btn info"
                                        onClick={() => setMessage(`리뷰 상세: ${review.productName} - ${review.buyerName}님의 ${review.rating}점 리뷰`)}
                                    >
                                        👁️ 상세보기
                                    </button>
                                    
                                    <button 
                                        className="action-btn warning"
                                        onClick={() => handleReportReview(review.id)}
                                    >
                                        🚨 신고
                                    </button>
                                    
                                    <button 
                                        className="action-btn danger"
                                        onClick={() => handleDeleteReview(review.id)}
                                    >
                                        🗑️ 삭제
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* 답변 작성 모달 */}
            {replyModal.show && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>💬 리뷰 답변 작성</h3>
                            <button className="modal-close" onClick={closeReplyModal}>×</button>
                        </div>
                        <div className="modal-body">
                            <textarea
                                value={replyModal.replyText}
                                onChange={(e) => setReplyModal(prev => ({ ...prev, replyText: e.target.value }))}
                                placeholder="고객님의 리뷰에 대한 답변을 작성해주세요..."
                                rows="4"
                                className="reply-textarea"
                            />
                        </div>
                        <div className="modal-footer">
                            <button className="modal-btn cancel" onClick={closeReplyModal}>
                                취소
                            </button>
                            <button 
                                className="modal-btn submit" 
                                onClick={handleReply}
                                disabled={loading || !replyModal.replyText.trim()}
                            >
                                {loading ? '작성 중...' : '답변 작성'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reviews;


