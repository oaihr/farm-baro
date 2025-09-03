// src/account/Login.js
import { useState } from "react";
import { http } from "../api/http";   // 경로 주의! account → api 로 올라가서 import

export default function Login(){
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const ping = async () => {
    const r = await http.get("/api/ping"); // proxy 덕분에 /FarmBaro 자동 프록시
    setMsg(r.data); // "pong" 기대
  };

  const login = async (e) => {
    e.preventDefault(); 
    const r = await http.post("/api/login-stub?email=" + encodeURIComponent(email));
    setMsg(r.data); // "ok" 기대
  };

  const me = async () => {
    const r = await http.get("/api/me");
    setMsg(r.data); // "login user : ..." 기대
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Login (stub)</h1>

      <button onClick={ping}>/api/ping</button>

      <form onSubmit={login} style={{ marginTop: 12 }}>
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="email"
        />
        <button type="submit">로그인(임시)</button>
      </form>

      <button onClick={me} style={{ marginLeft: 8 }}>/api/me</button>

      <div style={{ marginTop: 12 }}>{msg}</div>
    </div>
  );
}
