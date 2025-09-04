import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Inquiries.css';

const Inquiries = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('all');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [inquiries, setInquiries] = useState([]);
    const [filteredInquiries, setFilteredInquiries] = useState([]);
    const [replyModal, setReplyModal] = useState({ show: false, inquiryId: null, replyText: '' });
    
    const tabs = [
        { id: 'all', label: '전체 문의', icon: '❓' },
        { id: 'pending', label: '답변대기', icon: '⏳' },
        { id: 'answered', label: '답변완료', icon: '✅' },
        { id: 'urgent', label: '긴급', icon: '🚨' },
        { id: 'product', label: '상품문의', icon: '🥩' }
    ];

    const quickActions = [
        { icon: '💬', label: '답변 작성', action: 'reply' },
        { icon: '📝', label: '템플릿 관리', action: 'template' },
        { icon: '📊', label: '문의 분석', action: 'analyze' },
        { icon: '🚀', label: '응답 시간', action: 'response' },
        { icon: '📈', label: '만족도', action: 'satisfaction' }
    ];

    // 문의 목록 가져오기
    const fetchInquiries = async () => {
        try {
            setLoading(true);
            
            // 실제 API 호출 시도 (현재는 구현되지 않음)
            try {
                const response = await fetch(`http://localhost:8080/mypage/seller/${userId}/inquiries`, {
                    credentials: 'include'
                });
                
                if (response.ok) {
                    const responseText = await response.text();
                    if (responseText && responseText !== 'error') {
                        try {
                            const data = JSON.parse(responseText);
                            setInquiries(data);
                            setFilteredInquiries(data);
                            return;
                        } catch (parseError) {
                            console.log('JSON 파싱 실패, 더미 데이터 사용:', parseError);
                        }
                    }
                }
            } catch (apiError) {
                console.log('API 호출 실패, 더미 데이터 사용:', apiError);
            }
            
            // API가 구현되지 않은 경우 더미 데이터 사용
            const dummyInquiries = [
                {
                    id: 1,
                    productName: '신선한 사과',
                    buyerName: '구매자1',
                    title: '배송 문의',
                    content: '언제쯤 배송이 가능한가요?',
                    inquiryDate: '2025-09-03',
                    status: 'PENDING',
                    sellerReply: null
                },
                {
                    id: 2,
                    productName: '고급 쌀',
                    buyerName: '구매자2',
                    title: '상품 문의',
                    content: '유기농 인증서가 있나요?',
                    inquiryDate: '2025-09-02',
                    status: 'ANSWERED',
                    sellerReply: '네, 유기농 인증서가 있습니다. 상품 상세페이지에서 확인하실 수 있습니다.'
                }
            ];
            setInquiries(dummyInquiries);
            setFilteredInquiries(dummyInquiries);
            
        } catch (error) {
            console.error('문의 목록 조회 오류:', error);
            setMessage('문의 목록 조회 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 문의 답변 작성
    const handleReply = async () => {
        if (!replyModal.replyText.trim()) {
            setMessage('답변 내용을 입력해주세요.');
            return;
        }

        try {
            setLoading(true);
            setMessage('');

            const response = await fetch(`http://localhost:8080/api/inquiries/${replyModal.inquiryId}/reply?sellerReply=${encodeURIComponent(replyModal.replyText)}`, {
                method: 'PUT'
            });

            if (response.ok) {
                setMessage('문의 답변이 성공적으로 작성되었습니다! ✨');
                
                // 로컬 상태 업데이트
                setInquiries(prevInquiries => 
                    prevInquiries.map(inquiry => 
                        inquiry.id === replyModal.inquiryId 
                            ? { 
                                ...inquiry, 
                                sellerReply: replyModal.replyText,
                                replyDate: new Date().toLocaleDateString('ko-KR'),
                                status: '답변완료'
                            }
                            : inquiry
                    )
                );
                
                // 모달 닫기
                setReplyModal({ show: false, inquiryId: null, replyText: '' });
                
                setTimeout(() => {
                    setMessage('');
                }, 3000);
            } else {
                setMessage('문의 답변 작성에 실패했습니다. 다시 시도해주세요.');
            }
        } catch (error) {
            console.error('문의 답변 작성 오류:', error);
            setMessage('문의 답변 작성 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 답변 모달 열기
    const openReplyModal = (inquiryId) => {
        setReplyModal({ show: true, inquiryId, replyText: '' });
    };

    // 답변 모달 닫기
    const closeReplyModal = () => {
        setReplyModal({ show: false, inquiryId: null, replyText: '' });
    };

    // 탭 변경 시 문의 필터링
    useEffect(() => {
        if (activeTab === 'all') {
            setFilteredInquiries(inquiries);
        } else if (activeTab === 'pending') {
            const filtered = inquiries.filter(inquiry => inquiry.status === '답변대기');
            setFilteredInquiries(filtered);
        } else if (activeTab === 'answered') {
            const filtered = inquiries.filter(inquiry => inquiry.status === '답변완료');
            setFilteredInquiries(filtered);
        } else if (activeTab === 'urgent') {
            const filtered = inquiries.filter(inquiry => inquiry.priority === '긴급');
            setFilteredInquiries(filtered);
        } else if (activeTab === 'product') {
            const filtered = inquiries.filter(inquiry => inquiry.category === '상품문의');
            setFilteredInquiries(filtered);
        }
    }, [activeTab, inquiries]);

    // 컴포넌트 마운트 시 문의 목록 가져오기
    useEffect(() => {
        fetchInquiries();
    }, [userId]);

    const inquiryStats = {
        total: inquiries.length,
        pending: inquiries.filter(i => i.status === '답변대기').length,
        answered: inquiries.filter(i => i.status === '답변완료').length,
        urgent: inquiries.filter(i => i.priority === '긴급').length,
        product: inquiries.filter(i => i.category === '상품문의').length,
        avgResponseTime: '3.5시간'
    };

    const getPriorityColor = (priority) => {
        return priority === '긴급' ? '#e74c3c' : '#3498db';
    };

    const getStatusColor = (status) => {
        return status === '답변완료' ? '#27ae60' : '#e74c3c';
    };

    const getCategoryIcon = (category) => {
        switch(category) {
            case '상품문의': return '🥩';
            case '배송문의': return '🚚';
            case '환불문의': return '💰';
            case '기타문의': return '❓';
            default: return '📝';
        }
    };

    // 빠른 액션 처리
    const handleQuickAction = (action) => {
        switch(action) {
            case 'reply':
                setMessage('답변 작성 기능을 사용하려면 개별 문의의 "답변 작성" 버튼을 클릭하세요.');
                break;
            case 'template':
                setMessage('템플릿 관리 기능은 준비 중입니다.');
                break;
            case 'analyze':
                setMessage('문의 분석은 상단의 통계 카드를 확인하세요.');
                break;
            case 'response':
                setMessage('응답 시간은 상단의 통계 카드에서 확인할 수 있습니다.');
                break;
            case 'satisfaction':
                setMessage('만족도 기능은 준비 중입니다.');
                break;
            default:
                break;
        }
        
        setTimeout(() => {
            setMessage('');
        }, 3000);
    };

    return (
        <div className="inquiries-container">
            {/* 헤더 */}
            <div className="header">
                <h1>❓ 문의 답변</h1>
                <p>고객들의 문의사항을 빠르고 정확하게 답변하세요</p>
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
                <div className={`message ${message.includes('성공') || message.includes('작성') ? 'success' : 'info'}`}>
                    {message}
                </div>
            )}

            {/* 문의 통계 요약 */}
            <div className="inquiry-stats">
                <h3>📊 문의 통계</h3>
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon">❓</div>
                        <div className="stat-number">{inquiryStats.total}</div>
                        <div className="stat-label">전체 문의</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">⏳</div>
                        <div className="stat-number">{inquiryStats.pending}</div>
                        <div className="stat-label">답변대기</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">✅</div>
                        <div className="stat-number">{inquiryStats.answered}</div>
                        <div className="stat-label">답변완료</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">🚨</div>
                        <div className="stat-number">{inquiryStats.urgent}</div>
                        <div className="stat-label">긴급문의</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">🥩</div>
                        <div className="stat-number">{inquiryStats.product}</div>
                        <div className="stat-label">상품문의</div>
                    </div>
                    <div className="stat-card highlight">
                        <div className="stat-icon">⏱️</div>
                        <div className="stat-number">{inquiryStats.avgResponseTime}</div>
                        <div className="stat-label">평균 응답시간</div>
                    </div>
                </div>
            </div>

            {/* 문의 목록 */}
            <div className="inquiries-section">
                <div className="section-header">
                    <h3>🥩 고객 문의</h3>
                    <div className="header-actions">
                        <button className="export-btn" onClick={() => setMessage('내보내기 기능은 준비 중입니다.')}>
                            📊 내보내기
                        </button>
                        <button className="refresh-btn" onClick={fetchInquiries} disabled={loading}>
                            🔄 새로고침
                        </button>
                    </div>
                </div>
                
                {loading ? (
                    <div className="loading">문의 목록을 불러오는 중...</div>
                ) : filteredInquiries.length === 0 ? (
                    <div className="no-inquiries">
                        {activeTab === 'all' ? '등록된 문의가 없습니다.' : `${tabs.find(t => t.id === activeTab)?.label} 문의가 없습니다.`}
                    </div>
                ) : (
                    <div className="inquiries-grid">
                        {filteredInquiries.map((inquiry, index) => (
                            <div key={index} className="inquiry-card">
                                <div className="inquiry-header">
                                    <div className="inquiry-info">
                                        <span className="inquiry-number">{inquiry.id}</span>
                                        <span className="inquiry-date">{inquiry.inquiryDate || inquiry.date}</span>
                                    </div>
                                    <div className="inquiry-meta">
                                        <div 
                                            className="inquiry-priority"
                                            style={{ backgroundColor: getPriorityColor(inquiry.priority) }}
                                        >
                                            {inquiry.priority === '긴급' ? '🚨 긴급' : '📝 일반'}
                                        </div>
                                        <div 
                                            className="inquiry-status"
                                            style={{ backgroundColor: getStatusColor(inquiry.status) }}
                                        >
                                            {inquiry.status === '답변완료' ? '✅ 답변완료' : '❓ 답변대기'}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="inquiry-content">
                                    <div className="customer-info">
                                        <p><strong>고객명:</strong> {inquiry.buyerName || inquiry.customer}</p>
                                        <p><strong>상품:</strong> {inquiry.productName || inquiry.product}</p>
                                        <p><strong>카테고리:</strong> {getCategoryIcon(inquiry.category)} {inquiry.category}</p>
                                    </div>
                                    
                                    <div className="inquiry-text">
                                        <h4 className="inquiry-title">{inquiry.title}</h4>
                                        <p className="inquiry-content-text">{inquiry.content}</p>
                                    </div>
                                    
                                    {inquiry.sellerReply && (
                                        <div className="reply-section">
                                            <h5>📝 판매자 답변</h5>
                                            <p className="reply-text">{inquiry.sellerReply}</p>
                                            <div className="reply-meta">
                                                <span className="reply-date">{inquiry.replyDate}</span>
                                                <span className="response-time">응답시간: {inquiry.responseTime || '빠른 응답'}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="inquiry-actions">
                                    {inquiry.status === '답변대기' ? (
                                        <button 
                                            className="action-btn primary"
                                            onClick={() => openReplyModal(inquiry.id)}
                                            disabled={loading}
                                        >
                                            답변 작성
                                        </button>
                                    ) : (
                                        <button className="action-btn secondary">답변 수정</button>
                                    )}
                                    <button className="action-btn secondary">상세보기</button>
                                    {inquiry.priority === '긴급' && (
                                        <button className="action-btn urgent">긴급 처리</button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* 답변 작성 모달 */}
            {replyModal.show && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>💬 문의 답변 작성</h3>
                            <button className="modal-close" onClick={closeReplyModal}>×</button>
                        </div>
                        <div className="modal-body">
                            <textarea
                                value={replyModal.replyText}
                                onChange={(e) => setReplyModal(prev => ({ ...prev, replyText: e.target.value }))}
                                placeholder="고객님의 문의사항에 대한 답변을 작성해주세요..."
                                rows="4"
                                className="reply-textarea"
                            />
                        </div>
                        <div className="modal-footer">
                            <button className="modal-btn cancel" onClick={closeReplyModal}>
                                취소
                            </button>
                            <button 
                                className="modal-btn submit" 
                                onClick={handleReply}
                                disabled={loading || !replyModal.replyText.trim()}
                            >
                                {loading ? '작성 중...' : '답변 작성'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inquiries;


