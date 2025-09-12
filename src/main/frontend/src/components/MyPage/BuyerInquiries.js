import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './BuyerInquiries.css';

const BuyerInquiries = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [filter, setFilter] = useState('all'); // all, pending, answered, closed

    // 문의 목록 가져오기
    const fetchInquiries = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/mypage/api/buyers/${userId}/inquiries`);
            if (response.ok) {
                const data = await response.json();
                setInquiries(data);
            } else {
                console.error('문의 목록 조회 실패');
                setMessage('문의 목록을 불러오는데 실패했습니다.');
            }
        } catch (error) {
            console.error('문의 목록 조회 오류:', error);
            setMessage('문의 목록 조회 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInquiries();
    }, [userId]);

    // 문의 상태별 필터링
    const filteredInquiries = inquiries.filter(inquiry => {
        if (filter === 'all') return true;
        return inquiry.status === filter;
    });

    // 문의 상태별 색상 및 텍스트
    const getStatusInfo = (status) => {
        switch (status) {
            case 'PENDING':
                return { text: '답변 대기', color: '#f39c12', bgColor: '#fef3c7' };
            case 'ANSWERED':
                return { text: '답변 완료', color: '#2ecc71', bgColor: '#dcfce7' };
            case 'CLOSED':
                return { text: '문의 종료', color: '#95a5a6', bgColor: '#f8f9fa' };
            default:
                return { text: '상태 미정', color: '#95a5a6', bgColor: '#f8f9fa' };
        }
    };

    // 문의 상태별 필터 옵션
    const filterOptions = [
        { value: 'all', label: '전체 문의' },
        { value: 'PENDING', label: '답변 대기' },
        { value: 'ANSWERED', label: '답변 완료' },
        { value: 'CLOSED', label: '문의 종료' }
    ];

    // 문의 종료 처리
    const handleCloseInquiry = async (inquiryId) => {
        if (!window.confirm('정말로 이 문의를 종료하시겠습니까?')) {
            return;
        }

        try {
            const response = await fetch(`/mypage/api/inquiries/${inquiryId}/close`, {
                method: 'PUT'
            });

            if (response.ok) {
                setMessage('문의가 성공적으로 종료되었습니다.');
                fetchInquiries(); // 문의 목록 새로고침
            } else {
                setMessage('문의 종료 처리에 실패했습니다.');
            }
        } catch (error) {
            console.error('문의 종료 오류:', error);
            setMessage('문의 종료 처리 중 오류가 발생했습니다.');
        }
    };

    if (loading) {
        return <div className="loading">문의 내역을 불러오는 중...</div>;
    }

    return (
        <div className="buyer-inquiries-container">
            {/* 헤더 */}
            <div className="header">
                <h1>💬 문의 관리</h1>
                <p>작성한 문의 내역과 답글을 확인하세요</p>
            </div>

            {/* 메시지 표시 */}
            {message && (
                <div className={`message ${message.includes('성공') ? 'success' : 'error'}`}>
                    {message}
                </div>
            )}

            {/* 필터 및 통계 */}
            <div className="inquiries-summary">
                <div className="summary-stats">
                    <div className="stat-item">
                        <div className="stat-number">{inquiries.length}</div>
                        <div className="stat-label">총 문의</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">
                            {inquiries.filter(i => i.status === 'PENDING').length}
                        </div>
                        <div className="stat-label">답변 대기</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">
                            {inquiries.filter(i => i.status === 'ANSWERED').length}
                        </div>
                        <div className="stat-label">답변 완료</div>
                    </div>
                </div>

                <div className="filter-section">
                    <label>문의 상태 필터:</label>
                    <select 
                        value={filter} 
                        onChange={(e) => setFilter(e.target.value)}
                        className="filter-select"
                    >
                        {filterOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* 문의 목록 */}
            <div className="inquiries-section">
                <h3>📋 문의 내역</h3>
                
                {filteredInquiries.length === 0 ? (
                    <div className="no-inquiries">
                        <div className="no-inquiries-icon">💬</div>
                        <h4>작성한 문의가 없습니다</h4>
                        <p>궁금한 점이 있으시면 문의해보세요!</p>
                        <button 
                            className="contact-btn"
                            onClick={() => navigate('/contact')}
                        >
                            문의하기
                        </button>
                    </div>
                ) : (
                    <div className="inquiries-list">
                        {filteredInquiries.map((inquiry, index) => {
                            const statusInfo = getStatusInfo(inquiry.status);
                            return (
                                <div key={inquiry.inquiryId || index} className="inquiry-card">
                                    <div className="inquiry-header">
                                        <div className="inquiry-info">
                                            <h4>{inquiry.title || '제목 없음'}</h4>
                                            <p className="inquiry-date">
                                                작성일: {inquiry.createdAt ? new Date(inquiry.createdAt).toLocaleDateString() : '날짜 정보 없음'}
                                            </p>
                                            <p className="inquiry-category">
                                                카테고리: {inquiry.category || '일반 문의'}
                                            </p>
                                        </div>
                                        <div 
                                            className="inquiry-status"
                                            style={{ 
                                                color: statusInfo.color, 
                                                backgroundColor: statusInfo.bgColor 
                                            }}
                                        >
                                            {statusInfo.text}
                                        </div>
                                    </div>

                                    <div className="inquiry-content">
                                        <h5>📝 문의 내용</h5>
                                        <p>{inquiry.content || '문의 내용이 없습니다.'}</p>
                                        
                                        {inquiry.attachments && inquiry.attachments.length > 0 && (
                                            <div className="attachments">
                                                <h6>📎 첨부파일</h6>
                                                <ul>
                                                    {inquiry.attachments.map((file, fileIndex) => (
                                                        <li key={fileIndex}>
                                                            <a href={file.url} target="_blank" rel="noopener noreferrer">
                                                                📎 {file.name}
                                                            </a>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>

                                    {inquiry.reply && (
                                        <div className="seller-reply">
                                            <h5>💬 판매자 답변</h5>
                                            <div className="reply-content">
                                                <p>{inquiry.reply}</p>
                                                <div className="reply-info">
                                                    <span className="reply-date">
                                                        답변일: {inquiry.replyDate ? new Date(inquiry.replyDate).toLocaleDateString() : '날짜 정보 없음'}
                                                    </span>
                                                    {inquiry.replyAttachments && inquiry.replyAttachments.length > 0 && (
                                                        <div className="reply-attachments">
                                                            <h6>📎 답변 첨부파일</h6>
                                                            <ul>
                                                                {inquiry.replyAttachments.map((file, fileIndex) => (
                                                                    <li key={fileIndex}>
                                                                        <a href={file.url} target="_blank" rel="noopener noreferrer">
                                                                            📎 {file.name}
                                                                        </a>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="inquiry-actions">
                                        {inquiry.status === 'ANSWERED' && inquiry.status !== 'CLOSED' && (
                                            <button 
                                                className="close-btn"
                                                onClick={() => handleCloseInquiry(inquiry.inquiryId)}
                                            >
                                                🔒 문의 종료
                                            </button>
                                        )}
                                        
                                        {inquiry.status === 'PENDING' && (
                                            <button className="edit-btn">
                                                ✏️ 문의 수정
                                            </button>
                                        )}
                                        
                                        <button className="detail-btn">
                                            📋 상세보기
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* 문의 작성 가이드 */}
            <div className="inquiry-guide">
                <h3>📝 문의 작성 가이드</h3>
                <div className="guide-content">
                    <div className="guide-item">
                        <div className="guide-icon">📋</div>
                        <div className="guide-text">
                            <h4>구체적인 제목</h4>
                            <p>문의 내용을 한눈에 알 수 있는 구체적인 제목을 작성해주세요.</p>
                        </div>
                    </div>
                    <div className="guide-item">
                        <div className="guide-icon">💬</div>
                        <div className="guide-text">
                            <h4>상세한 내용</h4>
                            <p>문제 상황과 요청사항을 구체적으로 설명해주세요.</p>
                        </div>
                    </div>
                    <div className="guide-item">
                        <div className="guide-icon">📸</div>
                        <div className="guide-text">
                            <h4>증빙 자료</h4>
                            <p>필요한 경우 스크린샷이나 사진을 첨부해주세요.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 빠른 문의 작성 */}
            <div className="quick-inquiry">
                <h3>🚀 빠른 문의 작성</h3>
                <p>간단한 문의사항이 있으시면 바로 작성해보세요!</p>
                <button 
                    className="new-inquiry-btn"
                    onClick={() => navigate('/contact/new')}
                >
                    ✍️ 새 문의 작성
                </button>
            </div>
        </div>
    );
};

export default BuyerInquiries;
