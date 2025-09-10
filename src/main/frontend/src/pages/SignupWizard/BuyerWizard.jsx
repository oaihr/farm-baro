// src/pages/SignupWizard/BuyerWizard.jsx
import { useMemo, useState, useEffect } from "react";
import { http } from "../../api/http";
import "./BuyerWizard.css";
import { vName, vEmail, vPass, vBirth } from "../Signup/validators";

const API = {
  SEND_EMAIL: "/api/auth/email/send",
  VERIFY_EMAIL: "/api/auth/email/verify",
};

const formatPhone = (s) => {
  const d = (s || "").replace(/\D/g, "").slice(0, 11);
  if (d.length < 4) return d;
  if (d.length < 8) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
};

export default function BuyerWizard() {
  const [step, setStep] = useState(1);
  const pct = useMemo(() => (step / 3) * 100, [step]);

  // ── SNS 여부 & 세션 사용자
  const [me, setMe] = useState(null);
  useEffect(() => {
    (async () => {
      try {
        const { data } = await http.get("/api/auth/me");
        setMe(data);
        // SNS면 이메일 고정 + 인증 스킵
        if (data?.provider && data.provider !== "LOCAL") {
          setF((p) => ({
            ...p,
            email: data.email || "",
            name: p.name || data.name || "",
          }));
          setEmailVerified(true);
          setExpiryAt(null);
          setLeftSec(0);
        }
      } catch {
        // 세션 없어도 로컬 가입은 가능
      }
    })();
  }, []);
  const snsMode = useMemo(() => !!(me?.provider && me.provider !== "LOCAL"), [me]);

  const [f, setF] = useState({
    name: "",
    email: "",
    password: "",
    birth: "",
    tel: "",
    zip: "",
    addr1: "",
    addr2: "",
    agreeTerms: false,
    agreePrivacy: false,
    agreeAge14: false,
    agreeMarketing: false,
  });

  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [code, setCode] = useState("");
  const [expiryAt, setExpiryAt] = useState(null);
  const [leftSec, setLeftSec] = useState(0);
  const [emailVerified, setEmailVerified] = useState(false);
  const [sending, setSending] = useState(false);

  const allRequiredAgreed = useMemo(
    () => f.agreeTerms && f.agreePrivacy && f.agreeAge14,
    [f.agreeTerms, f.agreePrivacy, f.agreeAge14]
  );

  const fmt = (s) => {
    const m = String(Math.floor(s / 60)).padStart(2, "0");
    const sec = String(s % 60).padStart(2, "0");
    return `${m}:${sec}`;
  };

  // 타이머
  useEffect(() => {
    if (!expiryAt) return;
    const tick = () => {
      const remain = Math.max(0, Math.floor((expiryAt - Date.now()) / 1000));
      setLeftSec(remain);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [expiryAt]);

  // ── 유효성
  const validateAllStep1 = (state = f) => {
    const base = {
      name: vName(state.name ?? ""),
      email: vEmail(state.email ?? ""),
      birth: vBirth(state.birth ?? ""),
    };
    if (!snsMode) base.password = vPass(state.password ?? "");
    return base;
  };

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    const v = name === "tel" ? formatPhone(value) : type === "checkbox" ? checked : value;
    setF((p) => {
      const next = { ...p, [name]: v };
      if (step === 1 && ["name", "email", "password", "birth"].includes(name)) {
        setErrors(validateAllStep1(next));
      }
      return next;
    });
  };

  const onBlur = (e) => {
    const { name } = e.target;
    setTouched((p) => ({ ...p, [name]: true }));
    if (step === 1 && ["name", "email", "password", "birth"].includes(name)) {
      setErrors(validateAllStep1());
    }
  };

  const okStep1 = !Object.values(validateAllStep1()).some(Boolean);

  // ── 이메일 인증(로컬 전용)
  const askEmail = async () => {
    if (snsMode) return;
    if (!f.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) {
      return alert("이메일 형식이 올바르지 않습니다.");
    }
    setSending(true);
    try {
      await http.post(API.SEND_EMAIL, { email: f.email.trim() });
      setExpiryAt(Date.now() + 3 * 60 * 1000);
      setLeftSec(3 * 60);
      setEmailVerified(false);
      setCode("");
      alert("인증메일을 전송했습니다.");
    } catch (e) {
      const status = e?.response?.status;
      const msg = e?.response?.data?.message || e.message;
      alert(`인증메일 전송 실패\n(status: ${status ?? "N/A"})\n${msg}`);
    } finally {
      setSending(false);
    }
  };

  const verifyEmail = async () => {
    if (snsMode) return;
    if (!code) return;
    if (leftSec <= 0) return alert("인증 번호가 만료되었습니다. 다시 전송해 주세요.");
    setSending(true);
    try {
      await http.post(API.VERIFY_EMAIL, { email: f.email.trim(), code: code.trim() });
      setEmailVerified(true);
      setExpiryAt(null);
      setLeftSec(0);
      alert("이메일 인증 완료");
    } catch (e) {
      const status = e?.response?.status;
      const msg = e?.response?.data?.message || e.message;
      setEmailVerified(false);
      alert(`인증 실패\n(status: ${status ?? "N/A"})\n${msg}`);
    } finally {
      setSending(false);
    }
  };

  // ── 주소 검색(다음)
  const openPostcode = () => {
    const id = "daum-postcode";
    if (!document.getElementById(id)) {
      const s = document.createElement("script");
      s.id = id;
      s.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
      s.onload = () => openPostcode();
      document.body.appendChild(s);
      return;
    }
    // eslint-disable-next-line no-undef
    new daum.Postcode({
      oncomplete: (data) => {
        setF((p) => ({
          ...p,
          zip: data.zonecode,
          addr1: data.roadAddress || data.jibunAddress,
        }));
      },
    }).open();
  };

  // ── 제출
  const submit = async () => {
    if (!allRequiredAgreed) return alert("필수 약관에 동의해주세요.");
    if (!emailVerified && !snsMode) return alert("이메일 인증을 완료해주세요.");

    try {
      const url = snsMode ? "/api/auth/oauth/complete-buyer" : "/api/auth/signup/buyer";
      const payload = {
        name: f.name.trim(),
        email: f.email.trim(),
        ...(snsMode ? {} : { password: f.password }),
        birth: f.birth,
        tel: f.tel.replace(/\D/g, ""),
        zip: f.zip,
        addr1: f.addr1,
        addr2: f.addr2,
        agreeMarketing: f.agreeMarketing,
      };

      await http.post(url, payload);
      alert("가입이 완료되었습니다. 로그인해주세요.");
      window.location.replace("/login");
    } catch (e) {
      const status = e.response?.status ?? "N/A";
      const msg =
        e.response?.data?.message || e.response?.data?.detail || e.response?.data || e.message;
      console.error("signup error:", e.response?.data, e);
      alert(`가입 실패\n(status: ${status})\n${msg}`);
    }
  };

  // ── 단계 이동
  const next = () => {
    if (step === 1 && !okStep1) {
      setTouched({ name: true, email: true, password: true, birth: true });
      setErrors(validateAllStep1());
      const first = ["name", "email", "password", "birth"].find((k) => validateAllStep1()[k]);
      if (first) {
        document
          .querySelector(`[name="${first}"]`)
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }
    if (step === 2 && !emailVerified && !snsMode) {
      return alert("이메일 인증을 완료해주세요.");
    }
    setStep((s) => Math.min(3, s + 1));
  };
  const prev = () => setStep((s) => Math.max(1, s - 1));

  return (
    <div className="wiz-wrap">
      <div className="wiz-head">
        <div className="brand">🌿 목장바로</div>
        <div className="title">구매자 회원가입</div>
        <div className="bar">
          <i style={{ width: `${pct}%` }} />
        </div>
        <div className="step">{step}/3 단계</div>
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <div className="card">
          <div className="row">
            <label>이름</label>
            <input
              name="name"
              placeholder="이름을 입력하세요"
              value={f.name}
              onChange={onChange}
              onBlur={onBlur}
              className={errors.name && touched.name ? "invalid" : ""}
            />
            {errors.name && touched.name && <p className="err">{errors.name}</p>}
          </div>

          <div className="row">
            <label>이메일</label>
            <input
              name="email"
              type="email"
              value={f.email}
              onChange={onChange}
              onBlur={onBlur}
              readOnly={snsMode}
              className={errors.email && touched.email ? "invalid" : ""}
              placeholder={snsMode ? "SNS로 전달된 이메일" : "이메일을 입력하세요"}
            />
            {snsMode && <p className="hint">SNS 로그인으로 받은 이메일입니다.</p>}
          </div>

          {!snsMode && (
            <div className="row">
              <label>비밀번호</label>
              <input
                name="password"
                type="password"
                value={f.password}
                onChange={onChange}
                onBlur={onBlur}
                className={errors.password && touched.password ? "invalid" : ""}
                placeholder="8~25자 (영문+숫자)"
              />
              {errors.password && touched.password && <p className="err">{errors.password}</p>}
            </div>
          )}

          <div className="row">
            <label>생년월일</label>
            <input
              name="birth"
              placeholder="YYYYMMDD"
              value={f.birth}
              onChange={onChange}
              onBlur={onBlur}
              maxLength={8}
              inputMode="numeric"
              className={errors.birth && touched.birth ? "invalid" : ""}
            />
            {errors.birth && touched.birth && <p className="err">{errors.birth}</p>}
          </div>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="card">
          <div className="row">
            <label>이메일</label>
            <div className="hstack">
              <input name="email" value={f.email} readOnly />
              {!snsMode && (
                <button
                  type="button"
                  onClick={askEmail}
                  disabled={sending || (leftSec > 0 && !emailVerified)}
                >
                  {leftSec > 0 && !emailVerified ? `재전송 (${fmt(leftSec)})` : "인증메일 보내기"}
                </button>
              )}
            </div>
          </div>

          {!snsMode && (
            <div className="row">
              <label>인증번호</label>
              <div className="hstack">
                <input
                  placeholder="6자리"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  maxLength={6}
                />
                <button
                  type="button"
                  onClick={verifyEmail}
                  disabled={sending || !code || leftSec <= 0 || emailVerified}
                >
                  인증
                </button>
              </div>
              {!emailVerified && leftSec > 0 && (
                <p className="hint" style={{ marginTop: 8 }}>
                  남은 시간 <b>{fmt(leftSec)}</b> 안에 인증번호를 입력해 주세요.
                </p>
              )}
              {emailVerified && <p className="ok">✅ 인증 완료</p>}
            </div>
          )}

          {snsMode && (
            <p className="ok" style={{ marginTop: 8 }}>
              ✅ SNS 계정은 이메일 인증이 필요 없습니다.
            </p>
          )}
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div className="card">
          <div className="row">
            <label>연락처</label>
            <input name="tel" placeholder="010-0000-0000" value={f.tel} onChange={onChange} />
          </div>

          <div className="row">
            <label>주소</label>
            <div className="hstack">
              <input name="zip" placeholder="우편번호" value={f.zip} onChange={onChange} />
              <button type="button" onClick={openPostcode}>
                주소 검색
              </button>
            </div>
            <input name="addr1" placeholder="기본 주소" value={f.addr1} onChange={onChange} />
            <input name="addr2" placeholder="상세 주소" value={f.addr2} onChange={onChange} />
          </div>

          <div className="agreements">
            <div className="check">
              <input
                type="checkbox"
                checked={f.agreeTerms && f.agreePrivacy && f.agreeAge14 && f.agreeMarketing}
                onChange={(e) => {
                  const v = e.target.checked;
                  setF((p) => ({
                    ...p,
                    agreeTerms: v,
                    agreePrivacy: v,
                    agreeAge14: v,
                    agreeMarketing: v,
                  }));
                }}
              />
              <span>전체 동의</span>
            </div>
            <div className="check req">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={f.agreeTerms}
                onChange={onChange}
              />
              <span>서비스 이용약관 동의 (필수)</span>
            </div>
            <div className="check req">
              <input
                type="checkbox"
                name="agreePrivacy"
                checked={f.agreePrivacy}
                onChange={onChange}
              />
              <span>개인정보 수집 및 이용 동의 (필수)</span>
            </div>
            <div className="check">
              <input
                type="checkbox"
                name="agreeMarketing"
                checked={f.agreeMarketing}
                onChange={onChange}
              />
              <span>마케팅 정보 수신 동의 (선택)</span>
            </div>
            <div className="check req">
              <input
                type="checkbox"
                name="agreeAge14"
                checked={f.agreeAge14}
                onChange={onChange}
              />
              <span>만 14세 이상입니다 (필수)</span>
            </div>
          </div>
        </div>
      )}

      <div className="actions">
        {step > 1 ? <button className="ghost" onClick={prev}>이전</button> : <span />}
        {step < 3 ? (
          <button onClick={next}>다음</button>
        ) : (
          <button onClick={submit} aria-disabled={!allRequiredAgreed}
                  title={!allRequiredAgreed ? "필수 약관 동의 필요" : ""}>
            가입
          </button>
        )}
      </div>
    </div>
  );
}
