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


    //quote 정보
    const [prices, setPrices] = useState({
        '소': { price: '00원', icon: cow },
        '돼지': { price: '00원', icon: pig },
        '닭': { price: '00원', icon: chicken }
    });

    const [activeKind, setActiveKind] = useState('소');

    const formatPrice = (price) => {
        if (typeof price !== 'number') {
            return price;
        }
        return price.toLocaleString('ko-KR') + '원';
    };

    const formatDateToYYYYMMDD = (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}${month}${day}`;
    };

    const fetchYesterdayData = async () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const formattedDate = formatDateToYYYYMMDD(yesterday);
        const endpoint = `http://localhost:8080/quote/checkDay?day=${formattedDate}`;

        try {
            const response = await axios.get(endpoint);
            const responseData = response.data;

            const newPrices = { ...prices };

            responseData.forEach(item => {
                const kind = item.judgeKindName;
                if (newPrices[kind]) {
                    newPrices[kind] = {
                        ...newPrices[kind],
                        price: formatPrice(item.maxPrice)
                    };
                }
            });
            setPrices(newPrices);

        } catch (error) {
            console.error("어제 데이터를 가져오는 중 오류가 발생했습니다:", error);
            const errorPrices = {};
            Object.keys(prices).forEach(key => {
                errorPrices[key] = { ...prices[key], price: '정보 없음' };
            });
            setPrices(errorPrices);
        }
    };

    useEffect(() => {
        fetchYesterdayData();
    }, []);

    return (
        <div className='home-main'>
            {/* ====================Main======================== */}
            <div className='home-main-section'>
                <div>
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

            <div className='quote-home-quote'>
                <div className="quote-section">
                    <div className="quote">
                        <h2>어제의 최저가 시세</h2>
                        <hr className='hr' style={{marginBottom:"70px"}}></hr>
                        {Object.keys(prices).map((kind) => (
                            <div
                                key={kind}
                                className={`quote-inner ${activeKind === kind}`}
                                onClick={() => setActiveKind(kind)}
                            >
                                <div className="">
                                    <img src={prices[kind].icon} alt={kind} className='quote-img' />
                                    <h3>{kind}</h3>
                                    <p>{prices[kind].price} 원/100g</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <hr className='hr'></hr>
            </div>

            {/* ====================home-body======================== */}
            <div className="home-body">
                <div className="home-auction-section">
                    <h2>실시간 경매</h2>
                    <div className="home-auction-list">
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
                                        <img src={item.images[0].imageUrl} alt={item.title} />
                                        <h3>{item.title}</h3>
                                        <hr className='hr'></hr>
                                        <p>시작가: {item.initialPrice.toLocaleString()}원{item.unit}</p>
                                        <p className="home-price-now">현재가: {item.currentBidPrice.toLocaleString()}원{item.unit}</p>
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
                                    <img src={`http://localhost:8080${item.images[0].imageUrl}`} alt={item.title} />
                                    <h3>{item.title}</h3>
                                    <hr className='hr'></hr>
                                    <h5>등급 : {item.grade}</h5>
                                    <p className="home-price-now">{item.price.toLocaleString()}원/kg</p>
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