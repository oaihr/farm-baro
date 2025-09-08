import { useEffect, useState, useRef } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentUser } from '../../store/store';
import axios from 'axios';
import * as StompJs from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import './AuctionDetail.css';
import ImageSlider from '../common/ImageSlider';
import refridge from '../../images/refridge.png';
import BidModal from './BidModal';
import useRemainingTime from '../common/RemainigTime';
import Alert from './Alert';

function AuctionDetail() {

    const { auctionId } = useParams();
    const location = useLocation();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);

    const dispatch = useDispatch();
    
    const { userId, totalBalance, bidDeposit } = useSelector((state) => state.auth);

    // 현재 최고 입찰가 
    const [currentBid, setCurrentBid] = useState(0);
    // STOMP 클라이언트 객체 보관용 ref
    const client = useRef(null);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [bidHistory, setBidHistory] = useState([]);

    const navigate = useNavigate();    

    // WebSocket 연결 
    const connect = () => {

        client.current = new StompJs.Client({
            // webSocketFactory를 사용하여 SockJS 객체 전달
            webSocketFactory: () => {
                return new SockJS('http://localhost:8080/ws-stomp');
            },
            debug: function (str) {
                console.log(str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        // STOMP 연결 시 실행될 콜백 함수
        client.current.onConnect = () => {
            console.log('WebSocket 연결 성공!');
            // /topic/auction/{auctionId} 경로 구독
            client.current.subscribe(`/topic/auction/${auctionId}`, (message) => {
                // 서버에서 메시지 수신 시 처리
                const newBidHistory = JSON.parse(message.body);
                console.log('새로운 입찰 정보:', newBidHistory);

                setBidHistory(newBidHistory);

                // 최고 입찰가 업데이트
                if (newBidHistory && newBidHistory.length > 0) {
                    setCurrentBid(newBidHistory[0].bidPrice);
                }
            });
        };

        // STOMP 활성화
        client.current.activate();
    };

    // WebSocket 연결 해제
    const disconnect = () => {
        if (client.current) {
            client.current.deactivate();
            console.log('WebSocket 연결 해제');
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:8080/api/auction/detail/${auctionId}`);
                setItem(response.data);

                const currentBidResponse = await axios.get(`http://localhost:8080/api/auction/current-bid/${auctionId}`);                                
                setCurrentBid(currentBidResponse.data);

                const bidHistoryResponse = await axios.get(`http://localhost:8080/api/auction/bid-history/${auctionId}`);                                
                setBidHistory(bidHistoryResponse.data);

                dispatch(fetchCurrentUser());

                connect();
            } catch (e) {
                console.error("API 호출 실패:", e);
                setItem(null);
            } finally {
                setLoading(false);
            }
        };

        if (auctionId) {
            fetchData();
        }

        return () => disconnect();
    }, [auctionId, dispatch]);

    const timeLeft = useRemainingTime(item?.endDate);

    const isAuctionActive = timeLeft !== '로딩 중 ...' ? timeLeft !== "0일 0시간 0분 0초" : false;


    const isPastAuction = location.pathname.includes('/off/');

    const handleOpenBidModal = () => {

        if (loading || !item) {
            return; 
        }

        if(!isAuctionActive){
            alert('이미 종료된 경매입니다');
            return
        }

        if(userId === null || userId === ""){
            navigate('/login');
        }else{
            setIsModalOpen(true);
        }
    };


    const handleCloseBidModal = () => setIsModalOpen(false);

    // 모달로부터 입찰 금액을 받아 WebSocket으로 전송
    const handleBid = (bidPrice) => {
        if (!client.current || !client.current.connected) {
            console.error("WebSocket이 연결되지 않았습니다.");
            return;
        }

        const bidMessage = {
            auctionId: parseInt(auctionId, 10),
            userId, 
            bidPrice: bidPrice            
        };

        client.current.publish({
            destination: '/app/bid',
            body: JSON.stringify(bidMessage),
        });
    };


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
                        <div className="detail-row">
                            <div className="detail-item">
                                <span className="label">품종</span>
                                <span className="value">{item.kind}</span>
                            </div>
                            <div className="detail-item">
                                <span className="label">등급</span>
                                <span className="value">{item.grade} 등급</span>
                            </div>
                        </div>
                        <div className="detail-row">
                            <div className="detail-item">
                                <span className="label">원산지</span>
                                <span className="value">국내산</span>
                            </div>
                            <div className="detail-item">
                                <span className="label">판매자</span>
                                <span className="value">{item.userName}</span>
                            </div>
                        </div>
                        <div className="detail-row">
                            <div className="detail-item">
                                <span className="label">경매시작</span>
                                <span className="value">{item.startDate.replace('T', ' ')}</span>
                            </div>
                            <div className="detail-item">
                                <span className="label">경매종료</span>
                                <span className="value">{item.endDate.replace('T', ' ')}</span>
                            </div>
                        </div>
                        
                        <hr className="divider" />

                        <div className="product-description">
                            <h2 className="title">상품 설명</h2>
                            <p className="description-text">
                                횡성 지역에서 자란 최상급 한우입니다. 1++ 등급의 풍부한 마블링과 부드러운 육질을 자랑합니다. 엄격한 품질 관리 하에 도축되어 신선도가 보장됩니다. 진공 포장되어 배송되며, 수령 후 냉장 보관 시 3일, 냉동 보관 시 1개월까지 신선도가 유지됩니다.
                            </p>
                        </div>

                        <hr className="divider" />
                        <div className='remaining-time-box'>
                            <p>경매 종료까지 남은 시간</p>
                            <RemainingTimeDisplay endDate={item.endDate} />
                        </div>    
                        <hr className="divider" />
                        <div className='buy-now-price'>
                            <span className='now-price-label'>경매 시작가</span>
                            <span className='now-price-value'>{item.initialPrice.toLocaleString()} 원</span>
                        </div>

                        <div className='buy-now-price'>
                            <span className='now-price-label'>즉시 구매가</span>
                            <span className='now-price-value'>{item.buyNowPrice.toLocaleString()} 원</span>
                        </div>

                        <div className='real-time-bid'>
                            <span className='bid-price-label'>
                                {isPastAuction ? '최종 낙찰가' : '현재 입찰가'}
                            </span>
                            <span className='bid-price-value'>{currentBid === 0 ? '미입찰' : `${currentBid.toLocaleString()} 원`} </span>
                        </div>

                    </div>
                    {!isPastAuction && (
                        <div className='action-buttons'>
                            <button className='cart-button' onClick={() => {/* 즉시구매*/ }}>즉시구매</button>
                            <button className='purchase-button' onClick={handleOpenBidModal}>입찰하기</button>
                        </div>
                    )}
                    <BidModal
                        isOpen={isModalOpen}
                        onClose={handleCloseBidModal}
                        onBid={handleBid}
                        currentBid={currentBid}
                        initialPrice={item.initialPrice}
                        totalBalance={totalBalance}
                        bidDeposit={bidDeposit}
                        isAuctionActive={isAuctionActive}
                    />
                </div>
            </div>
            <div>
                <div className='bid-history-container'>
                    <h2>입찰 기록</h2>
                    <table className='bid-history-table'>
                        <thead>
                            <tr>
                                <th>입찰자</th>
                                <th>입찰가</th>
                                <th>입찰 시간</th>
                                <th>상태</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bidHistory.map((bid, index) => (
                                <tr key={index}>
                                    <td>{bid.userName}</td>
                                    <td>{bid.bidPrice.toLocaleString()}원</td>
                                    <td>
                                        {
                                            (() => {
                                                // 날짜 포맷팅 로직
                                                const year = bid.bidTime[0];
                                                const month = bid.bidTime[1] - 1;
                                                const day = bid.bidTime[2];
                                                const hour = bid.bidTime[3];
                                                const minute = bid.bidTime[4];
                                                const second = bid.bidTime[5];

                                                const date = new Date(year, month, day, hour, minute, second);

                                                return date.toLocaleString('ko-KR', {
                                                    year: 'numeric', month: '2-digit', day: '2-digit',
                                                    hour: '2-digit', minute: '2-digit', second: '2-digit',
                                                    hour12: false
                                                });
                                            })()
                                        }
                                    </td>
                                    <td>
                                        {index === 0 ?
                                            <span className="status-cell-top">최고 입찰</span> :
                                            <span className="status-cell-normal">입찰 완료  </span>
                                        }
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function RemainingTimeDisplay({ endDate }) {
    const timeLeft = useRemainingTime(endDate);
    return <div>{timeLeft}</div>;
}

export default AuctionDetail;