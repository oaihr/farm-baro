import React, { useState } from 'react';
import './InquirePage.css';

const InquirePage = () => {
  
  const [inquiries, setInquiries] = useState([
    { id: 1, type: '회원/정보관리', title: '페이코도 결제수단 추가되는지 문의드려요~', date: '2025-08-23', status: '답변 완료' },
    { id: 2, type: '상품/이벤트', title: '이벤트가 조기마감되기도 하나요?', date: '2025-08-26', status: '답변 완료' },
    { id: 3, type: '배송/교환/환불', title: '배송지 변경 요청합니다.', date: '2025-08-28', status: '답변 완료' },
    { id: 4, type: '기타', title: '온라인 판매도 진행하나요?', date: '2025-09-12', status: '답변 대기' },
  ]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('제목');
  
  const [showModal, setShowModal] = useState(false);

  const [inquiryType, setInquiryType] = useState('회원/정보관리');
  const [inquiryTitle, setInquiryTitle] = useState('');
  const [inquiryContent, setInquiryContent] = useState('');

  const filteredInquiries = inquiries.filter(inquiry => {
    if (searchType === '제목') {
      return inquiry.title.includes(searchQuery);
    }
    return false;
  });

  const handleInquire = () => {
    if (!inquiryTitle || !inquiryContent) {
      alert('문의 제목과 내용을 모두 입력해주세요.');
      return;
    }
    
    const newId = inquiries.length > 0 ? Math.max(...inquiries.map(i => i.id)) + 1 : 1;
    
    const newInquiry = {
      id: newId,
      type: inquiryType,
      title: inquiryTitle,
      date: new Date().toISOString().slice(0, 10),
      status: '답변 대기'
    };
    
 
    setInquiries([...inquiries, newInquiry]);
    
    setShowModal(false);
    setInquiryType('회원/정보관리');
    setInquiryTitle('');
    setInquiryContent('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setSearchQuery(e.target.value); 
    }
  };

  return (
    <div className="inquire-page-container">
      <div className="inquire-page-header">
        <h1 className="inquire-title">1:1 문의</h1>
      </div>
      <div className="inquire-search-bar">
        <select
          className="search-select"
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
        >
          <option>제목</option>
        </select>
        <input
          type="text"
          className="search-input"
          placeholder="검색어를 입력하세요."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className="inquire-table-container">
        <table className="inquire-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>문의 유형</th>
              <th>제목</th>
              <th>문의일</th>
              <th>답변 상태</th>
            </tr>
          </thead>
          <tbody>
            {filteredInquiries.length > 0 ? (
              filteredInquiries.map((inquiry) => (
                <tr key={inquiry.id}>
                  <td>{inquiry.id}</td>
                  <td>{inquiry.type}</td>
                  <td>{inquiry.title}</td>
                  <td>{inquiry.date}</td>
                  <td className={`status-cell ${inquiry.status === '답변 대기' ? 'status-pending' : 'status-complete'}`}>
                    {inquiry.status}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-inquiries">문의 내역이 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className='inquire-button-box'>
        <button className='inquire-button' onClick={() => setShowModal(true)}>문의하기</button>
      </div>
      <div className="pagination">
        <span className="pagination-link">&lt;</span>
        <span className="pagination-page active">1</span>
        <span className="pagination-link">&gt;</span>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>1:1 문의하기</h2>
            <div className="form-group">
              <label>문의 유형</label>
              <select value={inquiryType} onChange={(e) => setInquiryType(e.target.value)}>
                <option>회원/정보관리</option>
                <option>상품/이벤트</option>
                <option>배송/교환/환불</option>
                <option>기타</option>
              </select>
            </div>
            <div className="form-group">
              <label>제목</label>
              <input type="text" value={inquiryTitle} onChange={(e) => setInquiryTitle(e.target.value)} />
            </div>
            <div className="form-group">
              <label>내용</label>
              <textarea value={inquiryContent} onChange={(e) => setInquiryContent(e.target.value)}></textarea>
            </div>
            <div className="modal-buttons">
              <button onClick={handleInquire}>등록</button>
              <button onClick={() => setShowModal(false)}>취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InquirePage;
