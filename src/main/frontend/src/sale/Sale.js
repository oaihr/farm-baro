import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import './Sale.css';

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
                const response = await axios.get(`http://localhost:8080/api/sale/${kind}/${part}?page=${currentPage}`);
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
    if (!data || data.length === 0) return <div>데이터가 없습니다.</div>;

    return (
        <div className='sale-main-container'>
            <h1>{displayKind} {displayPart}</h1>
            {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
            <div className="sales">
            {
                data.map(item => (
                    <Link to={`/sale/${item.saleItemId}`} key={item.saleItemId}>
                        <div className='sale-item' key={item.saleItemId}>
                            {item.images && item.images.length > 0 && (
                                <img src={item.images[0].imageUrl} alt={item.title} />
                            )}
                            <div className='sale-item-info'>
                                <div>{item.userName}</div>
                                <h3>{item.description}</h3>
                                <div className='sale-item-wt-grade'>
                                    <p>{item.weight}</p>
                                    <p>{item.grade} 등급</p>
                                </div>
                                <div>{item.price.toLocaleString('ko-KR')}원</div>
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

export default Sale;