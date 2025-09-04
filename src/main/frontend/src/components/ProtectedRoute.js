import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, getUserRole } from '../utils/auth';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const location = useLocation();
  
  // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // 특정 역할만 허용하는 경우 역할 확인
  if (allowedRoles.length > 0) {
    const userRole = getUserRole();
    if (!allowedRoles.includes(userRole)) {
      // 권한이 없는 경우 메인 페이지로 리다이렉트
      return <Navigate to="/" replace />;
    }
  }
  
  // 인증된 사용자는 원래 요청한 페이지로 이동
  return children;
};

export default ProtectedRoute;
