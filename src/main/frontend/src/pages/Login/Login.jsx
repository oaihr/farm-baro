// src/pages/Login/Login.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchCurrentUser } from "../../store/store";
import { http } from "../../api/http";
import "../../styles/auth.css"; // 공통 스타일

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation(); // 회원가입 완료 후 이메일 프리필용

  const [ email, setEmail ] = useState("");
  const [ password, setPassword ] = useState("");
  const [ keep, setKeep ] = useState(false);
  const [ msg, setMsg ] = useState("");
  const [ loading, setLoading ] = useState(false);

  // 가입 직후 전달된 이메일 표시
  useEffect(() => {
    if (state?.email) setEmail(state.email);
  }, [ state ]);

   const onSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) return setMsg("이메일과 비밀번호를 입력해 주세요.");
    setMsg("");
    setLoading(true);

    try {
      // 서버 요구 스키마: { email, password } (백엔드에서 email 필드로 받지만 ID/이메일 모두 처리)
      const res = await http.post(
        "/api/auth/login",
        { email: email.trim(), password, keep }, // 이메일로 로그인
        { withCredentials: true }              // ★ 세션 쿠키 받기
      );

      if (res.status >= 200 && res.status < 300) {
        console.log("로그인 성공! 응답:", res);
        console.log("응답 데이터:", res.data);
        console.log("응답 헤더:", res.headers);
        console.log("로그인 후 쿠키:", document.cookie);
        
        // 백엔드에서 받은 세션 ID를 localStorage에 저장
        if (res.data && res.data.sessionId) {
          console.log("세션 ID 받음:", res.data.sessionId);
          
          // localStorage에 세션 ID 저장
          localStorage.setItem('JSESSIONID', res.data.sessionId);
          console.log("세션 ID를 localStorage에 저장 완료");
          
          // 쿠키도 시도해보기
          document.cookie = `JSESSIONID=${res.data.sessionId}; path=/; SameSite=Lax`;
          console.log("쿠키 설정 시도:", document.cookie);
        }
        
        // 로그인 성공 후 Redux 상태 완전 초기화
        dispatch({ type: 'auth/clearAuth' });
        
        // 쿠키 설정 후 서버에서 실제 사용자 정보 가져오기
        setTimeout(() => {
          console.log("쿠키 설정 후 쿠키 상태:", document.cookie);
          console.log("fetchCurrentUser 호출 시작...");
          
          dispatch(fetchCurrentUser()).then((result) => {
            console.log("fetchCurrentUser 결과:", result);
            if (result.payload) {
              console.log("사용자 정보 로드 성공:", result.payload);
            } else {
              console.log("사용자 정보 로드 실패");
            }
          }).catch((error) => {
            console.error("fetchCurrentUser 에러:", error);
          });
        }, 100);
        
        // 로그인 성공 후 원래 요청했던 페이지로 이동
        const from = state?.from?.pathname || "/";
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
          <div className="login-input">
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

          <div className="password-input">
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
