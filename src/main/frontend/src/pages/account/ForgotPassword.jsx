import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { http } from "../../api/http";
import "../../styles/auth.css";

export default function ForgotPassword() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [requestId, setRequestId] = useState("");
  const [code, setCode] = useState("");
  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");
  const [msg, setMsg] = useState("");
  const [phase, setPhase] = useState("enter-email"); // enter-email | verify-reset
  const [loading, setLoading] = useState(false);

  const sendCode = async () => {
    if (!email.trim()) return setMsg("이메일을 입력하세요.");
    setMsg(""); setLoading(true);
    try {
      const res = await http.post("/api/auth/password/forgot",
        { email: email.trim() },
        { withCredentials: true }
      );
      if (res.data?.ok && res.data?.requestId) {
        setRequestId(res.data.requestId);
        setPhase("verify-reset");
        setMsg("인증코드를 이메일로 보냈습니다. (10분 유효)");
      } else {
        setMsg(res.data?.message || "코드 발송 실패");
      }
    } catch (e) {
      setMsg(e?.response?.data?.message || "코드 발송 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const resetPass = async () => {
    if (!code || !pw1 || !pw2) return setMsg("모든 항목을 입력하세요.");
    if (pw1 !== pw2) return setMsg("비밀번호 확인이 일치하지 않습니다.");
    if (!/^(?=.*[A-Za-z])(?=.*\d).{8,25}$/.test(pw1))
      return setMsg("비밀번호: 영문+숫자 8~25자");

    setMsg(""); setLoading(true);
    try {
      const res = await http.post("/api/auth/password/reset",
        { email, requestId, code, newPass: pw1 },
        { withCredentials: true }
      );
      if (res.status === 204) {
        alert("비밀번호가 변경되었습니다. 새 비밀번호로 로그인해 주세요.");
        nav("/login", { replace: true, state: { email } });
      } else {
        setMsg(res?.data?.message || "비밀번호 변경 실패");
      }
    } catch (e) {
      setMsg(e?.response?.data?.message || "비밀번호 변경 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <header className="auth-header">
          <div className="auth-brand"><span className="leaf" aria-hidden>🌿</span>목장바로</div>
          <h1>비밀번호 재설정</h1>
        </header>

        {phase === "enter-email" && (
          <div className="auth-form">
            <div className="form-row">
              <input className="input" type="email" placeholder="가입한 이메일"
                     value={email} onChange={(e)=>setEmail(e.target.value)} />
            </div>
            {msg && <div className="form-msg" role="alert">{msg}</div>}
            <button className="btn-primary" onClick={sendCode} disabled={loading}>
              {loading ? "발송 중..." : "인증코드 보내기"}
            </button>
          </div>
        )}

        {phase === "verify-reset" && (
          <div className="auth-form">
            <div className="form-row">
              <input className="input" type="text" placeholder="이메일로 받은 6자리 코드"
                     value={code} onChange={(e)=>setCode(e.target.value)} />
            </div>
            <div className="form-row">
              <input className="input" type="password" placeholder="새 비밀번호"
                     value={pw1} onChange={(e)=>setPw1(e.target.value)} />
            </div>
            <div className="form-row">
              <input className="input" type="password" placeholder="새 비밀번호 확인"
                     value={pw2} onChange={(e)=>setPw2(e.target.value)} />
            </div>
            {msg && <div className="form-msg" role="alert">{msg}</div>}
            <button className="btn-primary" onClick={resetPass} disabled={loading}>
              {loading ? "변경 중..." : "비밀번호 변경"}
            </button>

            <button className="link-btn" style={{marginTop:12}}
                    onClick={() => { setPhase("enter-email"); setMsg(""); }}>
              이메일 다시 입력
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
