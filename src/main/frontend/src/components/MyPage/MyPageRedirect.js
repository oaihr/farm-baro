import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentUser } from '../../store/store';
import { http } from '../../api/http';

const MyPageRedirect = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { userId } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        dispatch(fetchCurrentUser());
    }, [dispatch]);

    useEffect(() => {
        if (userId) {
            redirectToUserMyPage();
        } else if (loading) {
            setLoading(false);
        }
    }, [userId, loading]);

    const redirectToUserMyPage = async () => {
        try {
            console.log('=== MyPageRedirect 디버깅 ===');
            console.log('Redux userId:', userId);
            
            // Redux에서 이미 userId를 가지고 있으므로 직접 사용
            if (userId) {
                // 사용자 타입을 확인하기 위해 추가 API 호출
                const response = await http.get('/api/auth/me');
                const userInfo = response.data;
                const userType = userInfo.userType;
                
                console.log('API 응답 userInfo:', userInfo);
                console.log('userType:', userType);
                
                if (userType) {
                    // 사용자 타입에 따라 적절한 마이페이지로 리다이렉트
                    if (userType === 'BUYER') {
                        console.log('BUYER로 리다이렉트:', `/mypage/buyer/${userId}`);
                        navigate(`/mypage/buyer/${userId}`, { replace: true });
                    } else if (userType === 'SELLER') {
                        console.log('SELLER로 리다이렉트:', `/mypage/seller/${userId}`);
                        navigate(`/mypage/seller/${userId}`, { replace: true });
                    } else {
                        // 기본적으로 buyer로 처리
                        console.log('기본 BUYER로 리다이렉트:', `/mypage/buyer/${userId}`);
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
