import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import ImageSlider from './ImageSlider';
import './SaleDetail.css';
import refridge from '../images/refridge.png';
import ProductInfoTable from './ProductInfoTable';

function SaleDetail(){

    const { saleId } = useParams();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1); 
    const [totalPrice, setTotalPrice] = useState(0); 
    const kindNames = useSelector(state => state.meat.kindNames);
    const partNames = useSelector(state => state.meat.partNames);

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

    useEffect(() => {
        if (item) {
            setTotalPrice(item.price * quantity);
        }
    }, [item, quantity]);

    if (loading) return <div>로딩 중..</div>;
    if (!item) return <div>데이터가 없습니다.</div>;

    return (
        <div>
            <div>
                <ul className='item-path'>
                    <Link to='/'><li>홈</li></Link>
                    <li>&#10095;</li>
                    <li>{kindNames[item.judgeKindName]}</li>
                    <li>&#10095;</li>
                    <Link to={`/sale/${item.judgeKindName}/${item.cutName}`}><li>{partNames[item.cutName]}</li></Link>
                </ul>
            </div>
            <div className='item-info' style={{ position: 'relative' }}>
                <div className='image-slider-container'>            
                    <ImageSlider images={item.images} interval={4000} />
                </div>
                <div className='item-detail-info'>
                    <h2>{item.title}</h2>
                    <p className='item-price'>{item.price.toLocaleString('ko-KR')}원</p>
                    <div className='traceability-number'>
                        <div>
                            <span className='bold-span'>이력번호</span>
                            <p>002189727536</p>                            
                            <button className='traceability-number-btn'>축산물 이력정보 &#10095;</button>
                        </div>
                    </div>
                    <div className='pack-date'>
                        <span className='bold-span'>포장일</span>
                        <p>2025-08-22</p>
                    </div>
                    <div className='shipping-fee'>
                        <span className='bold-span'>배송비</span>
                        <p>3,000원 (50,000원 이상 구매 시 무료)</p>
                    </div>
                    <div className='shipping-info'>
                        <span className='bold-span'>배송안내</span>
                        <div className='shipping-info-detail'>
                            <div className='shipping-info-detail-icon'>
                                <img src={refridge} alt='냉장배송'/>
                                <span>냉장배송</span>
                            </div>
                            <p>오늘 <span className='color-text'>오후 3시</span>까지 결제 시 <span className='color-text'>당일출고</span></p>
                        </div>
                    </div>
                    <div className='qty-info'>
                        <span className='bold-span'>재고</span>
                        <p>{item.qty} 박스</p>
                    </div>
                    <div className='qty-selector'>
                        <div>
                            <span className='bold-span'>수량</span>
                            <div className='qty-controls'>
                                <button onClick={() => setQuantity(prev => Math.max(1, prev - 1))}>-</button>
                                <p>{quantity}</p>
                                <button onClick={() => setQuantity(prev => prev + 1)}
                                    disabled={quantity >= item.qty}>+</button>
                            </div>
                        </div>
                    </div>
                    <div className='total-price'>
                        <span>총 상품 금액</span>
                        <p>{totalPrice.toLocaleString('ko-KR')}원</p>
                    </div>
                    <div className='action-buttons'>
                        <button className='cart-button' onClick={() => {/* 장바구니에 상품 추가 로직 */}}>장바구니</button>
                        <button className='purchase-button' onClick={() => {/* 구매하기 로직 */}}>구매하기</button>
                    </div>
                </div>
            </div>
            <ProductInfoTable title={item.title}/>
        </div>
    );
}

export default SaleDetail;