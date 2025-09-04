import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const userInfo = await response.json();
          setIsAuthenticated(true);
          setUserRole(userInfo.userType?.toLowerCase());
        } else if (response.status === 401) {
          // 401 Unauthorized는 정상적인 상황 (로그인되지 않음)
          setIsAuthenticated(false);
          setUserRole(null);
        } else {
          // 기타 HTTP 오류
          console.warn('인증 확인 실패:', response.status, response.statusText);
          setIsAuthenticated(false);
          setUserRole(null);
        }
      } catch (error) {
        // 네트워크 오류 등
        console.warn('인증 확인 중 네트워크 오류:', error.message);
        setIsAuthenticated(false);
        setUserRole(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  if (isLoading) {
    return <div>인증 확인 중...</div>;
  }
  
  // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // 특정 역할만 허용하는 경우 역할 확인
  if (allowedRoles.length > 0) {
    if (!allowedRoles.includes(userRole)) {
      // 권한이 없는 경우 메인 페이지로 리다이렉트
      return <Navigate to="/" replace />;
    }
  }
  
  // 인증된 사용자는 원래 요청한 페이지로 이동
  return children;
};

export default ProtectedRoute;
