// src/pages/account/RoleSelect.jsx
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { http } from "../../api/http";
import "./role-select.css";

export default function RoleSelect() {
  const nav = useNavigate();
  const [snsMode, setSnsMode] = useState(false); // SNS 첫 로그인(역할 없음)인지
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // 진입 시 세션 상태 확인
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await http.get("/api/auth/me", { withCredentials: true });
        if (!mounted) return;

        if (!data?.id) {
          // 미로그인 → 일반 가입 플로우(구매자/판매자 가입 마법사로 보낼 준비)
          setSnsMode(false);
          return;
        }

        if (!data.userType) {
          // SNS 첫 로그인: 역할 미정
          setSnsMode(true);
        } else {
          // 이미 역할 있음 → 홈으로
          nav("/", { replace: true });
        }
      } catch {
        if (!mounted) return;
        setSnsMode(false);
      }
    })();
    return () => { mounted = false; };
  }, [nav]);

  const choose = async (role) => {
    setError("");

    // 일반 가입: 각 가입 마법사로 이동
    if (!snsMode) {
      nav(role === "BUYER" ? "/signup/buyer" : "/signup/seller");
      return;
    }

    // SNS 첫 로그인: 역할만 저장하고 홈으로
    try {
      setBusy(true);
      await http.post(
        "/api/auth/me/user-type",
        { userType: role },              // ★ 선택한 role 값을 그대로 전송
        { withCredentials: true }
      );
      nav("/", { replace: true });
    } catch {
      setError("역할 저장 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="role-page">
      <section className="role-box">
        <header className="role-header">
          <div className="role-brand">
            <span className="leaf">🌿</span>
            목장바로
          </div>
          <h1>{snsMode ? "역할 선택" : "회원가입 유형 선택"}</h1>
          <p>
            {snsMode
              ? "처음 SNS 로그인 하셨네요. 활동하실 역할을 선택해 주세요."
              : "목장바로 플랫폼에서 어떤 역할로 활동하시겠습니까?"}
          </p>
        </header>

        {error && <p className="role-error">{error}</p>}

        <div className="role-grid">
          <article className="role-card">
            <div className="role-icon role-icon--buyer" aria-hidden />
            <h3>구매자</h3>
            <ul className="role-list">
              <li>실시간 경매 참여</li>
              <li>즉시구매 참여</li>
              <li>축산물 시세 정보 확인</li>
              <li>구매 이력 관리</li>
            </ul>
            <button className="role-btn" disabled={busy} onClick={() => choose("BUYER")}>
              {snsMode ? "구매자로 시작하기" : "구매자로 가입하기"}
            </button>
          </article>

          <article className="role-card">
            <div className="role-icon role-icon--seller" aria-hidden />
            <h3>판매자</h3>
            <ul className="role-list">
              <li>경매 및 즉시구매 상품 등록</li>
              <li>판매 상품 관리</li>
              <li>실시간 입찰 현황</li>
              <li>판매 내역 및 수익 관리</li>
            </ul>
            <button className="role-btn" disabled={busy} onClick={() => choose("SELLER")}>
              {snsMode ? "판매자로 시작하기" : "판매자로 가입하기"}
            </button>
          </article>
        </div>

        {!snsMode && (
          <footer className="role-footer">
            <span>이미 계정이 있으신가요?</span>
            <button className="link" onClick={() => nav("/login")}>로그인하기</button>
          </footer>
        )}
      </section>
    </main>
  );
}
