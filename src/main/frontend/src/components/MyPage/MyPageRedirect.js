import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MyPageRedirect = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        redirectToUserMyPage();
    }, []);

    const redirectToUserMyPage = async () => {
        try {
            // 로컬 스토리지에서 사용자 정보 가져오기
            const userInfo = localStorage.getItem('userInfo');
            
            if (userInfo) {
                const user = JSON.parse(userInfo);
                const userType = user.userType || user.role;
                const userId = user.userId || user.id;
                
                if (userType && userId) {
                    // 사용자 타입에 따라 적절한 마이페이지로 리다이렉트
                    if (userType === 'buyer') {
                        navigate(`/mypage/buyer/${userId}`, { replace: true });
                    } else if (userType === 'seller') {
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
