import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../images/farmbaro_logo.png';
import './Header.css';

function Header(){
    return(
        <div className="home-header">
                <div className='home-logo-search'>
                    <div className="home-search-box">
                        <img src={logo} className="logo" />
                        <div className='search-box'>
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
                                    <li><Link to="/quote/beef">소고기</Link></li>
                                    <li><Link to="/quote/pork">돼지고기</Link></li>
                                    <li><Link to="/quote/chicken">닭고기</Link></li>
                                </ul>
                            </li>
                            
                            <li className="home-menu-span span">경매
                                <ul className="home-submenu">
                                    <li><Link to="/auctions">실시간 경매</Link></li>
                                    <li><Link to="/auctions/past">지난 경매</Link></li>
                                </ul>
                            </li>

                            <li className="home-menu-span span">소고기
                                <ul className="home-submenu">
                                    <li><Link to="/sale/beef/sirloin">등심</Link></li>
                                    <li><Link to="/sale/beef/tenderloin">안심</Link></li>
                                    <li><Link to="/sale/beef/ribs">갈비</Link></li>
                                    <li><Link to="/sale/beef/etc">기타</Link></li>
                                </ul>
                            </li>

                            <li className="home-menu-span span">돼지고기
                                <ul className="home-submenu">
                                    <li><Link to="/sale/pork/belly">삼겹살</Link></li>
                                    <li><Link to="/sale/pork/loin">목살</Link></li>                                    
                                    <li><Link to="/sale/pork/ribs">갈비</Link></li>
                                    <li><Link to="/sale/pork/etc">기타</Link></li>
                                </ul>
                            </li>

                            <li className="home-menu-span span">닭고기
                                <ul className="home-submenu">
                                    <li><Link to="/sale/chicken/breast">가슴살</Link></li>                                    
                                    <li><Link to="/sale/chicken/drumstick">다리살</Link></li>
                                    <li><Link to="/sale/chicken/etc">기타</Link></li>
                                </ul>
                            </li>

                            <li className="home-menu-span span">고객센터
                                <ul className="home-submenu">
                                    <li><Link to="/cs/faq" >FAQ</Link></li>
                                    <li><Link to="/cs/inquire">문의하기</Link></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        
    );
}

export default Header;