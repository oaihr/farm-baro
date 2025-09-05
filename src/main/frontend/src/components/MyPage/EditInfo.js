import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EditInfo.css';

const EditInfo = () => {
    const { userId, userType } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [userInfo, setUserInfo] = useState(null);
    
    const [formData, setFormData] = useState({
        userName: '',
        email: '',
        tel: '',
        address: '',
        businessNumber: ''
    });

    const tabs = [
        { id: 'profile', label: '프로필 정보', icon: '👤' },
        { id: 'business', label: '사업자 정보', icon: '🏢' },
        { id: 'security', label: '보안 설정', icon: '🔒' },
        { id: 'settings', label: '환경 설정', icon: '⚙️' }
    ];

    const quickActions = [
        { icon: '💾', label: '저장', action: 'save' },
        { icon: '🔄', label: '초기화', action: 'reset' },
        { icon: '📋', label: '내보내기', action: 'export' },
        { icon: '🔍', label: '미리보기', action: 'preview' },
        { icon: '❌', label: '취소', action: 'cancel' }
    ];

    // 사용자 정보 가져오기
    const fetchUserInfo = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:8080/api/mypage/${userType}/${userId}`);
            if (response.ok) {
                const data = await response.json();
                setUserInfo(data);
                setFormData({
                    userName: data.userName || '',
                    email: data.email || '',
                    tel: data.tel || '',
                    address: data.address || '',
                    businessNumber: data.businessNumber || ''
                });
            } else {
                console.error('사용자 정보 조회 실패');
                setMessage('사용자 정보를 불러오는데 실패했습니다.');
            }
        } catch (error) {
            console.error('사용자 정보 조회 오류:', error);
            setMessage('사용자 정보 조회 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 사용자 정보 수정
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setMessage('');

            const updateData = {
                id: userId,
                userName: formData.userName,
                email: formData.email,
                tel: formData.tel,
                address: formData.address,
                businessNumber: formData.businessNumber
            };

            const response = await fetch(`http://localhost:8080/api/mypage/${userType}/${userId}/edit`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData)
            });

            if (response.ok) {
                setMessage('사용자 정보가 성공적으로 수정되었습니다! ✨');
                
                // 로컬 상태 업데이트
                setUserInfo(prev => ({
                    ...prev,
                    ...formData
                }));
                
                setTimeout(() => {
                    setMessage('');
                }, 3000);
            } else {
                setMessage('사용자 정보 수정에 실패했습니다. 다시 시도해주세요.');
            }
        } catch (error) {
            console.error('사용자 정보 수정 오류:', error);
            setMessage('사용자 정보 수정 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 폼 입력 처리
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // 폼 초기화
    const handleReset = () => {
        if (userInfo) {
            setFormData({
                userName: userInfo.userName || '',
                email: userInfo.email || '',
                tel: userInfo.tel || '',
                address: userInfo.address || '',
                businessNumber: userInfo.businessNumber || ''
            });
        }
        setMessage('폼이 초기화되었습니다.');
        setTimeout(() => {
            setMessage('');
        }, 2000);
    };

    // 빠른 액션 처리
    const handleQuickAction = (action) => {
        switch(action) {
            case 'save':
                document.getElementById('edit-form').requestSubmit();
                break;
            case 'reset':
                handleReset();
                break;
            case 'export':
                setMessage('내보내기 기능은 준비 중입니다.');
                break;
            case 'preview':
                setMessage('미리보기 기능은 준비 중입니다.');
                break;
            case 'cancel':
                navigate(`/mypage/${userType}/${userId}`);
                break;
            default:
                break;
        }
        
        if (action !== 'save' && action !== 'reset' && action !== 'cancel') {
            setTimeout(() => {
                setMessage('');
            }, 3000);
        }
    };

    // 컴포넌트 마운트 시 사용자 정보 가져오기
    useEffect(() => {
        fetchUserInfo();
    }, [userId, userType]);

    if (loading && !userInfo) {
        return (
            <div className="edit-info-container">
                <div className="loading">사용자 정보를 불러오는 중...</div>
            </div>
        );
    }

    return (
        <div className="edit-info-container">
            {/* 헤더 */}
            <div className="header">
                <h1>👤 정보 수정</h1>
                <p>개인정보와 사업자 정보를 안전하게 관리하세요</p>
            </div>

            {/* 탭 메뉴 */}
            <div className="tab-container">
                <div className="tabs">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <span className="tab-icon">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* 빠른 액션 카드 */}
            <div className="quick-actions">
                {quickActions.map((action, index) => (
                    <button 
                        key={index} 
                        className="quick-action-card" 
                        onClick={() => handleQuickAction(action.action)}
                    >
                        <div className="action-icon">{action.icon}</div>
                        <div className="action-label">{action.label}</div>
                    </button>
                ))}
            </div>

            {/* 메시지 표시 */}
            {message && (
                <div className={`message ${message.includes('성공') || message.includes('수정') ? 'success' : 'info'}`}>
                    {message}
                </div>
            )}

            {/* 메인 콘텐츠 */}
            <div className="main-content">
                {/* 폼 섹션 */}
                <div className="form-section">
                    <h3>📝 {tabs.find(t => t.id === activeTab)?.label}</h3>
                    
                    <form id="edit-form" onSubmit={handleSubmit}>
                        {activeTab === 'profile' && (
                            <>
                                <div className="form-group">
                                    <label>사용자명 *</label>
                                    <input
                                        type="text"
                                        name="userName"
                                        value={formData.userName}
                                        onChange={handleInputChange}
                                        placeholder="사용자명을 입력하세요"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>이메일 *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="이메일을 입력하세요"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>전화번호 *</label>
                                    <input
                                        type="tel"
                                        name="tel"
                                        value={formData.tel}
                                        onChange={handleInputChange}
                                        placeholder="전화번호를 입력하세요"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>주소 *</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        placeholder="주소를 입력하세요"
                                        required
                                    />
                                </div>
                            </>
                        )}

                        {activeTab === 'business' && userType === 'seller' && (
                            <>
                                <div className="form-group">
                                    <label>사업자등록번호 *</label>
                                    <input
                                        type="text"
                                        name="businessNumber"
                                        value={formData.businessNumber}
                                        onChange={handleInputChange}
                                        placeholder="사업자등록번호를 입력하세요"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>사업자 유형</label>
                                    <input
                                        type="text"
                                        value="고기 판매업"
                                        disabled
                                        className="disabled-input"
                                    />
                                </div>
                            </>
                        )}

                        {activeTab === 'security' && (
                            <>
                                <div className="form-group">
                                    <label>현재 비밀번호</label>
                                    <input
                                        type="password"
                                        placeholder="현재 비밀번호를 입력하세요"
                                        disabled
                                        className="disabled-input"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>새 비밀번호</label>
                                    <input
                                        type="password"
                                        placeholder="새 비밀번호를 입력하세요"
                                        disabled
                                        className="disabled-input"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>비밀번호 확인</label>
                                    <input
                                        type="password"
                                        placeholder="새 비밀번호를 다시 입력하세요"
                                        disabled
                                        className="disabled-input"
                                    />
                                </div>
                            </>
                        )}

                        {activeTab === 'settings' && (
                            <>
                                <div className="form-group">
                                    <label>언어 설정</label>
                                    <select disabled className="disabled-input">
                                        <option>한국어</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>알림 설정</label>
                                    <div className="checkbox-group">
                                        <label className="checkbox-label">
                                            <input type="checkbox" disabled />
                                            이메일 알림
                                        </label>
                                        <label className="checkbox-label">
                                            <input type="checkbox" disabled />
                                            SMS 알림
                                        </label>
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="form-actions">
                            <button type="submit" className="submit-btn" disabled={loading}>
                                {loading ? '저장 중...' : '💾 정보 저장'}
                            </button>
                            <button type="button" className="reset-btn" onClick={handleReset}>
                                🔄 초기화
                            </button>
                        </div>
                    </form>
                </div>

                {/* 요약 섹션 */}
                <div className="summary-section">
                    <h3>📊 정보 요약</h3>
                    
                    {userInfo && (
                        <div className="user-summary">
                            <div className="user-avatar">
                                <div className="avatar-icon">👤</div>
                            </div>
                            <div className="user-details">
                                <h4>{userInfo.userName}</h4>
                                <p className="user-type">{userType === 'seller' ? '🥩 고기 판매자' : '🛒 고기 구매자'}</p>
                                <p className="user-email">{userInfo.email}</p>
                                <p className="user-phone">{userInfo.tel}</p>
                            </div>
                        </div>
                    )}

                    <div className="quick-links">
                        <h4>🔗 빠른 링크</h4>
                        <ul>
                            <li><a href={`/mypage/${userType}/${userId}`}>마이페이지로 돌아가기</a></li>
                            <li><a href="/">홈으로 이동</a></li>
                            <li><a href="/sale">상품 구매/판매</a></li>
                        </ul>
                    </div>

                    <div className="info-tips">
                        <h4>💡 정보 수정 팁</h4>
                        <ul>
                            <li>사용자명은 고객에게 표시되는 이름입니다</li>
                            <li>이메일은 주문 확인 및 알림에 사용됩니다</li>
                            <li>전화번호는 배송 및 문의 시 연락용으로 사용됩니다</li>
                            {userType === 'seller' && (
                                <li>사업자등록번호는 세금계산서 발행에 필요합니다</li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditInfo;


