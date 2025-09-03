// src/pages/SignupWizard/validators.js

const toStr = v => (v ?? "").toString();

export const vRequired = v => (toStr(v).trim() ? null : "필수 항목입니다.");

export const vEmail = v => {
  const s = toStr(v).trim();
  if (!s) return "이메일을 입력하세요.";
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(s) ? null : "이메일 형식이 올바르지 않습니다.";
};

export const vPass = v => {
  const s = toStr(v);
  if (s.length < 8 || s.length > 64) return "비밀번호는 8~64자입니다.";
  if (!/[A-Za-z]/.test(s) || !/\d/.test(s)) return "영문과 숫자를 포함하세요.";
  return null;
};

export const vName = v => {
  const s = toStr(v).trim();          // ★ undefined 방어
  if (!s) return "이름을 입력하세요.";
  if (s.length < 2 || s.length > 20) return "이름은 2~20자입니다.";
  return null;
};

export const vTel = v => {
  const s = toStr(v).replace(/-/g, "").trim();
  return /^01\d{8,9}$/.test(s) ? null : "휴대폰 번호 형식이 올바르지 않습니다.";
};
