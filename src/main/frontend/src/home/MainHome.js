import './MainHome.css';
import logo from './images/farmbaro_logo.png'

function MainHome() {
    return (
        <div>
            <div className="home-header">
                <div className='home-logo-search'>
                    <div className="home-search-box">
                        <img src={logo} className="logo" />
                        <input
                            type="text"
                            className="home-search"
                            placeholder="검색어를 입력하세요"
                        />
                        <button className="home-search-btn btn">검색</button>
                    </div>
                </div>
                <hr className='hr'></hr>
                <div className='home-menubar'>
                    <div className='home-submenu'>

                        <ul className="home-menu">
                            <li className="home-menu-span span">경매
                                <ul className="home-submenu">
                                    <li><a href="/travels?category=12">실시간 경매</a></li>
                                    <li><a href="/travels?category=12">지난 경매</a></li>
                                </ul>
                            </li>

                            <li className="home-menu-span span">소
                                <ul className="home-submenu">
                                    <li><a href="">등심</a></li>
                                    <li><a href="">안심</a></li>
                                    <li><a href="">갈비</a></li>
                                    <li><a href="">기타</a></li>
                                </ul>
                            </li>


                            <li className="home-menu-span span">돼지
                                <ul className="home-submenu">
                                    <li><a href="">삼겹살</a></li>
                                    <li><a href="">목살</a></li>
                                    <li><a href="">갈비</a></li>
                                    <li><a href="">기타</a></li>
                                </ul>
                            </li>

                            <li className="home-menu-span span">닭
                                <ul className="home-submenu">
                                    <li><a href="">닭가슴살</a></li>
                                    <li><a href="">닭다리</a></li>
                                    <li><a href="">기타</a></li>
                                </ul>
                            </li>

                            <li className="home-menu-span span">고객센터
                                <ul className="home-submenu">
                                    <li><a href="">FAQ</a></li>
                                    <li><a href="">문의하기</a></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>


            <div className="home-body">
                <section className="home-banner">
                    <h1>오늘, 합리적인 가격으로 신선한 고기를</h1>
                    <p>이렇게로 안심, 경매로 알뜰</p>
                    <button className="banner-btn btn">경매 보러가기</button>
                </section>

                <section className="auction-section">
                    <h2>실시간 경매</h2>
                    <div className="auction-list">
                        {/* 여기는 map 돌려서 카드 반복 */}
                        <div className="auction-card">
                            <img src="" alt="한우 등심" />
                            <h3>한우 등심 1++</h3>
                            <p>시작가: 38,000원/100g</p>
                            <p className="price-now">현재가: 28,500원/100g</p>
                            <button className='btn'>입찰하기</button>
                        </div>
                        <div className="auction-card">
                            <img src="" alt="국내산 삼겹살" />
                            <h3>국내산 삼겹살</h3>
                            <p>시작가: 22,000원/100g</p>
                            <p className="price-now">현재가: 16,800원/100g</p>
                            <button className='btn'>입찰하기</button>
                        </div>
                    </div>
                </section>

                <section className="special-section">
                    <h2>오늘의 특가</h2>
                    <div className="special-list">
                        <div className="special-card">
                            <img src="" alt="LA갈비" />
                            <div className="discount-badge">30% 할인</div>
                            <h3>한우 LA갈비</h3>
                            <p><span className="old-price">45,000원/kg</span> → <span className="new-price">31,500원/kg</span></p>
                            <button className='btn'>장바구니 담기</button>
                        </div>
                        <div className="special-card">
                            <img src="" alt="목살 바비큐" />
                            <div className="discount-badge">25% 할인</div>
                            <h3>목살 바비큐 세트</h3>
                            <p><span className="old-price">28,000원/kg</span> → <span className="new-price">21,000원/kg</span></p>
                            <button className='btn'>장바구니 담기</button>
                        </div>
                    </div>
                </section>
            </div>

            <div className="home-footer">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <h5 className="font-bold mb-2">고객센터</h5>
                        <p>전화: 0826-0912</p>
                        <p>이메일: BorderCollie@farmbaro.kr</p>
                        <p>운영시간: 평일 10:00 - 17:00</p>
                    </div>
                    <hr className='hr'></hr>
                    <div>
                        <h5 className="font-bold mb-2">회사 정보</h5>
                        <p>상호명: (주)목장바로</p>
                        <p>대표: 보더콜리즈</p>
                        <p>사업자등록번호: 123-45-67890</p>
                    </div>
                    <hr className='hr'></hr>
                    <div>
                        <h5 className="font-bold mb-2">빠른 링크</h5>
                        <p><a href="#" className="hover:underline">경매 참여하기</a></p>
                        <p><a href="#" className="hover:underline">즉시구매</a></p>
                        <p><a href="#" className="hover:underline">자주 묻는 질문</a></p>
                    </div>
                </div>
                <div className="text-center mt-6 text-sm text-gray-500">
                    © 2025 목장바로. Hello.
                </div>
            </div>
        </div>
    );
}

export default MainHome;