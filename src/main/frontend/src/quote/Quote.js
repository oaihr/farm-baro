import './Quote.css';
import axios from 'axios';
import { useState, useEffect } from "react";

import { Chart as ChartJS } from 'chart.js/auto';
import { Line } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import cow from '../images/cow.png';
import chicken from '../images/chicken.png';
import pig from '../images/pig.png';





function Quote() {


    // 1. 차트 데이터를 저장할 상태 변수 (전체 데이터와 차트용 데이터 분리)
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [],
        fullData: [] // API로부터 받은 전체 데이터를 저장할 공간 추가
    });
    // 2. 로딩 상태를 저장할 상태 변수
    const [isLoading, setIsLoading] = useState(false);
    // 3. 현재 선택된 축종을 저장할 상태 변수
    const [activeKind, setActiveKind] = useState('소');
    // 4. 상단 카드에 표시될 가격을 저장할 상태 변수
    const [prices, setPrices] = useState({
        '소': '00원',
        '돼지': '00원',
        '닭': '00원'
    });
    // 5. 현재 선택된 날짜를 저장할 상태 변수 (기본값을 어제로 설정)
    const [activeDate, setActiveDate] = useState(() => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return yesterday;
    });

    // 가격을 한국 원화 형식으로 포맷하는 함수
    const formatPrice = (price) => {
        return price.toLocaleString('ko-KR') + '원';
    };

    // 날짜 객체를 YYYYMMDD 형식의 문자열로 변환하는 함수
    const formatDateToYYYYMMDD = (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}${month}${day}`;
    };

    // REST API를 통해 데이터를 가져오는 함수 (실제 API 호출)
    const fetchQuoteData = async (date) => {
        setIsLoading(true);
        const yyyymmdd = formatDateToYYYYMMDD(date);

        try {
            const response = await axios.get(`/quote/checkDay?day=${yyyymmdd}`);
            const responseData = response.data;
            console.log("API로부터 받은 데이터:", responseData);

            // 상단 카드 가격 업데이트
            const newPrices = { ...prices };
            meatTypes.forEach(meat => {
                const meatData = responseData.find(item => item.judgeKind == meat.kind);
                newPrices[meat.kind] = meatData ? formatPrice(meatData.maxPrice) : '정보 없음';
            });
            setPrices(newPrices);

            // 전체 데이터를 상태에 저장
            setChartData(prevData => ({
                ...prevData,
                fullData: responseData
            }));

        } catch (error) {
            console.error("데이터를 가져오는 중 오류가 발생했습니다:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // activeDate가 변경될 때마다 데이터를 다시 가져옵니다.
    useEffect(() => {
        fetchQuoteData(activeDate);
    }, [activeDate]);

    // activeKind 또는 fullData가 변경될 때마다 차트 데이터를 필터링하고 업데이트합니다.
    useEffect(() => {
        if (chartData.fullData.length === 0) return;

        // 선택된 축종(activeKind)에 따라 데이터 필터링
        const filteredData = chartData.fullData.filter(item => item.judgeKind == activeKind);

        const labels = filteredData.map(item => item.itemName);
        const maxPrices = filteredData.map(item => item.maxPrice);
        const minPrices = filteredData.map(item => item.minPrice);

        setChartData(prevData => ({
            ...prevData,
            labels: labels,
            datasets: [
                {
                    label: '최고가',
                    data: maxPrices,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    tension: 0.4,
                },
                {
                    label: '최저가',
                    data: minPrices,
                    borderColor: 'rgb(53, 162, 235)',
                    backgroundColor: 'rgba(53, 162, 235, 0.5)',
                    tension: 0.4,
                },
            ],
        }));
    }, [activeKind, chartData.fullData]);

    // 상단 아이콘 및 종류 정보
    const meatTypes = [
        { kind: '소', num: '4301', icon: '🐄' },
        { kind: '돼지', num: '4304', icon: '🐖' },
        { kind: '닭', num: '9901', icon: '🐓' },
    ];



    return (
        <div className='home-quote'>
            <div className="section">
                <div className="quote-container">
                    <div className="quote">
                        {meatTypes.map((meat) => (
                            <div
                                key={meat.kind}
                                className={`quote-inner ${activeKind === meat.kind ? 'active' : ''}`}
                                onClick={() => setActiveKind(meat.num)}
                            >
                                <div className="">
                                    <span className='quote-img'>{meat.icon}</span>
                                    <h3>{meat.kind}</h3>
                                    <p>{prices[meat.kind]}</p>
                                </div>
                                <div>
                                    <p>↓ 1.3</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <hr className='hr'></hr>

            <div className='quote-kind-select'>
                <div className='quote-menubar'>

                    <div className='quote-day'>
                        <div className='quote-today'>
                            <p></p>
                            <button
                                className='btn'
                                onClick={() => {
                                    const yesterday = new Date();
                                    yesterday.setDate(yesterday.getDate() - 1);
                                    setActiveDate(yesterday);
                                }}
                            >어제</button>
                        </div>
                        <div className='quote-month'>
                            <p></p>
                            <button className='btn' disabled>주일</button>
                        </div>
                        <div className='quote-year'>
                            <p></p>
                            <button className='btn' disabled>년도</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="chart">
                {isLoading ? (
                    <p className="text-gray-500 text-lg animate-pulse">데이터를 가져오는 중입니다...</p>
                ) : (
                    <Line data={chartData} options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                            title: {
                                display: true,
                                text: `${activeKind} 부위별 시세`,
                                font: {
                                    size: 18,
                                    weight: 'bold'
                                },
                            },
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                            },
                        },
                    }} />
                )}
            </div>
        </div>
    );
}

export default Quote;