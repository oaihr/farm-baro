import './Quote.css';

function Quote() {

    return (
        <div className='home-main'>
            {/* ====================header======================== */}
            <div className="home-header">
                <div className='home-logo-search'>
                    <div className="home-search-box">
                        <img src='' class="logo" />
                        <div className=''>
                            <input
                                type="text"
                                className="home-search"
                                placeholder="검색어를 입력하세요"
                            />
                            <button className="home-search-btn">검색</button>
                        </div>
                        <div>
                            <button className="home-login-btn btn">로그인</button>
                        </div>
                    </div>
                </div>
                <hr className='hr'></hr>
                <div className='home-menubar'>
                    <div className='home-menu-container'>
                        <ul className="home-menu">

                            <li className="home-menu-span span">시세
                                <ul className="home-submenu">
                                    <li><a href="">소</a></li>
                                    <li><a href="">돼지</a></li>
                                    <li><a href="">닭</a></li>
                                </ul>
                            </li>

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

            <div className='quote'>
                {/* ====================quote-box======================== */}

                <div className="section">
                    <div className="quote-container">
                        <div className="quote">

                            <div className="quote-inner">
                                <div className="">
                                    <img className='quote-img' src='' />
                                    <h3>소</h3>
                                    <p>1.3%</p>
                                </div>
                                <div>
                                    <p>↓ 1.3</p>
                                </div>
                            </div>

                            <div className="quote-inner">
                                <div className="">
                                    <img className='quote-img' src='' />
                                    <h3>돼지</h3>
                                    <p>1.3%</p>
                                </div>
                                <div>
                                    <p>↓ 1.3</p>
                                </div>
                            </div>

                            <div className="quote-inner">
                                <div className="">
                                    <img className='quote-img' src='' />
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


                {/* ====================chart.js======================== */}
                <div className='chart'>

                    <div className="chart-container">

                    </div>
                </div>
            </div>


            <hr className='hr'></hr>
            
            {/* ====================footer======================== */}
            <div className="home-footer">

                <div className="footer-flex">
                    <div className='footer-info-title'>
                        <h4 className="">고객센터</h4>
                        <p>전화: 0826-0912</p>
                        <p>이메일: BorderCollie@farmbaro.kr</p>
                        <p>운영시간: 평일 10:00 - 17:00</p>
                    </div>
                    <hr className='hr'></hr>
                    <div className='footer-info-title'>
                        <h4 className="">회사 정보</h4>
                        <p>상호명: (주)목장바로</p>
                        <p>대표: 보더콜리즈</p>
                        <p>사업자등록번호: 123-45-67890</p>
                    </div>
                    <hr className='hr'></hr>
                    <div className='footer-info-title'>
                        <h4 className="">빠른 링크</h4>
                        <p><a href="#" className="hover:underline">경매 참여하기</a></p>
                        <p><a href="#" className="hover:underline">즉시구매</a></p>
                        <p><a href="#" className="hover:underline">자주 묻는 질문</a></p>
                    </div>
                </div>

                <div className="footer-fin">
                    © 2025 목장바로. Hello.
                </div>
            </div>

        </div>

    );
}

export default Quote;