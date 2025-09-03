import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const Bids = () => {
  const { userType, userId } = useParams();
  const [bids, setBids] = useState([]);
  const [wins, setWins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [b1, b2] = await Promise.all([
          fetch(`/api/mypage/buyer/${userId}/bids`),
          fetch(`/api/mypage/buyer/${userId}/winning-bids`)
        ]);
        if (b1.ok) setBids(await b1.json());
        if (b2.ok) setWins(await b2.json());
      } finally {
        setLoading(false);
      }
    };
    if (userType === 'buyer') load();
  }, [userType, userId]);

  if (userType !== 'buyer') return <div style={{ padding: 20 }}>구매자 전용 페이지</div>;
  if (loading) return <div style={{ padding: 20 }}>로딩 중...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>경매 상품</h2>
      <h3>입찰 현황</h3>
      <ul>
        {bids.map((b) => (
          <li key={b.bidId}>{b.itemName || b.auctionId} - {b.bidPrice}원 ({b.bidStatus})</li>
        ))}
      </ul>
      <h3>낙찰 내역</h3>
      <ul>
        {wins.map((w) => (
          <li key={w.bidId}>{w.itemName || w.auctionId} - {w.bidPrice}원</li>
        ))}
      </ul>
    </div>
  );
};

export default Bids;


