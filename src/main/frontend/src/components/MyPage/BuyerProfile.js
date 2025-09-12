import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './BuyerProfile.css';

const BuyerProfile = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [userInfo, setUserInfo] = useState({
        email: '',
        phone: '',
        address: '',
        nickname: '',
        realName: '' // 읽기 전용 (PK)
    });

    // 사용자 정보 가져오기
    const fetchUserInfo = async () => {
        try {
            const response = await fetch(`/mypage/api/users/${userId}`);
            if (response.ok) {
                const data = await response.json();
                setUserInfo({
                    email: data.email || '',
                    phone: data.phone || '',
                    address: data.address || '',
                    nickname: data.nickname || '',
                    realName: data.realName || ''
                });
            }
        } catch (error) {
            console.error('사용자 정보 조회 오류:', error);
            setMessage('사용자 정보를 불러오는데 실패했습니다.');
        }
    };

    useEffect(() => {
        fetchUserInfo();
    }, [userId]);

    // 입력 필드 변경 처리
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // 개인정보 수정
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await fetch(`/mypage/api/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userInfo)
            });

            if (response.ok) {
                setMessage('개인정보가 성공적으로 수정되었습니다! ✨');
                setTimeout(() => {
                    navigate(`/buyer/${userId}`);
                }, 2000);
            } else {
                const errorText = await response.text();
                setMessage(`개인정보 수정에 실패했습니다. (${response.status})`);
                console.error('수정 실패:', errorText);
            }
        } catch (error) {
            console.error('개인정보 수정 오류:', error);
            setMessage('개인정보 수정 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 비밀번호 변경
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPasswordForm, setShowPasswordForm] = useState(false);

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage('새 비밀번호와 확인 비밀번호가 일치하지 않습니다.');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setMessage('새 비밀번호는 최소 6자 이상이어야 합니다.');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const response = await fetch(`/mypage/api/users/${userId}/password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                })
            });

            if (response.ok) {
                setMessage('비밀번호가 성공적으로 변경되었습니다! 🔐');
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
                setShowPasswordForm(false);
            } else {
                setMessage('비밀번호 변경에 실패했습니다. 현재 비밀번호를 확인해주세요.');
            }
        } catch (error) {
            console.error('비밀번호 변경 오류:', error);
            setMessage('비밀번호 변경 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="buyer-profile-container">
            {/* 헤더 */}
            <div className="header">
                <h1>👤 개인정보 수정</h1>
                <p>개인정보를 안전하게 관리하고 수정하세요</p>
            </div>

            {/* 메시지 표시 */}
            {message && (
                <div className={`message ${message.includes('성공') ? 'success' : 'error'}`}>
                    {message}
                </div>
            )}

            {/* 개인정보 수정 폼 */}
            <div className="profile-form-section">
                <h3>📝 기본 정보 수정</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>실명 (수정 불가)</label>
                        <input
                            type="text"
                            value={userInfo.realName}
                            disabled
                            className="disabled-input"
                        />
                        <small className="input-help">실명은 보안상 수정할 수 없습니다.</small>
                    </div>

                    <div className="form-group">
                        <label>이메일 *</label>
                        <input
                            type="email"
                            name="email"
                            value={userInfo.email}
                            onChange={handleInputChange}
                            placeholder="이메일을 입력하세요"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>전화번호 *</label>
                        <input
                            type="tel"
                            name="phone"
                            value={userInfo.phone}
                            onChange={handleInputChange}
                            placeholder="전화번호를 입력하세요 (예: 010-1234-5678)"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>주소</label>
                        <input
                            type="text"
                            name="address"
                            value={userInfo.address}
                            onChange={handleInputChange}
                            placeholder="주소를 입력하세요"
                        />
                    </div>

                    <div className="form-group">
                        <label>닉네임</label>
                        <input
                            type="text"
                            name="nickname"
                            value={userInfo.nickname}
                            onChange={handleInputChange}
                            placeholder="닉네임을 입력하세요"
                        />
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? '수정 중...' : '💾 개인정보 수정'}
                        </button>
                        <button 
                            type="button" 
                            className="cancel-btn"
                            onClick={() => navigate(`/buyer/${userId}`)}
                        >
                            취소
                        </button>
                    </div>
                </form>
            </div>

            {/* 비밀번호 변경 섹션 */}
            <div className="password-section">
                <h3>🔐 비밀번호 변경</h3>
                {!showPasswordForm ? (
                    <button 
                        className="change-password-btn"
                        onClick={() => setShowPasswordForm(true)}
                    >
                        비밀번호 변경하기
                    </button>
                ) : (
                    <form onSubmit={handlePasswordSubmit}>
                        <div className="form-group">
                            <label>현재 비밀번호 *</label>
                            <input
                                type="password"
                                name="currentPassword"
                                value={passwordData.currentPassword}
                                onChange={handlePasswordChange}
                                placeholder="현재 비밀번호를 입력하세요"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>새 비밀번호 *</label>
                            <input
                                type="password"
                                name="newPassword"
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                                placeholder="새 비밀번호를 입력하세요 (최소 6자)"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>새 비밀번호 확인 *</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordChange}
                                placeholder="새 비밀번호를 다시 입력하세요"
                                required
                            />
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="submit-btn" disabled={loading}>
                                {loading ? '변경 중...' : '🔐 비밀번호 변경'}
                            </button>
                            <button 
                                type="button" 
                                className="cancel-btn"
                                onClick={() => {
                                    setShowPasswordForm(false);
                                    setPasswordData({
                                        currentPassword: '',
                                        newPassword: '',
                                        confirmPassword: ''
                                    });
                                }}
                            >
                                취소
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {/* 보안 안내 */}
            <div className="security-info">
                <h3>🔒 보안 안내</h3>
                <div className="security-tips">
                    <div className="tip-item">
                        <div className="tip-icon">⚠️</div>
                        <div className="tip-content">
                            <h4>개인정보 보호</h4>
                            <p>실명, 주민등록번호 등 주요 식별 정보는 수정할 수 없습니다.</p>
                        </div>
                    </div>
                    <div className="tip-item">
                        <div className="tip-icon">🔐</div>
                        <div className="tip-content">
                            <h4>비밀번호 관리</h4>
                            <p>정기적으로 비밀번호를 변경하고, 타인과 공유하지 마세요.</p>
                        </div>
                    </div>
                    <div className="tip-item">
                        <div className="tip-icon">📱</div>
                        <div className="tip-content">
                            <h4>연락처 정보</h4>
                            <p>정확한 연락처 정보를 유지하여 중요한 알림을 받을 수 있습니다.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BuyerProfile;
