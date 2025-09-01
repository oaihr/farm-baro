import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './Auction.css';

function Auction(){

    
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [filter, setFilter] = useState('');

    useEffect(()=>{
        const fetchData = async()=>{
            setLoading(true);
            try{
                const response = await axios.get(`http://localhost:8080/api/auction?page=${currentPage}`+
                                                    (filter !== '' ? `&kind=${filter}` : ''));
                setData(response.data.content);
                setTotalPages(response.data.totalPages);

            } catch(e) {
                console.error("API 호출 실패:", e);
                setData([]);
            }
            setLoading(false);
        };

        fetchData();
        
    }, [currentPage, filter]);
    
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
        setCurrentPage(0);
    };

    if (loading) return <div>로딩 중..</div>;
    if (!data || data.length === 0) return <div>데이터가 없습니다.</div>;

    return(
        <div className='auction-main-container'>
            <h1>경매</h1>
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
                            <div className='auction-item-info'>
                                <div>{item.userName}</div>
                                <h3>{item.description}</h3>
                                <div className='auction-item-wt-grade'>
                                    <span className='weight'>{item.weight}</span>
                                    <p className='grade'>{item.grade} 등급</p>
                                </div>
                                <div className='auction-price-info'>
                                    <span className='auction-prices'>시작가</span>
                                    <span>{item.initialPrice.toLocaleString('ko-KR')}원</span>
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
            <div className="pagination">
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

export default Auction;