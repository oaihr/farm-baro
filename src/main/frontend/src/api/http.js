// src/api/http.js
import axios from "axios";

const inst = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
});

// 요청 인터셉터 (현재는 사용하지 않음)
http.interceptors.request.use(
  (config) => {
    console.log('http 요청 - URL:', config.url);
    console.log('http 요청 - 전체 헤더:', config.headers);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터에서 Set-Cookie 헤더 접근 가능하도록 설정
http.interceptors.response.use(
  (response) => {
    // Set-Cookie 헤더를 response 객체에 추가
    if (response.headers['set-cookie']) {
      response.headers['Set-Cookie'] = response.headers['set-cookie'];
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);
