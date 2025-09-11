// src/pages/Signup/Signup.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { http } from "../../api/http";
import styles from "./Signup.module.css";

export default function Signup({ role }) {
  const isSeller = role === "SELLER";
  const navigate = useNavigate();

  // 규칙
  const PASS_RE = /^(?=.*[A-Za-z])(?=.*\d).{8,25}$/;   // 영문+숫자 포함, 8~25자
  const TEL_RE  = /^010-\d{4}-\d{4}$/;                // 010-0000-0000

  // 전화번호 자동 포맷
  const formatPhone = (s) => {
    const d = s.replace(/\D/g, "").slice(0, 11);
    if (d.length < 4) return d;
    if (d.length < 8) return `${d.slice(0,3)}-${d.slice(3)}`;
    return `${d.slice(0,3)}-${d.slice(3,7)}-${d.slice(7)}`;
  };

  // 사업자번호 포맷/검증
  const normalizeBizNo = (s) => (s || "").replace(/\D/g, "").slice(0, 10);
  const formatBizNo = (s) => {
    const n = normalizeBizNo(s);
    if (n.length <= 3) return n;
    if (n.length <= 5) return `${n.slice(0,3)}-${n.slice(3)}`;
    return `${n.slice(0,3)}-${n.slice(3,5)}-${n.slice(5)}`;
  };
  const isValidBizNo = (num) => {
    const n = normalizeBizNo(num);
    if (n.length !== 10) return false;
    const d = n.split("").map(Number);
    const w = [1,3,7,1,3,7,1,3,5];
    let sum = 0;
    for (let i=0;i<9;i++) sum += d[i]*w[i];
    sum += Math.floor((d[8]*5)/10);
    const check = (10 - (sum % 10)) % 10;
    return check === d[9];
  };
  const HOMETAX_URL =
    "https://hometax.go.kr/websquare/websquare.html?w2xPath=/ui/pp/index_pp.xml&tmIdx=43&tm2lIdx=4306000000&tm3lIdx=4306080000";

  const [form, setForm] = useState({
    email: "",
    password: "",
    userName: "",
    tel: "",
    address: "",
    businessNumber: "",
    provider: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState("");

  const onChange = (e) => {
    const { name, value } = e.target;
    const next =
      name === "tel"
        ? formatPhone(value)
        : name === "businessNumber"
        ? formatBizNo(value)
        : value;
    setForm((f) => ({ ...f, [name]: next }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setMsg("");
  };

  // 홈택스 새탭 + 번호 복사
  const openHometax = async () => {
    const no = normalizeBizNo(form.businessNumber);
    if (!isValidBizNo(no)) {
      alert("유효하지 않은 사업자등록번호입니다.");
      return;
    }
    try { await navigator.clipboard.writeText(no); } catch {}
    window.open(HOMETAX_URL, "_blank", "noopener,noreferrer");
    alert("사업자번호가 복사되었습니다. 홈택스 새 탭에서 붙여넣기 해주세요.");
  };

  // 가벼운 클라이언트 검증
  const validate = () => {
    const e = {};
    const { email, password, userName, tel, address, businessNumber, provider } = form;

    if (!email.trim() || !email.includes("@")) e.email = "올바른 이메일 형식이 아닙니다.";
    if (!PASS_RE.test(password)) e.password = "비밀번호는 8~25자, 영문+숫자 조합이어야 합니다.";
    if (!userName.trim() || userName.trim().length < 2) e.userName = "이름은 2자 이상 입력해주세요.";
    if (!TEL_RE.test(tel)) e.tel = "전화번호는 010-0000-0000 형식으로 입력해주세요.";

    if (isSeller) {
      if (!address.trim())        e.address = "사업장 주소를 입력해주세요.";
      if (!businessNumber.trim()) e.businessNumber = "사업자등록번호를 입력해주세요.";
      else if (!isValidBizNo(businessNumber)) e.businessNumber = "유효하지 않은 사업자등록번호입니다.";
      if (!provider.trim())       e.provider = "농장/브랜드명을 입력해주세요.";
    }
    return e;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const eMap = validate();
    if (Object.keys(eMap).length) {
      setErrors(eMap);
      setMsg("입력값을 확인해 주세요.");
      return;
    }

    setSubmitting(true);
    setErrors({});
    setMsg("");

    try {
      const payload = {
        email: form.email.trim(),
        password: form.password,
        userName: form.userName.trim(),
        tel: form.tel,
        ...(isSeller && {
          address: form.address.trim(),
          businessNumber: normalizeBizNo(form.businessNumber),
          provider: form.provider.trim(),
        }),
      };

      await http.post("/api/auth/signup", payload);
      alert("회원가입이 완료되었습니다. 로그인 해주세요.");
      navigate("/login", { replace: true, state: { email: form.email } });
    } catch (err) {
      const res = err.response;
      if (res?.status === 400 && res.data?.errors) {
        setErrors(res.data.errors);
        setMsg(res.data.message || "입력값을 확인해 주세요.");
      } else if (res?.status === 409) {
        const m = typeof res.data === "string"
          ? res.data
          : (res.data.message || "이미 가입된 이메일입니다.");
        setErrors((prev) => ({ ...prev, email: m }));
        setMsg(m);
      } else {
        setMsg(res?.data?.error || "가입 중 오류가 발생했습니다.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>회원가입 ({isSeller ? "판매자" : "구매자"})</h2>

      <form className={styles.form} onSubmit={onSubmit} noValidate>
        <div className={styles.field}>
          <input
            name="email"
            type="email"
            className={styles.input}
            placeholder="이메일"
            value={form.email}
            onChange={onChange}
            required
          />
          {errors.email && <div className={styles.error}>{errors.email}</div>}
        </div>

        <div className={styles.field}>
          <input
            name="password"
            type="password"
            className={styles.input}
            placeholder="비밀번호 (8~25자, 영문+숫자)"
            value={form.password}
            onChange={onChange}
            required
            pattern="^(?=.*[A-Za-z])(?=.*\d).{8,25}$"
            title="영문+숫자 포함, 8~25자"
          />
          {errors.password && <div className={styles.error}>{errors.password}</div>}
        </div>

        <div className={styles.field}>
          <input
            name="userName"
            className={styles.input}
            placeholder="이름"
            value={form.userName}
            onChange={onChange}
            required
          />
          {errors.userName && <div className={styles.error}>{errors.userName}</div>}
        </div>

        <div className={styles.field}>
          <input
            name="tel"
            className={styles.input}
            placeholder="전화번호 (010-0000-0000)"
            value={form.tel}
            onChange={onChange}
            inputMode="numeric"
            pattern="^010-\d{4}-\d{4}$"
            maxLength={13}
            required
          />
          {errors.tel && <div className={styles.error}>{errors.tel}</div>}
        </div>

        {isSeller && (
          <>
            <div className={styles.field}>
              <input
                name="address"
                className={styles.input}
                placeholder="사업장 주소"
                value={form.address}
                onChange={onChange}
                required
              />
              {errors.address && <div className={styles.error}>{errors.address}</div>}
            </div>

            {/* 사업자등록번호 + 조회 버튼 */}
            <div className={`${styles.field} ${styles["row-inline"]}`}>
              <input
                name="businessNumber"
                className={styles.input}
                placeholder="사업자등록번호 (000-00-00000)"
                value={form.businessNumber}
                onChange={onChange}
                inputMode="numeric"
                maxLength={12}
                required
              />
              <button type="button" className={styles["btn-check"]} onClick={openHometax}>
                조회
              </button>
            </div>
            {errors.businessNumber && <div className={styles.error}>{errors.businessNumber}</div>}

            <div className={styles.field}>
              <input
                name="provider"
                className={styles.input}
                placeholder="농장/브랜드명"
                value={form.provider}
                onChange={onChange}
                required
              />
              {errors.provider && <div className={styles.error}>{errors.provider}</div>}
            </div>
          </>
        )}

        {msg && <div className={styles.msg}>{msg}</div>}

        <button className={styles["btn-primary"]} type="submit" disabled={submitting}>
          {submitting ? "처리 중..." : "회원가입"}
        </button>
      </form>
    </div>
  );
}
