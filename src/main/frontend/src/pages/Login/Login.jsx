// src/pages/Login/Login.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { http } from "../../api/http";
import "../../styles/auth.css"; // 공통 스타일
import { useDispatch } from "react-redux";
import { fetchCurrentUser } from "../../store/store";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation(); // 회원가입 완료 후 이메일 프리필용

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keep, setKeep] = useState(false);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // 가입 직후 전달된 이메일 표시
  useEffect(() => {
    if (state?.email) setEmail(state.email);
  }, [state]);

   const onSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) return setMsg("이메일과 비밀번호를 입력해 주세요.");
    setMsg("");
    setLoading(true);

    try {
      const res = await http.post(
        "/api/auth/login",
        { email: email.trim(), password, keep },
        { withCredentials: true }
      );

      if (res.status >= 200 && res.status < 300) {
        // ✅ 로그인 성공 후 Redux에 로그인 상태 반영
        await dispatch(fetchCurrentUser());

        const from = state?.from?.pathname || "/me";
        navigate(from, { replace: true });
      } else {
        setMsg("로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.");
      }
    } catch (err) {
      const r = err?.response;
      if (r?.status === 400 && r.data?.message) {
        setMsg(r.data.message);
      } else if (r?.status === 401) {
        setMsg("이메일 또는 비밀번호가 올바르지 않습니다.");
      } else {
        setMsg(r?.data?.error || "로그인 중 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <header className="auth-header">
          <div className="auth-brand">
            <span className="leaf" aria-hidden >🌿</span>
            목장바로
          </div>
          <h1>로그인</h1>
        </header>

        <form className="auth-form" onSubmit={onSubmit} noValidate>
          <div className="form-row">
            <label className="sr-only" htmlFor="email">이메일</label>
            <input
              id="email"
              type="email"
              className="input"
              placeholder="이메일을 입력하세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div className="form-row">
            <label className="sr-only" htmlFor="password">비밀번호</label>
            <input
              id="password"
              type="password"
              className="input"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <div className="form-row between">
            <label className="checkbox">
              <input
                type="checkbox"
                checked={keep}
                onChange={(e) => setKeep(e.target.checked)}
              />
              로그인 상태 유지
            </label>

            <button
              type="button"
              className="link-btn"
              onClick={() => alert("비밀번호 찾기 기능은 추후 연결됩니다.")}
            >
              비밀번호 찾기
            </button>
          </div>

          {msg && (
            <div className="form-msg" role="alert" aria-live="assertive">
              {msg}
            </div>
          )}

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "로그인 중..." : "로그인"}
          </button>

          <div className="auth-divider">
            <span>또는</span>
          </div>

          <div className="sns-row">
            <button type="button" className="btn-ghost" onClick={() => alert("카카오 로그인 준비 중")}>
              카카오 로그인
            </button>
            <button type="button" className="btn-ghost" onClick={() => alert("네이버 로그인 준비 중")}>
              네이버 로그인
            </button>
          </div>
        </form>

        <footer className="auth-footer">
          아직 계정이 없으신가요?{" "}
          <button className="link-btn" type="button" onClick={() => navigate("/signup/select")}>
            회원가입
          </button>
        </footer>
      </section>
    </main>
  );
}
