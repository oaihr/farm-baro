import React, { useState } from 'react';
import './Notice.css';

// 더미 데이터 (실제 데이터로 교체 가능)
const dummyNotices = [
  { id: 963, type: '[이벤트]', title: '9/4(목) 한우 등심 1+등급 할인 이벤트 당첨자 안내', author: '목장바로', date: '2025.09.04', isFixed: false },
  { id: 962, type: '[이벤트]', title: '09/03(수) 생방송 한돈 삼겹살 퀴즈 이벤트 당첨자 안내', author: '목장바로', date: '2025.09.03', isFixed: false },
  { id: 961, type: '[이벤트]', title: '9/2(화) 프리미엄 양갈비 첫 구매 혜택 당첨자 안내', author: '목장바로', date: '2025.09.03', isFixed: false },
  { id: 960, type: '[이벤트]', title: '8/27(수) 돼지고기 특수부위 라이브 방송 당첨자 안내', author: '목장바로', date: '2025.08.27', isFixed: false },
  { id: 959, type: '[이벤트]', title: '8/26(화) 스테이크용 채끝살 묶음 구매 인증 당첨자 안내', author: '목장바로', date: '2025.08.27', isFixed: false },
  { id: 958, type: '[이벤트]', title: '8/25(일) 목장바로 앱 전용 할인 쿠폰 변경 안내', author: '목장바로', date: '2025.08.26', isFixed: false },
  { id: 957, type: '[안내]', title: '안심하고 먹을 수 있는 무항생제 돼지고기 입고 안내', author: '목장바로', date: '2025.08.25', isFixed: false },
  { id: 956, type: '[이벤트]', title: '8/21(목) 한우 1등급 소고기 증정 이벤트 당첨자 안내', author: '목장바로', date: '2025.08.22', isFixed: false },
];

const fixedNotices = [
  { id: 1000, type: '[안내]', title: '9월 명절 배송 일정 및 고객센터 휴무 안내', author: '목장바로', date: '2025.08.28', isFixed: true },
  { id: 999, type: '[안내]', title: '축산물 품질 및 위생 관리 규정 변경 안내', author: '목장바로', date: '2022.07.27', isFixed: true },
];

const NoticePage = () => {
  const [notices, setNotices] = useState([...fixedNotices, ...dummyNotices]);

  return (
    <div className="notice-page-container">
      <div className="notice-page-header">
        <h1 className="notice-title">공지사항</h1>
        <p className="notice-subtitle">목장바로의 새로운 소식들과 유용한 정보들을 한곳에서 확인하세요.</p>
      </div>

      <div className="notice-table-container">
        <table className="notice-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>제목</th>
              <th>작성자</th>
              <th>작성일</th>
            </tr>
          </thead>
          <tbody>
            {notices.length > 0 ? (
              notices.map((notice) => (
                <tr key={notice.id} className={notice.isFixed ? 'fixed-row' : ''}>
                  <td>{notice.isFixed ? '공지' : notice.id}</td>
                  <td>
                    {notice.type} {notice.title}
                  </td>
                  <td>{notice.author}</td>
                  <td>{notice.date}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="no-notices">공지사항이 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <span className="pagination-link">&lt;</span>
        <span className="pagination-page active">1</span>
        <span className="pagination-link">&gt;</span>
      </div>
    </div>
  );
};

export default NoticePage;