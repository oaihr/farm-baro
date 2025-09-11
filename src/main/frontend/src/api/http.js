// src/api/http.js
import axios from "axios";

const inst = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
});

inst.interceptors.response.use(
  (res) => res,
  (err) => {
    // eslint-disable-next-line no-console
    console.error("[HTTP ERROR]", err);
    return Promise.reject(err);
  }
);

const http = {
  get(url, config) {
    return inst.get(url, config).then((r) => r.data);
  },
  post(url, body, config) {
    return inst.post(url, body, config).then((r) => r.data);
  },
  put(url, body, config) {
    return inst.put(url, body, config).then((r) => r.data);
  },
  del(url, config) {
    return inst.delete(url, config).then((r) => r.data);
  },
  postForm(url, formData, config) {
    return inst
      .post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        ...(config || {}),
      })
      .then((r) => r.data);
  },
};

// 둘 다 됩니다: import http from '...';  또는 import { http } from '...';
export { http };           // named export(레거시 호환)
export const api = http;   // 혹시 { api } 로 쓰던 곳도 커버
export default http;       // default export(신규 코드)
