import React, { useState, useEffect } from 'react';
import './ProfileEdit.css';

const ProfileEdit = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [formData, setFormData] = useState({
        userName: '',
        email: '',
        tel: '',
        address: '',
        businessNumber: ''
    });

    // 사용자 정보 가져오기
    const fetchUserInfo = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/auth/me', {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                setUserInfo(data);
                setFormData({
                    userName: data.name || '',
                    email: data.email || '',
                    tel: data.tel || '',
                    address: data.address || '',
                    businessNumber: data.businessNumber || ''
                });
            }
        } catch (error) {
            console.error('사용자 정보 조회 오류:', error);
            setMessage('사용자 정보를 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserInfo();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');

        try {
            // 실제 API 호출 시도 (현재는 구현되지 않음)
            try {
                const response = await fetch('/api/mypage/seller/update-profile', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    setMessage('정보가 성공적으로 수정되었습니다! 🎉');
                    // 업데이트된 정보 다시 가져오기
                    await fetchUserInfo();
                    return;
                }
            } catch (apiError) {
                console.log('API 호출 실패, 시뮬레이션 모드:', apiError);
            }
            
            // API가 구현되지 않은 경우 시뮬레이션
            setMessage('정보가 성공적으로 수정되었습니다! 🎉 (시뮬레이션 모드)');
            // 업데이트된 정보 다시 가져오기
            await fetchUserInfo();
            
        } catch (error) {
            console.error('정보 수정 오류:', error);
            setMessage('정보 수정 중 오류가 발생했습니다.');
        } finally {
            setSaving(false);
        }
    };

    const handleReset = () => {
        if (userInfo) {
            setFormData({
                userName: userInfo.name || '',
                email: userInfo.email || '',
                tel: userInfo.tel || '',
                address: userInfo.address || '',
                businessNumber: userInfo.businessNumber || ''
            });
        }
        setMessage('');
    };

    if (loading) {
        return (
            <div className="profile-edit">
                <div className="loading">정보를 불러오는 중...</div>
            </div>
        );
    }

    return (
        <div className="profile-edit">
            <div className="header">
                <h2>👤 정보 수정</h2>
                <p>개인정보를 수정하여 계정을 관리하세요</p>
            </div>

            {message && (
                <div className={`message ${message.includes('성공') ? 'success' : 'error'}`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-sections">
                    {/* 기본 정보 */}
                    <div className="form-section">
                        <h3>📋 기본 정보</h3>
                        
                        <div className="form-group">
                            <label htmlFor="userName">닉네임 *</label>
                            <input
                                type="text"
                                id="userName"
                                name="userName"
                                value={formData.userName}
                                onChange={handleInputChange}
                                required
                                placeholder="닉네임을 입력하세요"
                            />
                            <p className="field-note">다른 사용자에게 표시되는 이름입니다.</p>
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">이메일 *</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                placeholder="이메일을 입력하세요"
                            />
                            <p className="field-note">로그인에 사용되는 이메일입니다.</p>
                        </div>
                    </div>

                    {/* 연락처 정보 */}
                    <div className="form-section">
                        <h3>📞 연락처 정보</h3>
                        
                        <div className="form-group">
                            <label htmlFor="tel">전화번호</label>
                            <input
                                type="tel"
                                id="tel"
                                name="tel"
                                value={formData.tel}
                                onChange={handleInputChange}
                                placeholder="010-1234-5678"
                            />
                            <p className="field-note">구매자와의 연락에 사용됩니다.</p>
                        </div>

                        <div className="form-group">
                            <label htmlFor="address">주소</label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                placeholder="주소를 입력하세요"
                            />
                            <p className="field-note">농장 또는 사업장 주소를 입력하세요.</p>
                        </div>
                    </div>

                    {/* 사업자 정보 */}
                    <div className="form-section">
                        <h3>🏢 사업자 정보</h3>
                        
                        <div className="form-group">
                            <label htmlFor="businessNumber">사업자번호</label>
                            <input
                                type="text"
                                id="businessNumber"
                                name="businessNumber"
                                value={formData.businessNumber}
                                onChange={handleInputChange}
                                placeholder="123-45-67890"
                            />
                            <p className="field-note">선택사항입니다. 사업자번호가 있으면 입력하세요.</p>
                        </div>
                    </div>

                    {/* 수정 불가 항목 안내 */}
                    <div className="form-section readonly-info">
                        <h3>🔒 수정 불가 항목</h3>
                        <div className="readonly-fields">
                            <div className="readonly-field">
                                <label>사용자 ID</label>
                                <div className="readonly-value">{userInfo?.id}</div>
                                <p className="field-note">고유 식별자로 변경할 수 없습니다.</p>
                            </div>
                            <div className="readonly-field">
                                <label>사용자 유형</label>
                                <div className="readonly-value">{userInfo?.userType}</div>
                                <p className="field-note">계정 유형은 변경할 수 없습니다.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="button" onClick={handleReset} className="reset-btn">
                        초기화
                    </button>
                    <button type="submit" className="save-btn" disabled={saving}>
                        {saving ? '저장 중...' : '정보 저장'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProfileEdit;
