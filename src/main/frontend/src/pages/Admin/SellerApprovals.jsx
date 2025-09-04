// 임시 관리자 승인페이지

import { useEffect, useState } from "react";
import { http } from "../../api/http";

export default function SellerApprovals(){
  const [rows, setRows] = useState([]);
  const load = async () => {
    const { data } = await http.get("/api/admin/sellers", { params:{ status:"PENDING" }});
    setRows(data || []);
  };
  useEffect(() => { load(); }, []);

  const act = async (id, type) => {
    await http.post(`/api/admin/sellers/${id}/${type}`);
    await load();
  };

  return (
    <div className="page">
      <h2>판매자 검수 대기</h2>
      <table className="table">
        <thead><tr><th>이메일</th><th>이름</th><th>사업자번호</th><th>상태</th><th>액션</th></tr></thead>
        <tbody>
          {rows.map(r=>(
            <tr key={r.ID}>
              <td>{r.EMAIL}</td><td>{r.USER_NAME}</td><td>{r.BUSINESS_NUMBER}</td>
              <td>{r.USER_STATUS}</td>
              <td>
                <button onClick={()=>act(r.ID,"approve")}>승인</button>
                <button onClick={()=>act(r.ID,"reject")} className="ghost ml8">반려</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
