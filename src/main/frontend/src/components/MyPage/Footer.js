import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer(){
    return(
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
                        <p><Link to="/auctions">경매 참여하기</Link></p>
                        <p><Link to="/cs/faq">자주 묻는 질문</Link></p>
                    </div>
                </div>

                <div className="footer-fin">
                    © 2025 목장바로. Hello.
                </div>
            </div>

    );
}

export default Footer;