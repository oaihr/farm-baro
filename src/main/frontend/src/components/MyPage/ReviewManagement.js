import React, { useState, useEffect } from 'react';
import './ReviewManagement.css';

const ReviewManagement = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState('');

    // 리뷰 목록 가져오기
    const fetchReviews = async () => {
        try {
            setLoading(true);
            
            // 실제 API 호출 시도 (현재는 구현되지 않음)
            try {
                const response = await fetch('/api/mypage/seller/reviews', {
                    credentials: 'include'
                });
                
                if (response.ok) {
                    const responseText = await response.text();
                    if (responseText && responseText !== 'error') {
                        try {
                            const data = JSON.parse(responseText);
                            setReviews(data);
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
                    productName: '소고기 등심 1++등급',
                    buyerName: '구매자1',
                    rating: 5,
                    content: '맛있었습니다.',
                    reviewDate: '2025-09-03',
                    sellerReply: null
                },
                {
                    id: 2,
                    productName: '돼지고기 삼겹살 1+등급',
                    buyerName: '구매자2',
                    rating: 4,
                    content: '맛있었습니다.',
                    reviewDate: '2025-09-02',
                    sellerReply: '감사합니다! 더 좋은 상품으로 보답하겠습니다.'
                }
            ];
            setReviews(dummyReviews);
            
        } catch (error) {
            console.error('리뷰 조회 오류:', error);
            setMessage('리뷰를 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    // 답글 작성
    const handleReply = async (reviewId) => {
        if (!replyText.trim()) {
            setMessage('답글 내용을 입력해주세요.');
            return;
        }

        try {
            // 임시 처리 (추후 API 연결)
            setReviews(prev => prev.map(review => 
                review.id === reviewId 
                    ? { ...review, sellerReply: replyText }
                    : review
            ));
            
            setMessage('답글이 성공적으로 작성되었습니다!');
            setReplyingTo(null);
            setReplyText('');
        } catch (error) {
            console.error('답글 작성 오류:', error);
            setMessage('답글 작성에 실패했습니다.');
        }
    };

    const getRatingStars = (rating) => {
        return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
    };

    return (
        <div className="review-management">
            <div className="header">
                <h2>⭐ 리뷰 확인</h2>
                <p>구매자들의 리뷰를 확인하고 답글을 작성하세요</p>
            </div>

            {message && (
                <div className={`message ${message.includes('성공') ? 'success' : 'info'}`}>
                    {message}
                </div>
            )}

            <div className="reviews-container">
                {loading ? (
                    <div className="loading">리뷰를 불러오는 중...</div>
                ) : reviews.length === 0 ? (
                    <div className="no-reviews">
                        <div className="no-reviews-icon">📝</div>
                        <h3>아직 리뷰가 없습니다</h3>
                        <p>상품을 판매하면 구매자들의 리뷰가 여기에 표시됩니다.</p>
                    </div>
                ) : (
                    <div className="reviews-list">
                        {reviews.map((review) => (
                            <div key={review.id} className="review-card">
                                <div className="review-header">
                                    <div className="review-info">
                                        <h4 className="product-name">{review.productName}</h4>
                                        <div className="reviewer-info">
                                            <span className="buyer-name">{review.buyerName}</span>
                                            <span className="review-date">{review.reviewDate}</span>
                                        </div>
                                    </div>
                                    <div className="rating">
                                        {getRatingStars(review.rating)}
                                        <span className="rating-number">({review.rating}/5)</span>
                                    </div>
                                </div>

                                <div className="review-content">
                                    <p>{review.content}</p>
                                </div>

                                {review.sellerReply ? (
                                    <div className="seller-reply">
                                        <div className="reply-header">
                                            <span className="reply-label">판매자 답글</span>
                                        </div>
                                        <div className="reply-content">
                                            <p>{review.sellerReply}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="reply-section">
                                        {replyingTo === review.id ? (
                                            <div className="reply-form">
                                                <textarea
                                                    value={replyText}
                                                    onChange={(e) => setReplyText(e.target.value)}
                                                    placeholder="구매자에게 답글을 작성하세요..."
                                                    rows="3"
                                                />
                                                <div className="reply-actions">
                                                    <button 
                                                        onClick={() => handleReply(review.id)}
                                                        className="reply-btn"
                                                    >
                                                        답글 작성
                                                    </button>
                                                    <button 
                                                        onClick={() => {
                                                            setReplyingTo(null);
                                                            setReplyText('');
                                                        }}
                                                        className="cancel-btn"
                                                    >
                                                        취소
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <button 
                                                onClick={() => setReplyingTo(review.id)}
                                                className="write-reply-btn"
                                            >
                                                답글 작성하기
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewManagement;
