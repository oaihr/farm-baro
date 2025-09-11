import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './Auction.css';
import useRemainingTime from '../common/RemainigTime';
import { useAuctionData } from './useAuctionData';
import noSearch from '../../images/no_search_keyword.png';

function Auction(){

    const [currentPage, setCurrentPage] = useState(0);
    const [filter, setFilter] = useState('');
    
    const { data, loading, totalPages } = useAuctionData(filter, 'on', currentPage);    
    
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
        setCurrentPage(0);
    };

    if (loading) return <div>로딩 중..</div>;
    if (!data || data.length === 0) {
        return (<div>데이터가 없습니다. <img src={noSearch} alt="No search results" /> </div>)
    }
    return(
        <div className='auction-main-container'>
            <h1>경매 목록</h1>
            <p>다양한 축산물 경매 품목을 확인하세요</p>
            {/* <pre>{JSON.stringify(data, null, 2)}</pre>             */}
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
            <div className="auctions">
            {
                data.map(item => (
                    <Link to={`/auction/${item.auctionId}`} key={item.auctionId}>
                        <div className='auction-item'>
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
                                    <RemainingTimeDisplay endDate={item.endDate} />
                                </div>                                 
                                <div className='auction-price-info'>
                                    <span className='auction-prices'>현재입찰가</span>
                                    <span className='current-bid-price'>{item.currentBidPrice.toLocaleString('ko-KR')}원</span>
                                </div>
                                   
                            </div>
                        </div>
                    </Link>   
                ))
            }
            </div>
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

function RemainingTimeDisplay({ endDate }) {
    const timeLeft = useRemainingTime(endDate);
    return <div>{timeLeft}</div>;
}

export default Auction;