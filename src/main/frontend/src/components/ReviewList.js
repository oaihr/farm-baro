import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ReviewList.css';

function ReviewList({ saleId }) {
    // reviews 상태의 초기값을 null로 설정하여 로딩 상태를 명확하게 관리합니다.
    const [reviews, setReviews] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0); 
    const reviewsPerPage = 10;

    useEffect(() => {
        // saleId가 유효할 때만 API 호출 함수를 실행합니다.
        if (saleId) {
            const fetchReviews = async () => {
                try {
                    // API 호출 시 페이지 번호를 0부터 시작하도록 -1을 해줍니다.
                    const response = await axios.get(`/api/reviews?saleId=${saleId}&page=${currentPage - 1}&size=${reviewsPerPage}`);
                    
                    // API 응답의 유효성을 확인하고 content와 totalPages를 추출합니다.
                    if (response.data && response.data.content) {
                        setReviews(response.data.content); 
                        setTotalPages(response.data.totalPages); 
                    } else {
                        // 응답이 유효하지 않으면 빈 배열로 설정하여 오류를 방지합니다.
                        setReviews([]);
                        setTotalPages(0);
                    }
                    
                } catch (error) {
                    console.error("리뷰 데이터를 불러오는 데 실패했습니다.", error);
                    // 오류 발생 시에도 빈 배열로 설정하여 렌더링 오류를 방지합니다.
                    setReviews([]);
                    setTotalPages(0);
                }
            };

            fetchReviews();
        }
    }, [currentPage, saleId]); 

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleWriteClick = () => {
        // `alert()` 사용은 좋지 않습니다. 사용자 정의 모달을 사용하세요.
        alert('리뷰 작성 버튼 클릭!');
    };

    // reviews가 null일 때 로딩 상태를 보여줍니다.
    if (reviews === null) {
        return <div className="loading">리뷰를 불러오는 중입니다...</div>;
    }

    return (
        <div className="review-container">
            <div className="review-header">
                <h2>REVIEW</h2>
                <div className="review-buttons">
                    <button onClick={handleWriteClick} className="btn-write">WRITE</button>
                </div>
            </div>

            <div className="review-table-container">
                <table className="review-table">
                    <thead>
                        <tr>
                            <th>번호</th>
                            <th>제목</th>
                            <th>작성자</th>
                            <th>작성일</th>
                            <th>조회</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* reviews가 배열이고, length 속성이 존재하는지 확인 */}
                        {reviews.length > 0 ? (
                            reviews.map((review, index) => {
                                // review 객체가 null이거나 undefined인지 먼저 확인
                                if (!review) {
                                    return null; // 유효하지 않은 요소는 렌더링하지 않음
                                }

                                return (
                                    <tr key={review.reviewId || index}>
                                        <td>{(currentPage - 1) * reviewsPerPage + index + 1}</td>
                                        <td className="review-title">{review.title}</td>
                                        <td>{review.userName}</td>
                                        <td>{review.updatedTime}</td>
                                        <td>{review.views}</td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="5" className="no-reviews">작성된 리뷰가 없습니다.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination: totalPages가 1보다 클 때만 표시합니다. */}
            {totalPages > 1 && ( 
                <div className="pagination">
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