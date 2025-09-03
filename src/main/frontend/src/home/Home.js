import './Home.css';
import cow from '../images/cow.png';
import chicken from '../images/chicken.png';
import pig from '../images/pig.png';
import mainvideo from './video/farmbaro_main.mp4';

import React, { useEffect, useState } from "react";
import axios from 'axios';
import useRemainingTime from './RemainingTime';


function Home() {

    // 1. 상태(State) 변수 정의
    const [auctionData, setAuctionData] = useState([]);
    const [saleData, setSaleData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // 2. useEffect를 사용하여 컴포넌트 마운트 시 데이터 가져오기
    useEffect(() => {
        const fetchAuctionData = async () => {
            try {

                // 여러 요청
                const [auctionResponse, saleResponse] = await Promise.all([
                    axios.get('http://localhost:8080/home/homeAuctionTime'),
                    axios.get('http://localhost:8080/home/homeSalesInfo')
                ]);

                setAuctionData(auctionResponse.data);
                setSaleData(saleResponse.data);

            } catch (error) {
                console.error("경매 데이터를 가져오는 중 오류가 발생했습니다:", error);
            } finally {
                setIsLoading(false); // 로딩 상태 종료
            }
        };

        fetchAuctionData();
    }, []); // 빈 의존성 배열은 컴포넌트가 처음 렌더링될 때 한 번만 실행

    return (
        <div className='home-main'>
            {/* ====================Main======================== */}
            <div className='home-main-section'>
                <div className="home-main-container">
                    <video
                        className="home-main-video"
                        autoPlay
                        muted
                        loop
                        playsInline
                    >
                        <source src={mainvideo} type="video/mp4" />
                    </video>
                    <div className="home-video-overlay"></div>
                    <div className='home-main-content'>
                        <h4>Welcome</h4>
                        <h2>목장바로</h2>
                    </div>
                </div>
            </div>

            {/* ====================quote======================== */}

            <div className="home-section">
                <div className="home-quote-container">
                    <div className="home-quote">
                        {/* 축종별 시세는 고정된 값으로 두거나, 별도의 API 호출로 처리 가능 */}
                        <div className="home-quote-inner">
                            <div className="">
                                <img className='home-quote-img' src={cow} alt="소" />
                                <h3>소</h3>
                                <p>1.3%</p>
                            </div>
                            <div>
                                <p>↓ 1.3</p>
                            </div>
                        </div>

                        <div className="home-quote-inner">
                            <div className="">
                                <img className='home-quote-img' src={pig} alt="돼지" />
                                <h3>돼지</h3>
                                <p>1.3%</p>
                            </div>
                            <div>
                                <p>↓ 1.3</p>
                            </div>
                        </div>

                        <div className="home-quote-inner">
                            <div className="">
                                <img className='home-quote-img' src={chicken} alt="닭" />
                                <h3>닭</h3>
                                <p>1.3%</p>
                            </div>
                            <div>
                                <p>↓ 1.3</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <hr className='hr'></hr>

            {/* ====================home-body======================== */}
            <div className="home-body">

                <div className="home-auction-section">
                    <h2>실시간 경매</h2>
                    <div className="home-auction-list">
                        {/* 3. 로딩 상태에 따라 다른 UI 표시 */}
                        {isLoading ? (
                            <p>데이터를 불러오는 중입니다...</p>
                        ) : (
                            auctionData.map((item, index) => {
                                const thumbnailImage = item.images && item.images.length > 0
                                    ? item.images.find(img => img.isThumbnail === 'Y') || item.images[0]
                                    : null;

                                const BASE_URL = 'http://localhost:8080';
                                const imageUrl = thumbnailImage
                                    ? `${BASE_URL}${thumbnailImage.imageUrl}`
                                    : 'https://via.placeholder.com/150?text=No+Image';

                                return (
                                    <div key={index} className="home-auction-card">
                                        <img src={item.imageUrl} alt={item.title} />

                                        <h3>{item.title}</h3>
                                        <p>시작가: {item.initialPrice}원{item.unit}</p>
                                        <p className="home-price-now">현재가: {item.currentBidPrice}원{item.unit}</p>
                                        <RemainingTimeDisplay endDate={item.endDate} />
                                        <button className='home-quote-btn btn'>입찰하기</button>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                <div className="home-sale-section">
                    <h2>오늘의 신선판매</h2>
                    <div className="home-sale-list">
                        {isLoading ? (
                            <p>데이터를 불러오는 중입니다...</p>
                        ) : (
                            saleData.map((item, index) => (
                                <div key={index} className="home-sale-card">
                                    <img src={item.imageUrl} alt={item.title} />
                                    <h3>{item.title}</h3>
                                    <h5>등급 : {item.grade}</h5>
                                    <p className="home-price-now">{item.price}원/kg</p>
                                    <button className='home-quote-btn btn'>장바구니 담기</button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function RemainingTimeDisplay({ endDate }) {
    const timeLeft = useRemainingTime(endDate);
    return <div>{timeLeft}</div>;
}

export default Home;