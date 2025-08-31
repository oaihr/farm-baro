import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './Sale.css';


function Sale(){

    const { kind, part } = useParams();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const kindNames = {
        'beef': '소',
        'chicken': '닭',
        'pork': '돼지',
    }

    const partNames = {
        'sirloin': '등심',
        'tenderloin': '안심',
        'rib': '갈비',
        'belly': '삼겹살',
        'neck': '목살', 
        'breast': '가슴살',
        'leg': '다리살',
        'etc': '기타',
    }
    const displayKind = kindNames[kind];
    const displayPart = partNames[part];

    useEffect(()=>{
        const fetchData = async()=>{
            setLoading(true);
            try{
                const response = await axios.get(`http://localhost:8080/api/meat/${kind}/${part}?page=${currentPage}`);
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