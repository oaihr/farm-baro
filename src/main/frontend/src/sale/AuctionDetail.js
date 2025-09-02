import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './AuctionDetail.css';
import ImageSlider from './ImageSlider';
import refridge from '../images/refridge.png';

function AuctionDetail() {

    const { auctionId } = useParams();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:8080/api/auction/detail/${auctionId}`);
                setItem(response.data);
            } catch (e) {
                console.error("API 호출 실패:", e);
                setItem(null);
            }
            setLoading(false);
        };

        if (auctionId) {
            fetchData();
        }
    }, [auctionId]);


    if (loading) return <div>로딩 중..</div>;
    if (!item) return <div>데이터가 없습니다.</div>;

    return (
        <div>
            <div>
                <ul className='item-path'>
                    <Link to='/'><li>홈</li></Link>
                    <li>&#10095;</li>
                    <Link to={`/auctions`}><li>경매목록</li></Link>
                    <li>&#10095;</li>
                    <li style={{ color: 'red' }}>경매상세</li>
                </ul>
            </div>
            <div className='auction-item-info' style={{ position: 'relative' }}>
                <div className='image-slider-container'>
                    <ImageSlider images={item.images} interval={4000} />
                </div>
                <div className='auction-item-detail-box'>
                    <h2>{item.title}</h2>
                    <div className='auction-item-detail-info'>
                        <div className='traceability-number'>                            
                            <span className='num-span'>이력번호</span>
                            <p>{item.traceabilityNum}</p>
                            <a href={`https://mtrace.go.kr/search.do?mtraceNo=${item.traceabilityNum}`} target="_blank"><button className='traceability-number-btn'>축산물 이력정보 &#10095;</button></a>                        
                        </div>  
                        <div class="detail-row">
                            <div class="detail-item">
                                <span class="label">품종</span>
                                <span class="value">{item.kind}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">등급</span>
                                <span class="value">{item.grade} 등급</span>
                            </div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-item">
                                <span class="label">원산지</span>
                                <span class="value">국내산</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">판매자</span>
                                <span class="value">{item.userName}</span>
                            </div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-item">
                                <span class="label">경매시작</span>
                                <span class="value">{item.startDate.replace('T', ' ')}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">경매종료</span>
                                <span class="value">{item.endDate.replace('T', ' ')}</span>
                            </div>
                        </div>

                        
                        <hr class="divider" />
    
                        <div class="product-description">
                            <h2 class="title">상품 설명</h2>
                            <p class="description-text">
                                횡성 지역에서 자란 최상급 한우입니다. 1++ 등급의 풍부한 마블링과 부드러운 육질을 자랑합니다. 엄격한 품질 관리 하에 도축되어 신선도가 보장됩니다. 진공 포장되어 배송되며, 수령 후 냉장 보관 시 3일, 냉동 보관 시 1개월까지 신선도가 유지됩니다.
                            </p>
                        </div>
                    </div>
                    

                    <div className='action-buttons'>
                        <button className='cart-button' onClick={() => {/* 장바구니에 상품 추가 로직 */ }}>즉시 구매</button>
                        <button className='purchase-button' onClick={() => {/* 구매하기 로직 */ }}>입찰하기</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AuctionDetail;