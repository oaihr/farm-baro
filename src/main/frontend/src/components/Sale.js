import React from 'react';
import { useParams } from 'react-router-dom';

function Sale() {
  const { kind, type } = useParams();
  
  return (
    <div style={{ padding: '20px', minHeight: '60vh' }}>
      {kind && type ? (
        <div>
          <h1>판매 페이지</h1>
          <p>종류: {kind}</p>
          <p>타입: {type}</p>
        </div>
      ) : (
        <div>
          <h1>Farm Baro 메인 페이지</h1>
          <p>신선한 농산물을 만나보세요!</p>
          <div style={{ marginTop: '20px' }}>
            <h3>테스트 링크:</h3>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '10px' }}>
              <a href="/mypage/buyer/buyer001" style={{ color: 'blue', textDecoration: 'underline' }}>
                구매자 마이페이지
              </a>
              <a href="/mypage/seller/seller001" style={{ color: 'blue', textDecoration: 'underline' }}>
                판매자 마이페이지
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Sale;
