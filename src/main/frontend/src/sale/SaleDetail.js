import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function SaleDetail(){

    const { saleId } = useParams();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        const fetchData = async()=>{
            setLoading(true);
            try{
                const response = await axios.get(`http://localhost:8080/api/sale/detail/${saleId}`);
                setItem(response.data);
            } catch(e) {
                console.error("API 호출 실패:", e);
                setItem(null);
            }
            setLoading(false);
        };

        if (saleId){
            fetchData();
        }
    }, [saleId]);

    if (loading) return <div>로딩 중..</div>;
    if (!item) return <div>데이터가 없습니다.</div>;

    return (
        <div>
            {item.title}
            <div>
                {
                item.images.map((image) => (
                        <img 
                            key={image.orderIndex} 
                            src={image.imageUrl} 
                            alt={`${item.orderIndex}`} 
                        />
                    ))
                }      
            </div>
        </div>
    );
}

export default SaleDetail;