import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ReviewList.css';

function ReviewList({ saleId }) {

    const [reviews, setReviews] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const reviewsPerPage = 10;

    const [expandedReviewId, setExpandedReviewId] = useState(null);

    const [detailedReview, setDetailedReview] = useState(null);
    const [isLoadingDetail, setIsLoadingDetail] = useState(false); 

    useEffect(() => {
        
        if (saleId) {
            const fetchReviews = async () => {
                try {
                    
                    const response = await axios.get(`/api/reviews?saleId=${saleId}&page=${currentPage - 1}&size=${reviewsPerPage}`);

                    // API 응답의 유효성을 확인하고 content와 totalPages를 추출
                    if (response.data && response.data.content) {
                        setReviews(response.data.content);
                        setTotalPages(response.data.totalPages);
                    } else {
                        
                        setReviews([]);
                        setTotalPages(0);
                    }

                } catch (error) {
                    console.error("리뷰 데이터를 불러오는 데 실패했습니다.", error);
                    // 오류 발생 시에도 빈 배열로 설정하여 렌더링 오류를 방지
                    setReviews([]);
                    setTotalPages(0);
                }
            };

            fetchReviews();
        }
    }, [currentPage, saleId]);

    const paginate = (pageNumber) => { setCurrentPage(pageNumber); setExpandedReviewId(null); };

    const handleWriteClick = () => {
        // `alert()` 사용은 좋지 않습니다. 사용자 정의 모달을 사용하세요.
        alert('리뷰 작성 버튼 클릭!');
    };

    const handleRowClick = async (reviewId) => {
        // 이미 확장된 리뷰를 다시 클릭하면 닫음
        if (expandedReviewId === reviewId) {
            setExpandedReviewId(null);
            setDetailedReview(null);
            return;
        }
        
        // 새로운 리뷰를 클릭하면 로딩 시작
        setIsLoadingDetail(true);
        setExpandedReviewId(reviewId);

        try {
            // 개별 리뷰 정보를 가져오는 API 호출
            const response = await axios.get(`/api/review/${reviewId}`);
            setDetailedReview(response.data);
        } catch (error) {
            console.error(`리뷰 ID ${reviewId}의 상세 정보를 불러오는 데 실패했습니다.`, error);
            setDetailedReview(null);
        } finally {
            setIsLoadingDetail(false);
        }
    };

    // reviews가 null일 때 로딩 상태를 보여줌
    if (reviews === null) {
        return <div className="loading">리뷰를 불러오는 중입니다...</div>;
    }

    return (
        <div className="review-container">
            <div className="review-header">
                <h2>REVIEW</h2>
                <div className="review-buttons">
                    <button onClick={handleWriteClick} className="btn-write">리뷰쓰기</button>
                </div>
            </div>

            <div className="review-table-container">
                <table className="review-table">
                    <colgroup>
                        <col style={{ width: '10%' }} /> {/* 번호 */}
                        <col style={{ width: '20%' }} /> {/* 별점 */}
                        <col style={{ width: '30%' }} /> {/* 제목 */}
                        <col style={{ width: '16%' }} /> {/* 작성자 */}
                        <col style={{ width: '16%' }} /> {/* 작성일 */}
                        <col style={{ width: '8%' }} />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>번호</th>
                            <th>별점</th>
                            <th>제목</th>
                            <th>작성자</th>
                            <th>작성일</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* reviews가 배열이고, length 속성이 존재하는지 확인 */}
                        {reviews.length > 0 ? (
                            reviews.map((review, index) => (
                                <React.Fragment key={review.reviewId || index}>
                                    <tr onClick={() => handleRowClick(review.reviewId)} className="expandable-row">
                                        <td>{(currentPage - 1) * reviewsPerPage + index + 1}</td>
                                        <td className="star-rating">
                                            {/* rating 값에 따라 별 */}
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i} className="star">
                                                    {i < review.rating ? '★' : '☆'}
                                                </span>
                                            ))}
                                        </td>
                                        <td className="review-title">{review.title}</td>
                                        <td>{review.userName}</td>
                                        <td>
                                            {(() => {
                                                const year = review.updatedTime[0];
                                                const month = review.updatedTime[1];
                                                const day = review.updatedTime[2];
                                                // const hour = review.updatedTime[3];
                                                // const minute = review.updatedTime[4];
                                                // const second = review.updatedTime[5];

                                                const formattedMonth = String(month).padStart(2, '0');
                                                const formattedDay = String(day).padStart(2, '0');
                                                // const formattedHour = String(hour).padStart(2, '0');
                                                // const formattedMinute = String(minute).padStart(2, '0');
                                                // const formattedSecond = String(second).padStart(2, '0');

                                                return `${year}-${formattedMonth}-${formattedDay}`;
                                            })()}
                                        </td>
                                        <td>
                                            <div className='report-box'>
                                                <img src="/images/report.png" /><button className='report-box-btn'>신고</button>
                                            </div>
                                        </td>
                                    </tr>
                                    {/* 상세 내용 */}
                                    {expandedReviewId === review.reviewId && (
                                        <tr className="expanded-content-row">
                                            <td colSpan="5">
                                                <div className="expanded-content-container">
                                                    {isLoadingDetail ? (
                                                        <p>상세 정보를 불러오는 중입니다...</p>
                                                    ) : detailedReview ? (
                                                        <>                                                            
                                                            {/* 상세 리뷰 이미지 */}
                                                            {Array.isArray(detailedReview.images) && detailedReview.images.length > 0 && (
                                                                <div className="review-images-container">
                                                                    {detailedReview.images.map((image, i) => (
                                                                        <img
                                                                            key={i}
                                                                            src={image.imageUrl}
                                                                            alt={`리뷰 이미지 ${i + 1}`}
                                                                            className="review-image"
                                                                        />
                                                                    ))}
                                                                </div>
                                                            )}
                                                            <p>{detailedReview.reviewComment}</p>

                                                            {detailedReview.sellerComment && (
                                                                <div className="admin-reply-container">
                                                                    <div className="admin-reply-header">
                                                                        <span className="admin-name">판매자</span>
                                                                        <span className="admin-date">
                                                                            {(() => {
                                                                                const updatedTime = detailedReview.updatedTime;
                                                                                if (!updatedTime || updatedTime.length < 3) return '';
                                                                                const year = updatedTime[0];
                                                                                const month = String(updatedTime[1]).padStart(2, '0');
                                                                                const day = String(updatedTime[2]).padStart(2, '0');
                                                                                return `${year}-${month}-${day}`;
                                                                            })()}
                                                                        </span>
                                                                    </div>
                                                                    <p className="admin-comment">{detailedReview.sellerComment}</p>
                                                                </div>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <p>리뷰 상세 정보를 찾을 수 없습니다.</p>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="no-reviews">작성된 리뷰가 없습니다.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="review-pagination">
                    <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                        &lt;&lt;
                    </button>
                    <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                        &lt;
                    </button>

                    {[...Array(totalPages)].map((_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => paginate(index + 1)}
                            className={currentPage === index + 1 ? 'active' : ''}
                        >
                            {index + 1}
                        </button>
                    ))}

                    <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
                        &gt;
                    </button>
                    <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
                        &gt;&gt;
                    </button>
                </div>
            )}
        </div>
    );
}

export default ReviewList;