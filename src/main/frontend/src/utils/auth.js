// src/utils/auth.js

// 로그인 상태 확인
export const isAuthenticated = () => {
  const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
  const userInfo = sessionStorage.getItem('userInfo') || localStorage.getItem('userInfo');
  
  if (!token || !userInfo) {
    return false;
  }
  
  try {
    const user = JSON.parse(userInfo);
    return user && user.id;
  } catch (error) {
    return false;
  }
};

// 사용자 정보 가져오기
export const getUserInfo = () => {
  const userInfo = sessionStorage.getItem('userInfo') || localStorage.getItem('userInfo');
  if (!userInfo) return null;
  
  try {
    return JSON.parse(userInfo);
  } catch (error) {
    return null;
  }
};

// 사용자 역할 가져오기
export const getUserRole = () => {
  const user = getUserInfo();
  return user ? (user.role || user.userType) : null;
};

// 판매자 권한 확인
export const isSeller = () => {
  const role = getUserRole();
  return role === 'seller' || role === 'admin';
};

// 구매자 권한 확인
export const isBuyer = () => {
  const role = getUserRole();
  return role === 'buyer';
};

// 로그아웃
export const logout = () => {
  sessionStorage.removeItem('authToken');
  sessionStorage.removeItem('userInfo');
  localStorage.removeItem('authToken');
  localStorage.removeItem('userInfo');
  window.location.href = '/';
};

// 로그인 정보 저장
export const saveAuthInfo = (token, userInfo, keep = false) => {
  if (keep) {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
  } else {
    sessionStorage.setItem('authToken', token);
    sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
  }
};
