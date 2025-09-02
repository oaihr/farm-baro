import './Home.css';
import cow from './images/cow.png';
import chicken from './images/chicken.png';
import pig from './images/pig.png';
import mainvideo from './video/farmbaro_main.mp4';

import React, { useEffect, useState } from "react";


function Home() {


    return (
        <div className='home-main'>
            {/* ====================Main======================== */}
            <div className='main'>
                <div className="main-container">
                    <video
                        className="main-video"
                        autoPlay       // 자동재생
                        muted
                        loop           // 반복재생
                        playsInline    // 모바일 사파리에서 화면 꽉 차게 재생
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

                        <div className="quote-inner">
                            <div className="">
                                <img className='quote-img' src={cow} />
                                <h3>소</h3>
                                <p>1.3%</p>
                            </div>
                            <div>
                                <p>↓ 1.3</p>
                            </div>
                        </div>

                        <div className="quote-inner">
                            <div className="">
                                <img className='quote-img' src={pig} />
                                <h3>돼지</h3>
                                <p>1.3%</p>
                            </div>
                            <div>
                                <p>↓ 1.3</p>
                            </div>
                        </div>

                        <div className="quote-inner">
                            <div className="">
                                <img className='quote-img' src={chicken} />
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
                        {/* 여기는 map 돌려서 카드 반복 */}
                        <div className="auction-card">
                            <img src="" alt="한우 등심" />
                            <h3>한우 등심 1++</h3>
                            <p>시작가: 38,000원/100g</p>
                            <p className="price-now">현재가: 48,500원/100g</p>
                            <button className='quote-btn btn'>입찰하기</button>
                        </div>
                        <div className="auction-card">
                            <img src="" alt="국내산 삼겹살" />
                            <h3>국내산 삼겹살</h3>
                            <p>시작가: 22,000원/100g</p>
                            <p className="price-now">현재가: 36,800원/100g</p>
                            <button className='quote-btn btn'>입찰하기</button>
                        </div>
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

export default Home;