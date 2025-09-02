// src/api/http.js
import axios from "axios";

export const http = axios.create({
  // 톰캣 컨텍스트가 루트면 그대로 8080, 컨텍스트가 있으면 뒤에 /컨텍스트 붙여주세요.
  baseURL: process.env.REACT_APP_API_BASE || "http://localhost:8080",
  withCredentials: true,   // 세션/쿠키 전달. proxy에선 필수는 아니지만 켜둬도 OK
  timeout: 10000,
});
