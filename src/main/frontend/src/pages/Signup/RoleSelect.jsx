import { useNavigate } from "react-router-dom";
import "./role-select.css";

export default function RoleSelect() {
  const nav = useNavigate();

  return (
    <main className="role-page">
      <section className="role-box">
        <header className="role-header">
          <div className="role-brand">
            <span className="leaf">🌿</span>
            목장바로
          </div>
          <h1>회원가입 유형 선택</h1>
          <p>목장바로 플랫폼에서 어떤 역할로 활동하시겠습니까?</p>
        </header>

        <div className="role-grid">
          <article className="role-card">
            <div className="role-icon role-icon--buyer" aria-hidden />
            <h3>구매자로 가입하기</h3>
            <ul className="role-list">
              <li>실시간 경매 참여</li>
              <li>즉시구매 참여</li>
              <li>축산물 시세 정보 확인</li>
              <li>구매 이력 관리</li>
            </ul>
            <button className="role-btn" onClick={() => nav("/signup/buyer")}>
              구매자로 시작하기
            </button>
          </article>

          <article className="role-card">
            <div className="role-icon role-icon--seller" aria-hidden />
            <h3>판매자로 가입하기</h3>
            <ul className="role-list">
              <li>경매 및 즉시구매 상품 등록</li>
              <li>판매 상품 관리</li>
              <li>실시간 입찰 현황</li>
              <li>판매 내역 및 수익 관리</li>
            </ul>
            <button className="role-btn" onClick={() => nav("/signup/seller")}>
              판매자로 시작하기
            </button>
          </article>
        </div>

        <footer className="role-footer">
          <span>이미 계정이 있으신가요?</span>
          <button className="link" onClick={() => nav("/login")}>로그인하기</button>
        </footer>
      </section>
    </main>
  );
}
