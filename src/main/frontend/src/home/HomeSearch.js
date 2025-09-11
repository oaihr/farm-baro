import './HomeSearch.css';
import noSearch from '../images/no_search_keyword.png';
import PageNation from './pageNation/PageNation.js';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function HomeSearch() {

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [searchResults, setSearchResults] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const keyword = searchParams.get('keyword');

    // 경매 상품과 판매 상품의 현재 페이지 상태를 별도로 관리합니다.
    const [currentPageAuction, setCurrentPageAuction] = useState(1);
    const [currentPageSale, setCurrentPageSale] = useState(1);

    const auctionPage = parseInt(searchParams.get('auctionpage')) || 1;
    const salesPage = parseInt(searchParams.get('salespage')) || 1;

    useEffect(() => {
        const fetchResults = async () => {
            if (!keyword) {
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                const response = await axios.get(`/home/search?keyword=${keyword}`);
                setSearchResults(response.data);
            } catch (error) {
                console.error("검색 결과를 가져오는 데 실패했습니다:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchResults();
    }, [keyword]);

    // URL 파라미터가 변경될 때마다 현재 페이지 상태 업데이트
    useEffect(() => {
        setCurrentPageAuction(auctionPage);
        setCurrentPageSale(salesPage);
    }, [auctionPage, salesPage]);

    const ITEMS_PER_PAGE = 8; // 한 페이지에 표시할 아이템 수
    const PAGE_COUNT = 5; // 한 번에 표시할 페이지 번호 수

    // 경매 상품 목록을 현재 페이지에 맞게 슬라이싱
    const auctionsToDisplay = searchResults?.auctions.slice(
        (currentPageAuction - 1) * ITEMS_PER_PAGE,
        currentPageAuction * ITEMS_PER_PAGE
    ) || [];

    // 판매 상품 목록을 현재 페이지에 맞게 슬라이싱
    const salesToDisplay = searchResults?.sales.slice(
        (currentPageSale - 1) * ITEMS_PER_PAGE,
        currentPageSale * ITEMS_PER_PAGE
    ) || [];

    return (
        <div className="homeSearch-body">
            <h2><span>" {keyword} "</span> 에 대한 검색 결과</h2>
            <hr className='hr'></hr>
            {isLoading ? (
                <p>데이터를 불러오는 중입니다...</p>
            ) : searchResults && (auctionsToDisplay.length > 0 || salesToDisplay.length > 0) ? (
                <>
                    {/* 경매 상품 섹션 */}
                    <div className="homeSearch-auction-section">
                        <h3>경매 상품</h3>
                        <div className="homeSearch-auction-list">
                            {auctionsToDisplay.length > 0 ? (
                                auctionsToDisplay.map((item, index) => {
                                    const imageUrl = item.images[0]?.imageUrl ? `${item.images[0].imageUrl}` : 'https://via.placeholder.com/150?text=No+Image';

                                    return (
                                        <div key={index} className="homeSearch-auction-card" onClick={() => navigate(`/auction/${item.auctionId}`)}>
                                            <img src={imageUrl} alt={item.title} />
                                            <h3>{item.title}</h3>
                                            <hr className='hr'></hr>
                                            <p>시작가: {item.initialPrice}원</p>
                                            <p className="homeSearch-price-now">현재가: {item.currentBidPrice}원</p>
                                            <button className='homeSearch-quote-btn btn'>입찰하기</button>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className='homeSearch-noSearch'>
                                    <p>경매 상품 검색 결과가 없습니다.</p>
                                    <img src={noSearch} alt="No search results" />
                                </div>
                            )}
                        </div>
                        {/* 경매 상품 페이지네이션 */}
                        {searchResults?.auctions.length > ITEMS_PER_PAGE && (
                            <PageNation
                                totalItems={searchResults.auctions.length}
                                itemCountPerPage={ITEMS_PER_PAGE}
                                pageCount={PAGE_COUNT}
                                currentPage={currentPageAuction}
                                type="auction"
                            />
                        )}
                        <hr className='hr'></hr>
                    </div>
                    {/* 판매 상품 섹션 */}
                    <div className="homeSearch-sale-section">
                        <h3>판매 상품</h3>
                        <div className="homeSearch-sale-list">
                            {salesToDisplay.length > 0 ? (
                                salesToDisplay.map((item, index) => {
                                    const imageUrl = item.images[0]?.imageUrl ? `${item.images[0].imageUrl}` : 'https://via.placeholder.com/150?text=No+Image';

                                    return (
                                        <div key={index} className="homeSearch-sale-card" onClick={() => navigate(`/sale/${item.saleItemId}`)}>
                                            <img src={imageUrl} alt={item.title} />
                                            <h3>{item.title}</h3>
                                            <hr className='hr'></hr>
                                            <h5>등급 : {item.grade}</h5>
                                            <p className="homeSearch-price-now">{item.price}원/kg</p>
                                            <button className='homeSearch-quote-btn btn'>장바구니 담기</button>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className='homeSearch-noSearch'>
                                    <p>판매 상품 검색 결과가 없습니다.</p>
                                    <img src={noSearch} alt="No search results" />
                                </div>
                            )}
                        </div>

                        {/* 판매 상품 페이지네이션 */}
                        {searchResults?.sales.length > ITEMS_PER_PAGE && (
                            <PageNation
                                totalItems={searchResults.sales.length}
                                itemCountPerPage={ITEMS_PER_PAGE}
                                pageCount={PAGE_COUNT}
                                currentPage={currentPageSale}
                                type="sales"
                            />
                        )}
                    </div>
                </>
            ) : (
                <div className='homeSearch-noSearch'>
                    <p>검색 결과가 없습니다.</p>
                    <img src={noSearch} alt="No search results" />
                </div>
            )}
            <hr className='hr'></hr>
        </div>
    );
}

export default HomeSearch;