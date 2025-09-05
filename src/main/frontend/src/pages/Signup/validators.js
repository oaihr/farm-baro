// src/pages/Signup/validators.js
export const PASS_RE = /^(?=.*[A-Za-z])(?=.*\d).{8,25}$/;
export const TEL_RE  = /^010-\d{4}-\d{4}$/;

export function vName(s){ if(!s.trim()) return "이름을 입력하세요."; if(s.trim().length<2) return "이름은 2자 이상."; return null; }
export function vEmail(s){ if(!s.trim()) return "이메일을 입력하세요."; if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)) return "이메일 형식이 아닙니다."; return null; }
export function vPass(s){ if(!s) return "비밀번호를 입력하세요."; if(!PASS_RE.test(s)) return "8~25자, 영문+숫자 포함."; return null; }
export function vBirth(s){ if(!s) return null; if(!/^\d{8}$/.test(s)) return "YYYYMMDD 형식으로 입력하세요."; return null; }
export function vTel(s){ if(!TEL_RE.test(s)) return "010-0000-0000 형식으로 입력하세요."; return null; }
