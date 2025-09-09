import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuctionData } from './useAuctionData';
import './Auction.css';

function PastAuctions() {
    const [currentPage, setCurrentPage] = useState(0);
    const [filter, setFilter] = useState('');

    const { data, loading, totalPages } = useAuctionData(filter, 'off', currentPage);

    
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
        setCurrentPage(0);
    };

    if (loading) return <div>로딩 중..</div>;
    if (!data || data.length === 0) return <div>종료된 경매 데이터가 없습니다.</div>;

    return (
        <div className='auction-main-container'>
            <h1>종료된 경매 목록</h1>
            <p>마감된 다양한 축산물 경매 품목을 확인하세요</p>
            
            <div className='filter-buttons'>
                <button
                    onClick={() => handleFilterChange('')}
                    className={filter === '' ? 'active' : ''}
                >
                    전체
                </button>
                <button
                    onClick={() => handleFilterChange('beef')}
                    className={filter === 'beef' ? 'active' : ''}
                >
                    소
                </button>
                <button
                    onClick={() => handleFilterChange('pork')}
                    className={filter === 'pork' ? 'active' : ''}
                >
                    돼지
                </button>
            </div>
            {/* 경매 아이템 목록 */}
            <div className="auctions">
                {
                    data.map(item => (
                        
                        <Link to={`/auction/off/${item.auctionId}`} key={item.auctionId}>
                            <div className='auction-item past'>
                                {item.images && item.images.length > 0 && (
                                    <img src={item.images[0].imageUrl} alt={item.title} />
                                )}
                                <div className='auction-item-box'>
                                    <div>{item.userName}</div>
                                    <h3>{item.title}</h3>
                                    <div className='auction-item-wt-grade'>
                                        <span className='weight'>{item.weight}</span>
                                        <p className='grade'>{item.grade} 등급</p>
                                    </div>
                                    
                                    <div className='auction-time'>
                                        경매 종료
                                    </div>
                                    <div className='auction-price-info'>
                                        <span className='auction-prices'>낙찰가</span>
                                        <span className='current-bid-price'>{item.currentBidPrice.toLocaleString('ko-KR')}원</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))
                }
            </div>
            {/* 페이지네이션 */}
            <div className="auction-pagination">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        onClick={() => handlePageChange(index)}
                        className={currentPage === index ? 'active' : ''}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default PastAuctions;