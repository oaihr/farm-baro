import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import './Sale.css';
import noSearch from '../images/no_sales.png';

function Sale(){

    const { kind, part } = useParams();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const kindNames = useSelector(state => state.meat.kindNames);
    const partNames = useSelector(state => state.meat.partNames);

    const displayKind = kindNames[kind];
    const displayPart = partNames[part];

    useEffect(()=>{
        const fetchData = async()=>{
            setLoading(true);
            try{
                const response = await axios.get(`/api/sale/${kind}/${part}?page=${currentPage}`);
                setData(response.data.content);
                setTotalPages(response.data.totalPages);

            } catch(e) {
                console.error("API 호출 실패:", e);
                setData([]);
            }
            setLoading(false);
        };

        if (kind && part){
            fetchData();
        }
    }, [kind, part, currentPage]);
    
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    if (loading) return <div>로딩 중..</div>;
     if (!data || data.length === 0) {
            return (<div className='sale-no-data'><img src={noSearch} alt="No search results" /> </div>)}

    return (
        <div className='sale-main-container'>
            <h1>{displayKind} {displayPart}</h1>
            <p className='sale-intro'>신선한 고기를 만나보세요</p>
            {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
            <div className="sales">
            {
                data.map(item => (
                    <Link to={`/sale/${item.saleItemId}`} key={item.saleItemId}>
                        <div className='sale-item' key={item.saleItemId}>
                            {item.images && item.images.length > 0 && (
                                <img src={item.images[0].imageUrl} alt={item.title || '상품 이미지'} />
                            )}
                            <div className='sale-item-info'>
                                <div>{item.userName || '판매자 정보 없음'}</div>
                                <h3>{item.title || '상품명 없음'}</h3>
                                <div className='sale-item-wt-grade'>
                                    <p>{item.weight || '무게 정보 없음'}</p>
                                    <p>{item.grade ? `${item.grade} 등급` : '등급 정보 없음'}</p>
                                </div>
                                <div className='sale-item-price'>{item.price ? item.price.toLocaleString('ko-KR') : '0'}원</div>
                            </div>
                        </div>
                    </Link>   
                ))
            }
            </div>
            <div className="sale-pagination">
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

export default Sale;