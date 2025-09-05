// src/pages/Sale/Sale.jsx
import { useParams } from "react-router-dom";

export default function Sale() {
  const { kind, type } = useParams();
  return (
    <div style={{ padding: 24 }}>
      <h2>판매 목록</h2>
      <p>kind: {kind || "전체"}</p>
      <p>type: {type || "전체"}</p>
      {/* TODO: kind/type로 필터링된 목록 렌더링 */}
    </div>
  );
}
