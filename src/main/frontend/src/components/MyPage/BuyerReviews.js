import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './BuyerReviews.css';

const BuyerReviews = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [editingReview, setEditingReview] = useState(null);
    const [editForm, setEditForm] = useState({
        rating: 5,
        content: '',
        title: ''
    });

    // 리뷰 목록 가져오기
    const fetchReviews = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/mypage/api/buyers/${userId}/reviews`);
            if (response.ok) {
                const data = await response.json();
                setReviews(data);
            } else {
                console.error('리뷰 목록 조회 실패');
                setMessage('리뷰 목록을 불러오는데 실패했습니다.');
            }
        } catch (error) {
            console.error('리뷰 목록 조회 오류:', error);
            setMessage('리뷰 목록 조회 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [userId]);

    // 리뷰 수정 시작
    const startEdit = (review) => {
        setEditingReview(review);
        setEditForm({
            rating: review.rating || 5,
            content: review.content || '',
            title: review.title || ''
        });
    };

    // 리뷰 수정 취소
    const cancelEdit = () => {
        setEditingReview(null);
        setEditForm({
            rating: 5,
            content: '',
            title: ''
        });
    };

    // 리뷰 수정 처리
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        
        if (!editForm.content.trim()) {
            setMessage('리뷰 내용을 입력해주세요.');
            return;
        }

        try {
            const response = await fetch(`/api/mypage/api/reviews/${editingReview.reviewId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editForm)
            });

            if (response.ok) {
                setMessage('리뷰가 성공적으로 수정되었습니다! ✨');
                setEditingReview(null);
                setEditForm({
                    rating: 5,
                    content: '',
                    title: ''
                });
                fetchReviews(); // 리뷰 목록 새로고침
            } else {
                setMessage('리뷰 수정에 실패했습니다.');
            }
        } catch (error) {
            console.error('리뷰 수정 오류:', error);
            setMessage('리뷰 수정 중 오류가 발생했습니다.');
        }
    };

    // 리뷰 삭제
    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm('정말로 이 리뷰를 삭제하시겠습니까?')) {
            return;
        }

        try {
            const response = await fetch(`/api/mypage/api/reviews/${reviewId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setMessage('리뷰가 성공적으로 삭제되었습니다.');
                fetchReviews(); // 리뷰 목록 새로고침
            } else {
                setMessage('리뷰 삭제에 실패했습니다.');
            }
        } catch (error) {
            console.error('리뷰 삭제 오류:', error);
            setMessage('리뷰 삭제 중 오류가 발생했습니다.');
        }
    };

    // 별점 표시 컴포넌트
    const StarRating = ({ rating, readonly = false, onChange }) => {
        return (
            <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        className={`star ${star <= rating ? 'filled' : ''}`}
                        onClick={() => !readonly && onChange(star)}
                        style={{ cursor: readonly ? 'default' : 'pointer' }}
                    >
                        {star <= rating ? '★' : '☆'}
                    </span>
                ))}
            </div>
        );
    };

    if (loading) {
        return <div className="loading">리뷰 내역을 불러오는 중...</div>;
    }

    return (
        <div className="buyer-reviews-container">
            {/* 헤더 */}
            <div className="header">
                <h1>⭐ 리뷰 관리</h1>
                <p>작성한 리뷰를 관리하고 수정하세요</p>
            </div>

            {/* 메시지 표시 */}
            {message && (
                <div className={`message ${message.includes('성공') ? 'success' : 'error'}`}>
                    {message}
                </div>
            )}

            {/* 리뷰 통계 */}
            <div className="reviews-summary">
                <div className="summary-stats">
                    <div className="stat-item">
                        <div className="stat-number">{reviews.length}</div>
                        <div className="stat-label">총 리뷰</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">
                            {reviews.length > 0 
                                ? (reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / reviews.length).toFixed(1)
                                : 0
                            }
                        </div>
                        <div className="stat-label">평균 평점</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">
                            {reviews.filter(review => review.rating === 5).length}
                        </div>
                        <div className="stat-label">5점 리뷰</div>
                    </div>
                </div>
            </div>

            {/* 리뷰 목록 */}
            <div className="reviews-section">
                <h3>📝 작성한 리뷰</h3>
                
                {reviews.length === 0 ? (
                    <div className="no-reviews">
                        <div className="no-reviews-icon">⭐</div>
                        <h4>작성한 리뷰가 없습니다</h4>
                        <p>상품 후기를 남겨보세요!</p>
                        <button 
                            className="shop-now-btn"
                            onClick={() => navigate('/')}
                        >
                            쇼핑하러 가기
                        </button>
                    </div>
                ) : (
                    <div className="reviews-list">
                        {reviews.map((review, index) => (
                            <div key={review.reviewId || index} className="review-card">
                                {editingReview?.reviewId === review.reviewId ? (
                                    // 수정 모드
                                    <form onSubmit={handleEditSubmit} className="edit-form">
                                        <div className="edit-header">
                                            <h4>리뷰 수정</h4>
                                            <div className="edit-actions">
                                                <button type="submit" className="save-btn">
                                                    💾 저장
                                                </button>
                                                <button 
                                                    type="button" 
                                                    className="cancel-btn"
                                                    onClick={cancelEdit}
                                                >
                                                    ❌ 취소
                                                </button>
                                            </div>
                                        </div>
                                        
                                        <div className="form-group">
                                            <label>제목</label>
                                            <input
                                                type="text"
                                                value={editForm.title}
                                                onChange={(e) => setEditForm(prev => ({
                                                    ...prev,
                                                    title: e.target.value
                                                }))}
                                                placeholder="리뷰 제목을 입력하세요"
                                            />
                                        </div>
                                        
                                        <div className="form-group">
                                            <label>평점</label>
                                            <StarRating 
                                                rating={editForm.rating}
                                                onChange={(rating) => setEditForm(prev => ({
                                                    ...prev,
                                                    rating
                                                }))}
                                            />
                                        </div>
                                        
                                        <div className="form-group">
                                            <label>내용</label>
                                            <textarea
                                                value={editForm.content}
                                                onChange={(e) => setEditForm(prev => ({
                                                    ...prev,
                                                    content: e.target.value
                                                }))}
                                                placeholder="리뷰 내용을 입력하세요"
                                                rows="4"
                                                required
                                            />
                                        </div>
                                    </form>
                                ) : (
                                    // 표시 모드
                                    <>
                                        <div className="review-header">
                                            <div className="review-info">
                                                <h4>{review.title || '제목 없음'}</h4>
                                                <p className="review-date">
                                                    작성일: {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : '날짜 정보 없음'}
                                                </p>
                                            </div>
                                            <div className="review-rating">
                                                <StarRating rating={review.rating || 0} readonly />
                                                <span className="rating-text">{review.rating || 0}점</span>
                                            </div>
                                        </div>

                                        <div className="product-info">
                                            <div className="product-image">
                                                {review.productImageUrl ? (
                                                    <img src={review.productImageUrl} alt={review.productName} />
                                                ) : (
                                                    <div className="placeholder-image">📦</div>
                                                )}
                                            </div>
                                            <div className="product-details">
                                                <h5>{review.productName || '상품명 없음'}</h5>
                                                <p className="product-category">
                                                    {review.productCategory || '카테고리 정보 없음'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="review-content">
                                            <p>{review.content || '리뷰 내용이 없습니다.'}</p>
                                        </div>

                                        {review.reply && (
                                            <div className="seller-reply">
                                                <h6>💬 판매자 답글</h6>
                                                <p>{review.reply}</p>
                                                <small className="reply-date">
                                                    {review.replyDate ? new Date(review.replyDate).toLocaleDateString() : ''}
                                                </small>
                                            </div>
                                        )}

                                        <div className="review-actions">
                                            <button 
                                                className="edit-btn"
                                                onClick={() => startEdit(review)}
                                            >
                                                ✏️ 수정
                                            </button>
                                            <button 
                                                className="delete-btn"
                                                onClick={() => handleDeleteReview(review.reviewId)}
                                            >
                                                🗑️ 삭제
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* 리뷰 작성 가이드 */}
            <div className="review-guide">
                <h3>📝 리뷰 작성 가이드</h3>
                <div className="guide-content">
                    <div className="guide-item">
                        <div className="guide-icon">⭐</div>
                        <div className="guide-text">
                            <h4>정확한 평점</h4>
                            <p>상품의 품질과 서비스에 맞는 정확한 평점을 매겨주세요.</p>
                        </div>
                    </div>
                    <div className="guide-item">
                        <div className="guide-icon">📝</div>
                        <div className="guide-text">
                            <h4>구체적인 내용</h4>
                            <p>상품의 장단점과 사용 경험을 구체적으로 작성해주세요.</p>
                        </div>
                    </div>
                    <div className="guide-item">
                        <div className="guide-icon">📸</div>
                        <div className="guide-text">
                            <h4>사진 첨부</h4>
                            <p>가능하다면 상품 사진을 함께 첨부해주세요.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BuyerReviews;
