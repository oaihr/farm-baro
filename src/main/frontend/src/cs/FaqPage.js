import React, { useState } from 'react';
import './FaqPage.css'; // ✅ CSS 파일을 import 합니다.

const faqData = [
  {
    id: 1,
    question: '주문한 고기는 언제 받을 수 있나요?',
    answer: '평일 오후 2시 이전에 주문하시면 당일 발송되어<br />다음 날 받아보실 수 있습니다. 도서 산간 지역은 배송이 1~2일 더 소요될 수 있습니다.',
  },
  {
    id: 2,
    question: '배송받은 고기를 냉동 보관해도 되나요?',
    answer: '네, 가능합니다. 고기를 장기 보관하려면<br />받으신 즉시 소분하여 밀봉한 후 냉동 보관해 주세요.<br />단, 냉동 시 고기의 식감이 다소 변할 수 있습니다.',
  },
  {
    id: 3,
    question: '고기가 변질되어 도착했어요. 어떻게 해야 하나요?',
    answer: '사진과 함께 고객센터에 문의해 주시면<br />신속하게 확인 후 재배송 또는 환불 처리를 도와드리겠습니다.<br />상품 수령 후 24시간 내에 연락 주셔야 합니다.',
  },
  {
    id: 4,
    question: '회원 등급별 혜택은 무엇인가요?',
    answer: '회원 등급에 따라 구매 금액의 일정 비율을 포인트로 적립해 드립니다.<br />자세한 내용은 마이페이지에서 확인하실 수 있습니다.',
  },
  {
    id: 5,
    question: '주문을 취소하고 싶어요.',
    answer: '주문 당일 오후 2시 이전까지 고객센터로 연락 주시면<br />취소 처리가 가능합니다. 이후에는 상품이 이미 발송되었을 수 있어<br />취소가 어려울 수 있습니다.',
  },
  {
    id: 6,
    question: '주문 시 원하는 배송일자를 지정할 수 있나요?',
    answer: '네, 주문/결제 단계에서 원하시는 배송 희망일자를 선택하실 수 있습니다.<br />지정일에 맞춰 신선하게 배송해 드립니다.',
  },
  {
    id: 7,
    question: '정기 배송 서비스도 제공하나요?',
    answer: '현재 정기 배송 서비스는 준비 중에 있습니다.<br />추후 서비스가 오픈되면 홈페이지 공지사항을 통해 안내해 드리겠습니다.',
  },
];


const FaqPage = () => {
  const [openAnswerId, setOpenAnswerId] = useState(null);

  const toggleAnswer = (id) => {
    setOpenAnswerId(openAnswerId === id ? null : id);
  };

  return (
    <div className="faq-page-container">
      <h1 className="faq-header">무엇을 도와드릴까요?</h1>
      <div className="search-container">
        <input 
          type="text" 
          className="search-input" 
          placeholder="궁금하신 점을 검색해 보세요." 
        />
      </div>
      
      <h2 className="section-header">자주 묻는 질문</h2>

      {faqData.map((item) => (
        <div 
          className="question-item" 
          key={item.id} 
          onClick={() => toggleAnswer(item.id)}
        >
          <div className="question-title">
            <span className="question-icon">Q.</span>
            {item.question}
          </div>
          {openAnswerId === item.id && (
            <div className="answer-content" dangerouslySetInnerHTML={{ __html: item.answer }} >
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FaqPage;