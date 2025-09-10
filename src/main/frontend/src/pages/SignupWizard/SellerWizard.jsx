// src/pages/SignupWizard/SellerWizard.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { http } from "../../api/http";
import "./BuyerWizard.css";

const PASS_RE = /^(?=.*[A-Za-z])(?=.*\d).{8,25}$/;
const BRN_RE = /^\d{3}-\d{2}-\d{5}$/;
const EMAIL_RE = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
const EMAIL_CODE_RE = /^\d{6}$/;

const onlyDigits = (s) => (s || "").replace(/\D/g, "");
const formatBrn = (s) => {
  const d = onlyDigits(s).slice(0, 10);
  if (d.length < 4) return d;
  if (d.length < 6) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 5)}-${d.slice(5)}`;
};
const formatPhone = (s) => {
  const d = s.replace(/\D/g, "").slice(0, 11);
  if (d.length < 4) return d;
  if (d.length < 8) return `${d.slice(0,3)}-${d.slice(3)}`;
  return `${d.slice(0,3)}-${d.slice(3,7)}-${d.slice(7)}`;
};

const HOMETAX_URL =
  "https://hometax.go.kr/websquare/websquare.html?w2xPath=/ui/pp/index_pp.xml&tmIdx=43&tm2lIdx=4306000000&tm3lIdx=4306080000";

export default function SellerWizard() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const steps = ["기본정보", "사업자/농가 정보", "정산 정보"];
  const barPct = `${Math.round(((step - 1) / (steps.length - 1)) * 100)}%`;

  // SNS 모드(로그인 상태면 이메일/비번 생략)
  const [snsMode, setSnsMode] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        const { data } = await http.get("/api/auth/me", { withCredentials: true });
        if (data?.provider && data.provider !== "LOCAL") {
          setSnsMode(true);
          if (data.email) setEmail(data.email);
          if (data.name) setName(data.name);
          setEmailOk(true);
          setEmailVerified(true);
        }
      } catch {}
    })();
  }, []);

  /* STEP1 */
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailOk, setEmailOk] = useState(false);
  const [emailCode, setEmailCode] = useState("");
  const [emailCodeSent, setEmailCodeSent] = useState(false);
  const [emailCodeLeftSec, setEmailCodeLeftSec] = useState(0);
  const [emailVerified, setEmailVerified] = useState(false);
  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");
  const [tel, setTel] = useState("");
  const [agree, setAgree] = useState({ t1: false, t2: false, t3: false });

  useEffect(() => {
    if (!emailCodeSent || emailCodeLeftSec <= 0) return;
    const t = setInterval(() => setEmailCodeLeftSec((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [emailCodeSent, emailCodeLeftSec]);

  /* STEP2 */
  const [sellerType, setSellerType] = useState("BUSINESS");
  const [brn, setBrn] = useState("");
  const [brnOk, setBrnOk] = useState(false);
  const [repName, setRepName] = useState("");
  const [zip, setZip] = useState("");
  const [addr1, setAddr1] = useState("");
  const [addr2, setAddr2] = useState("");
  const [traceNo, setTraceNo] = useState("");
  const [brnFile, setBrnFile] = useState(null);

  /* STEP3 */
  const [accHolder, setAccHolder] = useState("");
  const [bank, setBank] = useState("");
  const [accNo, setAccNo] = useState("");
  const [agreeSettle, setAgreeSettle] = useState({ a1: false, a2: false, a3: false });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showDone, setShowDone] = useState(false);
  const [show1Err, setShow1Err] = useState(false);
  const [show2Err, setShow2Err] = useState(false);
  const [show3Err, setShow3Err] = useState(false);

  const canNext1 = useMemo(() => {
    if (snsMode) return name.trim().length >= 2 && agree.t1 && agree.t2 && agree.t3;
    return (
      name.trim().length >= 2 &&
      EMAIL_RE.test(email) &&
      emailOk &&
      emailVerified &&
      PASS_RE.test(pass) &&
      pass === pass2 &&
      agree.t1 &&
      agree.t2 &&
      agree.t3
    );
  }, [snsMode, name, email, emailOk, emailVerified, pass, pass2, agree]);

  const canNext2 = useMemo(
    () => BRN_RE.test(brn) && brnOk && repName.trim().length >= 2 && addr1.trim().length > 0,
    [brn, brnOk, repName, addr1]
  );

  const canSubmit = useMemo(
    () =>
      accHolder.trim().length >= 2 &&
      bank &&
      onlyDigits(accNo).length >= 8 &&
      agreeSettle.a1 &&
      agreeSettle.a2 &&
      agreeSettle.a3,
    [accHolder, bank, accNo, agreeSettle]
  );

  const getStep1Errors = () => {
    const errs = [];
    if (name.trim().length < 2) errs.push("이름");
    if (!snsMode) {
      if (!EMAIL_RE.test(email)) errs.push("이메일 형식");
      if (!emailOk) errs.push("이메일 중복확인");
      if (!emailVerified) errs.push("이메일 인증");
      if (!PASS_RE.test(pass)) errs.push("비밀번호 규칙");
      if (pass !== pass2) errs.push("비밀번호 일치");
    }
    if (!(agree.t1 && agree.t2 && agree.t3)) errs.push("약관 동의");
    return errs;
  };

  const getStep2Errors = () => {
    const errs = [];
    if (!BRN_RE.test(brn)) errs.push("사업자등록번호 형식");
    if (!brnOk) errs.push("사업자등록번호 확인");
    if (repName.trim().length < 2) errs.push(sellerType === "BUSINESS" ? "상호" : "농장명");
    if (!addr1.trim()) errs.push("기본 주소");
    return errs;
  };

  /* 이메일 액션 */
  const checkEmail = async () => {
    if (!EMAIL_RE.test(email)) return alert("이메일 형식을 확인하세요.");
    try {
      const { data } = await http.get("/api/sellers/validate-email", { params: { email } });
      setEmailOk(!!data?.ok);
      alert(data?.ok ? "사용 가능한 이메일입니다." : "이미 사용 중인 이메일입니다.");
    } catch { alert("서버 통신 오류"); }
  };
  const sendEmailCode = async () => {
    if (!emailOk) return alert("이메일 중복 확인을 먼저 해주세요.");
    try {
      const { data } = await http.post("/api/sellers/email/send", { email });
      if (data?.ok) { setEmailCodeSent(true); setEmailCodeLeftSec(180); alert("인증 메일을 보냈습니다."); }
      else alert(data?.message || "발송 실패");
    } catch { alert("서버 통신 오류"); }
  };
  const verifyEmailCode = async () => {
    if (!EMAIL_CODE_RE.test(emailCode)) return alert("인증코드 6자리를 입력하세요.");
    try {
      const { data } = await http.post("/api/sellers/email/verify", { email, code: emailCode });
      if (data?.ok) { setEmailVerified(true); alert("이메일 인증 완료"); }
      else alert("코드가 올바르지 않거나 만료되었습니다.");
    } catch { alert("서버 통신 오류"); }
  };

  const checkBrn = async () => {
    if (!BRN_RE.test(brn)) return alert("사업자등록번호 형식을 확인하세요.");
    try {
      const { data } = await http.get("/api/sellers/check-brn", { params: { brn: brn.replaceAll("-", "") } });
      setBrnOk(!!data?.ok);
      alert(data?.ok ? "유효한 번호입니다." : "유효하지 않거나 중복된 번호입니다.");
    } catch { alert("서버 통신 오류"); }
  };
  const openHometax = async () => {
    const no = onlyDigits(brn);
    if (no.length !== 10) return alert("사업자등록번호 10자리를 입력하세요.");
    try { await navigator.clipboard.writeText(no); } catch {}
    window.open(HOMETAX_URL, "_blank", "noopener,noreferrer");
    alert("사업자번호가 복사되었습니다. 홈택스에서 붙여넣기 하세요.");
  };
  const openPostcode = () => {
    const id = "daum-postcode";
    if (!document.getElementById(id)) {
      const s = document.createElement("script");
      s.id = id; s.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
      s.onload = () => openPostcode(); document.body.appendChild(s); return;
    }
    // eslint-disable-next-line no-undef
    new daum.Postcode({ oncomplete: (data) => { setZip(data.zonecode); setAddr1(data.roadAddress || data.jibunAddress); }, }).open();
  };

  /* 최종 제출 */
  const submitAll = async () => {
    if (submitting || submitted) return;
    setSubmitting(true);
    try {
      const payload = {
        basic: { name, email, pass: snsMode ? undefined : pass, tel: onlyDigits(tel)  },
        business: { brn, sellerType, repName, zip, addr1, addr2, traceNo },
        settlement: {  accHolder, bank, accNo: onlyDigits(accNo) },
      };
      const fd = new FormData();
      fd.append("payload", new Blob([JSON.stringify(payload)], { type: "application/json; charset=UTF-8" }));
      if (brnFile) fd.append("brnFile", brnFile);
      await http.post("/api/sellers", fd);
      setSubmitted(true);
      setShowDone(true);
      setTimeout(() => navigate("/me?from=seller_signup"), 1200);
    } catch (e) {
      alert("서버 오류: " + (e.response?.data?.detail || e.response?.data?.message || e.message));
    } finally { setSubmitting(false); }
  };

  const nextFrom1 = () => (canNext1 ? setStep(2) : setShow1Err(true));
  const nextFrom2 = () => (canNext2 ? setStep(3) : setShow2Err(true));
  const submitGuard = () => (canSubmit ? submitAll() : setShow3Err(true));
  const preventEnterSubmit = (e) => { if (e.key === "Enter") e.preventDefault(); };

  return (
    <>
      <div className="wiz-wrap" onKeyDown={preventEnterSubmit}>
        <div className="wiz-head">
          <div className="brand">판매자 회원가입</div>
          <div className="title">{steps[step - 1]}</div>
          <div className="bar"><i style={{ width: barPct }} /></div>
          <div className="step">{step} / {steps.length} 단계</div>
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <section className="card">
            <div className="row"><label>이름</label>
              <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="실명을 입력하세요" />
            </div>

            <div className="row"><label>이메일</label>
              <div className="hstack email-actions">
                <input value={email} readOnly={snsMode}
                      onChange={(e)=>{setEmail(e.target.value); setEmailOk(false); setEmailVerified(false);}}
                      placeholder={snsMode ? "SNS 이메일 (수정 불가)" : "example@email.com"} />
                {!snsMode && <>
                  <button type="button" className="btn-ghost" onClick={checkEmail} disabled={!EMAIL_RE.test(email)}>중복 확인</button>
                  <button type="button" className="btn-ghost" onClick={sendEmailCode} disabled={!(EMAIL_RE.test(email) && emailOk)}>인증 메일</button>
                </>}
              </div>
              {snsMode ? <div className="ok">SNS 계정은 이메일 인증이 필요 없습니다.</div>
                       : emailVerified ? <div className="ok">이메일 인증 완료</div>
                       : emailOk && <div className="ok">중복 확인 OK</div>}
            </div>

            {!snsMode && <>
              <div className="row"><label>인증코드</label>
                <div className="hstack email-actions">
                  <input value={emailCode} onChange={(e)=>setEmailCode(e.target.value.replace(/\D/g,"").slice(0,6))} placeholder="6자리" />
                  <button type="button" className="btn-ghost" onClick={verifyEmailCode} disabled={!EMAIL_CODE_RE.test(emailCode)}>확인</button>
                </div>
                {emailCodeSent && emailCodeLeftSec>0 && (
                  <div className="ok">
                    유효시간: {String(Math.floor(emailCodeLeftSec/60)).padStart(2,"0")}:
                    {String(emailCodeLeftSec%60).padStart(2,"0")}
                  </div>
                )}
              </div>

              <div className="row"><label>비밀번호</label>
                <input type="password" value={pass} onChange={(e)=>setPass(e.target.value)} placeholder="8~25자 영문+숫자" />
              </div>
              <div className="row"><label>비밀번호 확인</label>
                <input type="password" value={pass2} onChange={(e)=>setPass2(e.target.value)} placeholder="비밀번호를 다시 입력하세요" />
                {pass2 && pass!==pass2 && <div className="err">비밀번호가 일치하지 않습니다</div>}
              </div>
            </>}

            <div className="row">
              <label>전화번호</label>
              <input
                value={tel}
                onChange={(e) => setTel(formatPhone(e.target.value))}
                placeholder="010-1234-5678"
                maxLength={13}
              />
            </div>

            <div className="agreements">
              <label className="check"><input type="checkbox" checked={agree.t1} onChange={(e)=>setAgree(a=>({...a,t1:e.target.checked}))}/><span>이용약관 동의</span></label>
              <label className="check"><input type="checkbox" checked={agree.t2} onChange={(e)=>setAgree(a=>({...a,t2:e.target.checked}))}/><span>개인정보 수집 및 이용 동의</span></label>
              <label className="check"><input type="checkbox" checked={agree.t3} onChange={(e)=>setAgree(a=>({...a,t3:e.target.checked}))}/><span>정산 정보 제공 동의</span></label>
            </div>

            {show1Err && getStep1Errors().length>0 && <div className="err">확인 필요: {getStep1Errors().join(" · ")}</div>}

            <div className="actions-grid">
              <span className="btn-prev is-placeholder" />
              <button type="button" className="btn-next" onClick={nextFrom1} disabled={!canNext1}>다음</button>
            </div>
          </section>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <section className="card">
            <div className="row">
              <label>판매자 유형</label>
              <div className="seg">
                <button type="button" className={`btn-tab ${sellerType==="BUSINESS"?"active":""}`} onClick={()=>setSellerType("BUSINESS")}>사업자</button>
                <button type="button" className={`btn-tab ${sellerType==="FARM"?"active":""}`} onClick={()=>setSellerType("FARM")}>농가</button>
              </div>
            </div>

            <div className="row"><label>사업자등록번호</label>
              <div className="hstack email-actions">
                <input value={brn} onChange={(e)=>{setBrn(formatBrn(e.target.value)); setBrnOk(false);}} placeholder="000-00-00000" />
                <button type="button" className="btn-check" onClick={openHometax}>조회</button>
                <button type="button" className="btn-ghost" onClick={checkBrn} disabled={!BRN_RE.test(brn)}>확인</button>
              </div>
            </div>

            <div className="row"><label>{sellerType==="BUSINESS"?"상호":"농장명"}</label>
              <input value={repName} onChange={(e)=>setRepName(e.target.value)} placeholder={sellerType==="BUSINESS"?"상호를 입력하세요":"농장명을 입력하세요"} />
            </div>

            <div className="row"><label>주소</label>
              <div className="hstack">
                <input value={zip} readOnly placeholder="우편번호" />
                <button type="button" className="btn-ghost" onClick={openPostcode}>주소 검색</button>
              </div>
            </div>
            <div className="row"><input value={addr1} readOnly placeholder="기본 주소" /></div>
            <div className="row"><input value={addr2} onChange={(e)=>setAddr2(e.target.value)} placeholder="상세 주소" /></div>

            <div className="row"><label>축산이력제 생산자번호 (선택)</label>
              <input value={traceNo} onChange={(e)=>setTraceNo(onlyDigits(e.target.value).slice(0,20))} placeholder="선택 입력" />
            </div>

            <div className="row"><label>사업자등록증 (JPG, PNG, PDF • 최대 5MB)</label>
              <input type="file" accept="image/*,application/pdf" onChange={(e)=>setBrnFile(e.target.files?.[0] || null)} />
              {brnFile && <div className="ok">첨부됨: {brnFile.name}</div>}
            </div>

            {show2Err && getStep2Errors().length>0 && <div className="err">확인 필요: {getStep2Errors().join(" · ")}</div>}

            <div className="actions-grid">
              <button type="button" className="btn-prev" onClick={()=>setStep(1)}>이전</button>
              <button type="button" className="btn-next" onClick={nextFrom2} disabled={!canNext2}>다음</button>
            </div>
          </section>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <section className="card">
            <div className="row"><label>예금주</label>
              <input value={accHolder} onChange={(e)=>setAccHolder(e.target.value)} placeholder="예금주를 입력하세요" />
            </div>
            <div className="row"><label>은행</label>
              <select value={bank} onChange={(e)=>setBank(e.target.value)}>
                <option value="">은행을 선택하세요</option>
                <option value="004">KB국민</option><option value="088">신한</option>
                <option value="081">하나</option><option value="020">우리</option><option value="011">NH농협</option>
              </select>
            </div>
            <div className="row"><label>계좌번호</label>
              <input value={accNo} onChange={(e)=>setAccNo(onlyDigits(e.target.value).slice(0,20))} placeholder="'-' 없이 숫자만" />
            </div>

            <div className="agreements">
              <label className="check"><input type="checkbox" checked={agreeSettle.a1} onChange={(e)=>setAgreeSettle(a=>({...a,a1:e.target.checked}))}/><span>(필수) 이용약관 동의</span></label>
              <label className="check"><input type="checkbox" checked={agreeSettle.a2} onChange={(e)=>setAgreeSettle(a=>({...a,a2:e.target.checked}))}/><span>(필수) 개인정보 수집 및 이용 동의</span></label>
              <label className="check"><input type="checkbox" checked={agreeSettle.a3} onChange={(e)=>setAgreeSettle(a=>({...a,a3:e.target.checked}))}/><span>(필수) 정산 정보 제공 동의</span></label>
            </div>
            {show3Err && !canSubmit && <div className="err">예금주/은행/계좌 및 필수 약관 동의를 확인해주세요.</div>}

            <div className="actions-grid">
              <button type="button" className="btn-prev" onClick={()=>setStep(2)}>이전</button>
              <button type="button" className="btn-next" onClick={canSubmit ? submitAll : submitGuard} disabled={!canSubmit || submitting || submitted}>
                {submitted ? "접수 완료" : submitting ? "전송 중..." : "검수요청"}
              </button>
            </div>
          </section>
        )}
      </div>

      {showDone && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-icon">✅</div>
            <h3>검수요청이 접수되었습니다</h3>
            <p className="mt8">관리자 검수 후 결과가 이메일로 안내됩니다.</p>
            <div className="mt16">
              <button className="btn-next" onClick={()=>navigate("/me?from=seller_signup")}>마이페이지로 이동</button>
              <button className="btn-prev ml8" onClick={()=>setShowDone(false)}>닫기</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
