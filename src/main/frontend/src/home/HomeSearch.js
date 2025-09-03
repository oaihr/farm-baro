import './HomeSearch.css';
import noSearch from '../images/no_search_keyword.png';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

function HomeSearch() {

    const [searchParams] = useSearchParams();
    const [searchResults, setSearchResults] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const keyword = searchParams.get('keyword');

    useEffect(() => {
        const fetchResults = async () => {
            if (!keyword) {
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                // 백엔드 URL을 `/home/search`로 수정
                const response = await axios.get(`http://localhost:8080/home/search?keyword=${keyword}`);
                setSearchResults(response.data);
            } catch (error) {
                console.error("검색 결과를 가져오는 데 실패했습니다:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchResults();
    }, [keyword]);

    const BASE_URL = 'http://localhost:8080';



    return (
        <div className="home-body">
            <h2><span>{keyword}</span> 에 대한 검색 결과</h2>
            <hr className='hr'></hr>
            {isLoading ? (
                <p>데이터를 불러오는 중입니다...</p>
            ) : searchResults && (searchResults.auctions.length > 0 || searchResults.sales.length > 0) ? (
                <>
                    {/* 경매 상품 섹션 */}
                    <div className="home-auction-section">
                        <h3>경매 상품</h3>
                        <div className="home-auction-list">
                            {searchResults.auctions.length > 0 ? (
                                searchResults.auctions.map((item, index) => {
                                    const imageUrl = item.imageUrl ? `${BASE_URL}${item.imageUrl}` : 'https://via.placeholder.com/150?text=No+Image';

                                    return (
                                        <div key={index} className="home-auction-card">
                                            <img src={imageUrl} alt={item.title} />
                                            <h3>{item.title}</h3>
                                            <p>시작가: {item.initialPrice}원</p>
                                            <p className="home-price-now">현재가: {item.currentBidPrice}원</p>
                                            <button className='home-quote-btn btn'>입찰하기</button>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className='home-noSearch'>
                                    <p>경매 상품 검색 결과가 없습니다.</p>
                                    <img src={noSearch} />
                                </div>
                            )}
                        </div>
                        <hr className='hr'></hr>
                    </div>
                    {/* 판매 상품 섹션 */}
                    <div className="home-sale-section">
                        <h3>판매 상품</h3>
                        <div className="home-sale-list">
                            {searchResults.sales.length > 0 ? (
                                searchResults.sales.map((item, index) => {
                                    const imageUrl = item.imageUrl ? `${BASE_URL}${item.imageUrl}` : 'https://via.placeholder.com/150?text=No+Image';

                                    return (
                                        <div key={index} className="home-sale-card">
                                            <img src={imageUrl} alt={item.title} />
                                            <h3>{item.title}</h3>
                                            <h5>등급 : {item.grade}</h5>
                                            <p className="home-price-now">{item.price}원/kg</p>
                                            <button className='home-quote-btn btn'>장바구니 담기</button>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className='home-noSearch'>
                                    <p>판매 상품 검색 결과가 없습니다.</p>
                                    <img src={noSearch} />
                                </div>
                            )}
                        </div>
                    </div>
                </>
            ) : (
                <div className='home-noSearch'>
                    <p>검색 결과가 없습니다.</p>
                    <img src={noSearch} />
                </div>
            )}
            <hr className='hr'></hr>
        </div>
    );
}

export default HomeSearch;