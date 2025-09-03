import { useEffect, useState } from "react";
import { http } from "../api/http";

export default function MyPage(){
  const [me, setMe] = useState(null);

  const load = async () => {
    try{ const r = await http.get("/api/auth/me"); setMe(r.data); }
    catch{ setMe({loggedIn:false}); }
  };
  useEffect(()=>{ load(); },[]);

  const logout = async () => { await http.post("/api/auth/logout"); load(); };

  if(!me) return null; // 로딩
  if(!me.loggedIn) return <div>로그인 필요</div>;
  return (
    <div>
      <h2>MyPage</h2>
      <div>{me.name} ({me.email})</div>
      <button onClick={logout}>로그아웃</button>
    </div>
  );
}
