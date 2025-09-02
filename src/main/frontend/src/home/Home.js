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
    const [isLoading, setIsLoading] = useState(true);

    // 2. useEffect를 사용하여 컴포넌트 마운트 시 데이터 가져오기
    useEffect(() => {
        const fetchAuctionData = async () => {
            try {
                const response = await axios.get('http://localhost:8080/home/homeAuctionTime');
                console.log(response.data);
                setAuctionData(response.data); // 받아온 데이터를 상태에 저장
            } catch (error) {
                console.error("경매 데이터를 가져오는 중 오류가 발생했습니다:", error);
            } finally {
                setIsLoading(false); // 로딩 상태 종료
            }
        };

        fetchAuctionData();
    }, []); // 빈 의존성 배열은 컴포넌트가 처음 렌더링될 때 한 번만 실행되도록 합니다.

    return (
        <div className='home-main'>
            {/* ====================Main======================== */}
            <div className='main'>
                <div className="main-container">
                    <video
                        className="main-video"
                        autoPlay
                        muted
                        loop
                        playsInline
                    >
                        <source src={mainvideo} type="video/mp4" />
                    </video>
                    <div className="video-overlay"></div>
                    <div className='main-content'>
                        <h4>Welcome</h4>
                        <h2>목장바로</h2>
                    </div>
                </div>
            </div>

            {/* ====================quote======================== */}

            <div className="section">
                <div className="quote-container">
                    <div className="quote">
                        {/* 축종별 시세는 고정된 값으로 두거나, 별도의 API 호출로 처리 가능 */}
                        <div className="quote-inner">
                            <div className="">
                                <img className='quote-img' src={cow} alt="소" />
                                <h3>소</h3>
                                <p>1.3%</p>
                            </div>
                            <div>
                                <p>↓ 1.3</p>
                            </div>
                        </div>

                        <div className="quote-inner">
                            <div className="">
                                <img className='quote-img' src={pig} alt="돼지" />
                                <h3>돼지</h3>
                                <p>1.3%</p>
                            </div>
                            <div>
                                <p>↓ 1.3</p>
                            </div>
                        </div>

                        <div className="quote-inner">
                            <div className="">
                                <img className='quote-img' src={chicken} alt="닭" />
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

                <div className="auction-section">
                    <h2>실시간 경매</h2>
                    <div className="auction-list">
                        {/* 3. 로딩 상태에 따라 다른 UI 표시 */}
                        {isLoading ? (
                            <p>데이터를 불러오는 중입니다...</p>
                        ) : (
                            auctionData.map((item, index) => {
                                const thumbnailImage = item.images && item.images.length > 0
                                    ? item.images.find(img => img.isThumbnail === 'Y') || item.images[0]
                                    : null;

                                // 이 부분이 수정된 부분입니다.
                                // 백엔드 서버 주소와 DB에서 가져온 상대 경로를 결합합니다.
                                const BASE_URL = 'http://localhost:8080';
                                const imageUrl = thumbnailImage
                                    ? `${BASE_URL}${thumbnailImage.imageUrl}`
                                    : 'https://via.placeholder.com/150?text=No+Image';

                                return (
                                    <div key={index} className="auction-card">
                                        <img src={item.imageUrl} alt={item.title} /> 
                                        
                                        <h3>{item.title}</h3>
                                        <p>시작가: {item.initialPrice}원{item.unit}</p>
                                        <p className="price-now">현재가: {item.currentBidPrice}원{item.unit}</p>
                                        <RemainingTimeDisplay endDate={item.endDate} />
                                        <button className='quote-btn btn'>입찰하기</button>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                <div className="special-section">
                    <h2>오늘의 특가</h2>
                    <div className="special-list">
                        <div className="special-card">
                            <img src="" alt="LA갈비" />
                            <h3>한우 LA갈비</h3>
                            <p><span className="old-price">45,000원/kg</span> → <span className="new-price">31,500원/kg</span></p>
                            <button className='quote-btn btn'>장바구니 담기</button>
                        </div>
                        <div className="special-card">
                            <img src="" alt="목살 바비큐" />
                            <h3>목살 바비큐 세트</h3>
                            <p><span className="old-price">28,000원/kg</span> → <span className="new-price">21,000원/kg</span></p>
                            <button className='quote-btn btn'>장바구니 담기</button>
                        </div>
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