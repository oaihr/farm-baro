import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentUser } from '../store/store';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  
  const { user, userId, isLoggedIn, status } = useSelector((state) => state.auth);
  
  useEffect(() => {
    // 인증 상태가 아직 확인되지 않았을 때만 fetchCurrentUser 호출
    if (status === 'idle') {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, status]);
  
  // 인증 확인 중일 때는 로딩 표시
  if (status === 'loading' || status === 'idle') {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        🔐 인증 확인 중...
      </div>
    );
  }
  
  // 인증 실패 시 로그인 페이지로 리다이렉트
  if (status === 'failed' || !isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // 특정 역할만 허용하는 경우 역할 확인
  if (allowedRoles.length > 0) {
    const userRole = user?.userType?.toLowerCase();
    const hasPermission = allowedRoles.some(role => 
      role.toLowerCase() === userRole || 
      (role.toLowerCase() === 'seller' && userRole === 'seller') ||
      (role.toLowerCase() === 'buyer' && userRole === 'buyer')
    );
    
    if (!hasPermission) {
      return <Navigate to="/" replace />;
    }
  }
  
  // 인증된 사용자는 원래 요청한 페이지로 이동
  return children;
};

export default ProtectedRoute;
