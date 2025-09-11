// src/pages/Login/Login.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { http } from "../../api/http";
import "../../styles/auth.css";
import { useDispatch } from "react-redux";
import { fetchCurrentUser } from "../../store/store";


export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keep, setKeep] = useState(false);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const API = process.env.REACT_APP_API_BASE || "http://localhost:8080";

  useEffect(() => {
    if (state?.email) setEmail(state.email);
  }, [state]);

  const decideNextRoute = (user) => {
    // userType 있으면 홈(또는 이전 페이지), 없으면 역할선택
    return user?.userType ? state?.from?.pathname || "/" : "/role-select";
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setMsg("이메일과 비밀번호를 입력해 주세요.");
      return;
    }
    setMsg("");
    setLoading(true);

    try {
      // 세션 로그인
      await http.post(
        "/api/auth/login",
        { email: email.trim(), password, keep },
        { withCredentials: true }
      );

      // 1차: 팀에서 준 store의 fetchCurrentUser 사용 (스토어 수정 없음)
      let user = null;
      try {
        const action = await dispatch(fetchCurrentUser());
        user = action?.payload ?? action; // unwrap 안 써도 payload 우선 사용
      } catch {
        // 2차 폴백: 혹시 thunk의 엔드포인트가 다르면 직접 /me 호출해서 라우팅만 결정
        try {
          const { data } = await http.get("/api/auth/me", { withCredentials: true });
          user = data;
        } catch { /* 무시하고 비로그인 처리 */ }
      }

      const target = state?.from?.pathname || decideNextRoute(user) || "/me";
      navigate(decideNextRoute(user), { replace: true });
    } catch (err) {
      const r = err?.response;
      if (r?.status === 400 && r.data?.message) setMsg(r.data.message);
      else if (r?.status === 401) setMsg("이메일 또는 비밀번호가 올바르지 않습니다.");
      else setMsg(r?.data?.error || "로그인 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <header className="auth-header">
          <div className="auth-brand">
            <span className="leaf" aria-hidden>🌿</span>
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
              disabled={loading}
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
              disabled={loading}
            />
          </div>

          <div className="form-row between">
            <label className="checkbox">
              <input
                type="checkbox"
                checked={keep}
                onChange={(e) => setKeep(e.target.checked)}
                disabled={loading}
              />
              로그인 상태 유지
            </label>

            <button
              type="button"
              className="link-btn"
              onClick={() => navigate("/forgot")}
              disabled={loading}
            >
              비밀번호 찾기
            </button>
          </div>

          {msg && <div className="form-msg" role="alert">{msg}</div>}

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "로그인 중..." : "로그인"}
          </button>

          <div className="auth-divider"><span>또는</span></div>

          <div className="sns-login">
            <button
              type="button"
              className="btn-sns kakao"
              onClick={() => (window.location.href = `${API}/api/auth/oauth/kakao`)}
              disabled={loading}
              aria-label="카카오로 로그인"
            >
              카카오로 시작하기
            </button>

            <button
              type="button"
              className="btn-sns naver"
              onClick={() => (window.location.href = `${API}/api/auth/oauth/naver`)}
              disabled={loading}
              aria-label="네이버로 로그인"
            >
              네이버로 시작하기
            </button>
          </div>
        </form>

        <footer className="auth-footer">
          아직 계정이 없으신가요?{" "}
          <button
            className="link-btn"
            type="button"
            onClick={() => navigate("/signup/select")}
            disabled={loading}
          >
            회원가입
          </button>
        </footer>
      </section>
    </main>
  );
}
