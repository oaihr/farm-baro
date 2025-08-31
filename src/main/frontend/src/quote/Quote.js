import './Quote.css';
import axios from 'axios';
import { useState } from "react";

import { Chart as ChartJS } from 'chart.js/auto';
import { Bar, Line } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import logo from '../images/farmbaro_logo.png';
import cow from '../images/cow.png';
import chicken from '../images/chicken.png';
import pig from '../images/pig.png';

function Quote() {

    //YYYYMMDD 날짜형식 저장
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    const yyyymmdd = `${year}${month}${day}`;

    //그래프
    const labels = ['월', '화', '수', '목', '금', '토', '일'];
    const eventTypeList = ['저번주', '이번주'];
    const falldownData = [0, 20, 15, 25, 30, 18, 22];
    const crowdData = [5, 12, 8, 15, 10, 0, 11];
    // const total = [15, 32, 23, 40, 40, 25, 33];
    const dataFont = { color: 'red' };
    const objColor = ['#FF6384', '#36A2EB', '#FFCE56', '#9B59B6', '#1ABC9C', '#F39C12', '#2ECC71'];
    // const lineColor = 'rgba(124, 35, 35, 0.4)';

    //chart js
    const data = {
        plugins: [ChartDataLabels],	//플러그인 사용을 위해 연결
        labels: labels, //그래프상 날짜 데이터        
        datasets: [{
            label: eventTypeList[0],	//라벨명 ex)쓰러짐                
            data: falldownData,			// 날짜 데이터 순서의 value list
            datalabels: dataFont,		//폰트 사이즈 및 색상
            backgroundColor: objColor[0],//bar차트의 색상
            borderColor: objColor[0],	//bar의 테두리 색상
            order: 1,					//순서 non-important            
        },           //.........생략... 누적 바 차트의 데이터...            
        {
            label: eventTypeList[1],
            data: crowdData,
            datalabels: dataFont,
            backgroundColor: objColor[6],
            borderColor: objColor[6],
            order: 1,
        },
        ],
    };

    const options = {
        interaction: {
            mode: 'index',  	//툴팁 전체 출력            
            intersect: false,
        },
        maxBarThickness: 15,    // bar 타입 막대의 최대 굵기        
        layout: {
            padding: {
                top: 30
            }
        },
        plugins: {
            legend: {

                position: 'bottom',		//레전드 위치             
            },
            title: {
                display: false,		//타이틀
                text: "Total", fontSize: 25,
            }, datalabels: {
                anchor: 'end',  //start , end                 
                align: 'top',   //top bottom middle 데이터 라벨 표시 위치                
                // formatter: function (value, context) { //데이터 값이 0 이면 출력 안함                    
                //     if (context.dataset.label !== '전체') {
                //         if (value == 0) {
                //             return null;
                //         } else {
                //             return value;
                //         }
                //     } else {
                //         if (value == 0) {
                //             return null;
                //         } else {
                //             let result = value.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
                //             return result;
                //         }
                //     }
                // },
            }, tooltip: {
                backgroundColor: 'rgba(35, 124, 72, 0.4)',
                padding: 10,
                bodySpacing: 5,     //툴팁 내부의 항목 간격            
            }
        },
        maintainAspectRatio: false, //false :  상위 div에 구속        
        responsive: true, //false : 정적 true: 동적        
        scales: {
            x: {
                stacked: true,
            },
            y: {
                stacked: true,
                beginAtZero: true
            },
        },
        onClick: function (evt, element) {
            console.log(evt, element);
        }
    };



    return (
        <>
            <div className='home-quote'>

                {/* ====================quote======================== */}

                <div className="section">
                    <div className="quote-container">
                        <div className="quote">

                            <div className="quote-inner">
                                <div className="">
                                    <img className='quote-img' src={cow} />
                                    <h3>소</h3>
                                    <p>00원</p>
                                </div>
                                <div>
                                    <p>↓ 1.3</p>
                                </div>
                            </div>

                            <div className="quote-inner">
                                <div className="">
                                    <img className='quote-img' src={pig} />
                                    <h3>돼지</h3>
                                    <p>00원</p>
                                </div>
                                <div>
                                    <p>↓ 1.3</p>
                                </div>
                            </div>

                            <div className="quote-inner">
                                <div className="">
                                    <img className='quote-img' src={chicken} />
                                    <h3>닭</h3>
                                    <p>00원</p>
                                </div>
                                <div>
                                    <p>↓ 1.3</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <hr className='hr'></hr>

                <div className='quote-kind-select'>
                    <div className='quote-menubar'>
                        <div className='quote-menu-container'>

                            <ul className="quote-menu">

                                <li className="quote-menu-span span">소
                                    <ul className="quote-submenu">
                                        <button className='quote-btn btn'>등심</button>
                                        <button className='quote-btn btn'>안심</button>
                                        <button className='quote-btn btn'>갈비</button>
                                    </ul>
                                </li>

                                <li className="quote-menu-span span">돼지
                                    <ul className="quote-submenu">
                                        <button className='quote-btn btn'>삼겹살</button>
                                        <button className='quote-btn btn'>목살</button>
                                        <button className='quote-btn btn'>갈비</button>
                                    </ul>
                                </li>

                                <li className="quote-menu-span span">닭
                                    <ul className="quote-submenu">
                                        <button className='quote-btn btn'>닭가슴살</button>
                                        <button className='quote-btn btn'>닭다리</button>
                                    </ul>
                                </li>

                            </ul>
                        </div>

                        <div className='quote-day'>
                            <div className='quote-today'>
                                <p>{yyyymmdd}</p>
                            </div>

                            <div className='quote-month'>
                                <p>{yyyymmdd}</p>
                            </div>

                            <div className='quote-year'>
                                <p>{yyyymmdd}</p>
                            </div>
                        </div>

                    </div>


                </div>
                <div className="chart">
                    <Line
                        data={data}
                        options={options} />
                </div>


            </div>
        </>
    );
}

export default Quote;