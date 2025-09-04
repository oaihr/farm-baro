import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { http } from '../../api/http';

const MyPageRedirect = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        redirectToUserMyPage();
    }, []);

    const redirectToUserMyPage = async () => {
        try {
            // 세션에서 사용자 정보 가져오기
            const response = await http.get('/api/auth/me');
            const userInfo = response.data;
            
            if (userInfo && userInfo.id) {
                const userType = userInfo.userType;
                const userId = userInfo.id;
                
                if (userType && userId) {
                    // 사용자 타입에 따라 적절한 마이페이지로 리다이렉트
                    if (userType === 'BUYER') {
                        navigate(`/mypage/buyer/${userId}`, { replace: true });
                    } else if (userType === 'SELLER') {
                        navigate(`/mypage/seller/${userId}`, { replace: true });
                    } else {
                        // 기본적으로 buyer로 처리
                        navigate(`/mypage/buyer/${userId}`, { replace: true });
                    }
                    return;
                }
            }
            
            // 사용자 정보가 없으면 로그인 페이지로 리다이렉트
            navigate('/login', { replace: true });
            
        } catch (error) {
            console.error('Error redirecting to mypage:', error);
            navigate('/login', { replace: true });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                fontSize: '1.2rem',
                color: '#666'
            }}>
                마이페이지로 이동 중...
            </div>
        );
    }

    return null;
};

export default MyPageRedirect;
