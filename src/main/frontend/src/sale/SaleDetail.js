import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentUser } from '../store/store';
import axios from 'axios';
import ImageSlider from './common/ImageSlider';
import './SaleDetail.css';
import refridge from '../images/refridge.png';
import ProductInfoTable from './common/ProductInfoTable';
import ReviewList from './ReviewList';

function SaleDetail() {

    const { saleId } = useParams();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [totalPrice, setTotalPrice] = useState(0);
    const kindNames = useSelector(state => state.meat.kindNames);
    const partNames = useSelector(state => state.meat.partNames);

    const { userId, isLoggedIn, status: authStatus } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleAddToCart = async () => {
        
        if (authStatus === 'loading') {
            alert('사용자 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
            return;
        }

        if (!isLoggedIn) {
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
        }

        try {
            console.log('장바구니 추가 요청:', { saleItemId: saleId, quantity: quantity });
            
            const response = await axios.post('/api/mypage/cart', {
                saleItemId: saleId,
                quantity: quantity, 
            }, {
                withCredentials: true // 세션 쿠키 포함
            });

            console.log('장바구니 추가 응답:', response.data);

            if (response.status === 200 && response.data) {
                if (window.confirm('장바구니에 상품을 담았습니다. 장바구니로 이동하시겠습니까?')) {
                    navigate(`/mypage/buyer/${userId}/cart`); 
                }
            } else {
                alert('장바구니 추가에 실패했습니다.');
            }
        } catch (error) {
            console.error("장바구니 추가 실패:", error);
            const errorMessage = error.response?.data?.message || '상품 추가에 실패했습니다. 다시 시도해 주세요.';
            alert(errorMessage);
        }
    };

    const handleBuyNow = async () => {
        
        if (authStatus === 'loading') {
            alert('사용자 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
            return;
        }

        if (!isLoggedIn) {
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
        }

        try {
            const response = await axios.post('/api/cart/add', {
                userId: userId,
                saleItemId: saleId,
                quantity: quantity, 
            });

            if (response.status === 200) {               
                 navigate(`/mypage/buyer/${userId}/cart`);
            }
        } catch (error) {
            console.error("장바구니 추가 실패:", error);
            const errorMessage = error.response?.data?.message || '상품 추가에 실패했습니다. 다시 시도해 주세요.';
            alert(errorMessage);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [itemResponse] = await Promise.all([
                    axios.get(`/api/sale/detail/${saleId}`),
                    dispatch(fetchCurrentUser()), // 사용자 정보 로딩 시작
                ]);
                setItem(itemResponse.data);
            } catch (e) {
                console.error("API 호출 실패:", e);
                setItem(null);
            }
            setLoading(false);
        };

        if (saleId) {
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
                    <p className='item-detail-price'>{item.price.toLocaleString('ko-KR')}원</p>
                    <div className='traceability-number'>
                        <div>
                            <span className='bold-span'>이력번호</span>
                            <p>{item.traceabilityNum}</p>
                            <a href={`https://mtrace.go.kr/search.do?mtraceNo=${item.traceabilityNum}`} target="_blank"><button className='traceability-number-btn'>축산물 이력정보 &#10095;</button></a>
                        </div>
                    </div>
                    <div className='shipping-fee'>
                        <span className='bold-span'>배송비</span>
                        <p>3,000원 (50,000원 이상 구매 시 무료)</p>
                    </div>
                    <div className='shipping-info'>
                        <span className='bold-span'>배송안내</span>
                        <div className='shipping-info-detail'>
                            <div className='shipping-info-detail-icon'>
                                <img src={refridge} alt='냉장배송' />
                                <span>냉장배송</span>
                            </div>
                            <p>오늘 <span className='color-text'>오후 3시</span>까지 결제 시 <span className='color-text'>당일출고</span></p>
                        </div>
                    </div>
                    <div className='qty-info'>
                        <span className='bold-span'>재고</span>
                        <p>{item.qty}개</p>
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
                    <div className='detail-total-price'>
                        <span>총 상품 금액</span>
                        <p>{totalPrice.toLocaleString('ko-KR')}원</p>
                    </div>
                    <div className='action-buttons'>
                        <button className='cart-button' onClick={handleAddToCart}>장바구니</button>
                        <button className='purchase-button' onClick={handleBuyNow}>구매하기</button>
                    </div>
                </div>
            </div>
            <div dangerouslySetInnerHTML={{ __html: item.detailDescription }} />
            <ProductInfoTable title={item.title} />
            <ReviewList saleId={saleId} />
        </div>
    );
}

export default SaleDetail;