import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentUser, logout, clearAuth } from '../store/store';

import { http } from '../api/http';

import logo from '../images/farmbaro_logo.png';
import './Header.css';
//import logoutLogo from '../images/logout.png'

function Header() {

    // searchKeyword
    const [ searchKeyword, setSearchKeyword ] = useState('');
    const navigate = useNavigate();

    const dispatch = useDispatch();

    const { user, userId, isLoggedIn } = useSelector((state) => state.auth);
    console.log("user 상태:", user);
    console.log("userId 상태:", userId);
    
    // userId가 null이면 로그아웃 상태로 처리
    const isUserLoggedIn = isLoggedIn && userId !== null && userId !== undefined;

    const Search = () => {
        if (searchKeyword) {
            navigate(`/home/search?keyword=${searchKeyword}`);
        }
    };

    const handleLogout = async () => {
        try {
            await http.post("/api/auth/logout");
        } catch (err) {
            console.error("서버 로그아웃 실패:", err);
        } finally {
            // localStorage에서 세션 ID 제거
            localStorage.removeItem('JSESSIONID');
            dispatch(logout()); // Redux 상태 초기화
            dispatch(clearAuth()); // Redux Persist 초기화
            navigate("/");
        }
    };

    const handleInquireClick = (e) => {
        
        e.preventDefault();

        if (isUserLoggedIn) {
            navigate('/cs/inquire');
        } else {
            navigate('/login');
        }
    };

    useEffect(() => {
        console.log("Header useEffect - fetchCurrentUser 호출");
        // localStorage에 세션 ID가 있으면 사용자 정보를 가져옴
        const sessionId = localStorage.getItem('JSESSIONID');
        if (sessionId) {
            console.log("localStorage에 세션 ID 발견, 사용자 정보 조회:", sessionId);
            dispatch(fetchCurrentUser()).then((res) => {
                console.log("Header - fetchCurrentUser 결과:", res);
                console.log("Header - 현재 auth 상태:", { user, userId, isLoggedIn });
                
                // 세션이 무효화된 경우 (사용자 정보가 없는 경우)
                if (!res.payload || !res.payload.id) {
                    console.log("Header - 세션이 무효화됨, 로그아웃 처리");
                    localStorage.removeItem('JSESSIONID');
                    dispatch({ type: 'auth/clearAuth' });
                }
            }).catch((err) => {
                console.error("Header - fetchCurrentUser 에러:", err);
                // 세션 ID가 유효하지 않으면 제거
                localStorage.removeItem('JSESSIONID');
                dispatch({ type: 'auth/clearAuth' });
            });
        } else {
            console.log("localStorage에 세션 ID 없음");
        }
    }, [dispatch]);

    return (
        <div className="home-header">
            <div className='home-logo-search'>
                <div className="home-search-box">
                    <img
                        src={logo} className="logo"
                        onClick={() => navigate("/")} />
                    <div className='main-header-search-box'>
                        <input
                            type="text"
                            className="home-search"
                            placeholder="검색어를 입력하세요"
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    Search();
                                }
                            }}
                        />
                        <button className="home-search-btn">검색</button>
                    </div>
                    <div className="header-buttons">
                        <div className="login-button-slot">
                            {
                                isUserLoggedIn ? (
                                    <button className="home-login-btn btn"
                                        onClick={handleLogout}>로그아웃</button>
                                ) : (
                                    <button
                                        className="home-login-btn btn"
                                        onClick={() => navigate("/login")} >로그인</button>
                                )
                            }
                        </div>
                        {
                            isUserLoggedIn && (
                                <div className="mypage-button-slot">
                                    <button className="home-mypage-btn btn"
                                        onClick={() => navigate("/me")}>마이페이지</button>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
            <hr className='hr'></hr>
            <div className='home-menubar'>
                <div className='home-menu-container'>
                    <ul className="home-menu">

                        <li className="home-menu-span span"
                            onClick={() => navigate("/quote")}>시세
                        </li>

                        <li className="home-menu-span span">경매
                            <ul className="home-submenu">
                                <li><Link to="/auctions">실시간 경매</Link></li>
                                <li><Link to="/auctions/off">지난 경매</Link></li>
                            </ul>
                        </li>

                        <li className="home-menu-span span">소
                            <ul className="home-submenu">
                                <li><Link to="/sale/beef/sirloin">등심</Link></li>
                                <li><Link to="/sale/beef/tenderloin">안심</Link></li>
                                <li><Link to="/sale/beef/ribs">갈비</Link></li>
                                <li><Link to="/sale/beef/etc">기타</Link></li>
                            </ul>
                        </li>

                        <li className="home-menu-span span">돼지
                            <ul className="home-submenu">
                                <li><Link to="/sale/pork/belly">삼겹살</Link></li>
                                <li><Link to="/sale/pork/loin">목살</Link></li>
                                <li><Link to="/sale/pork/ribs">갈비</Link></li>
                                <li><Link to="/sale/pork/etc">기타</Link></li>
                            </ul>
                        </li>

                        <li className="home-menu-span span">닭
                            <ul className="home-submenu">
                                <li><Link to="/sale/chicken/breast">가슴살</Link></li>
                                <li><Link to="/sale/chicken/drumstick">다리</Link></li>
                                <li><Link to="/sale/chicken/etc">기타</Link></li>
                            </ul>
                        </li>

                        <li className="home-menu-span span">고객센터
                            <ul className="home-submenu">
                                <li><Link to="/cs/notice">공지사항</Link></li>
                                <li><Link to="/cs/faq">FAQ</Link></li>
                                <li><Link to="/cs/inquire" onClick={handleInquireClick}>1:1 문의</Link></li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

    );
}

export default Header;