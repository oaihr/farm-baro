import React, { useState, useEffect } from 'react';
import './InquiryManagement.css';

const InquiryManagement = () => {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState('');

    // 문의 목록 가져오기
    const fetchInquiries = async () => {
        try {
            setLoading(true);
            
            // 실제 API 호출 시도 (현재는 구현되지 않음)
            try {
                const response = await fetch('/api/mypage/seller/inquiries', {
                    credentials: 'include'
                });
                
                if (response.ok) {
                    const responseText = await response.text();
                    if (responseText && responseText !== 'error') {
                        try {
                            const data = JSON.parse(responseText);
                            setInquiries(data);
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
            
        } catch (error) {
            console.error('문의 조회 오류:', error);
            setMessage('문의를 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInquiries();
    }, []);

    // 답변 작성
    const handleReply = async (inquiryId) => {
        if (!replyText.trim()) {
            setMessage('답변 내용을 입력해주세요.');
            return;
        }

        try {
            // 임시 처리 (추후 API 연결)
            setInquiries(prev => prev.map(inquiry => 
                inquiry.id === inquiryId 
                    ? { ...inquiry, sellerReply: replyText, status: 'ANSWERED' }
                    : inquiry
            ));
            
            setMessage('답변이 성공적으로 작성되었습니다!');
            setReplyingTo(null);
            setReplyText('');
        } catch (error) {
            console.error('답변 작성 오류:', error);
            setMessage('답변 작성에 실패했습니다.');
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'PENDING':
                return <span className="status-badge pending">답변 대기</span>;
            case 'ANSWERED':
                return <span className="status-badge answered">답변 완료</span>;
            default:
                return <span className="status-badge">알 수 없음</span>;
        }
    };

    return (
        <div className="inquiry-management">
            <div className="header">
                <h2>❓ 문의 답변</h2>
                <p>구매자들의 문의를 확인하고 답변을 작성하세요</p>
            </div>

            {message && (
                <div className={`message ${message.includes('성공') ? 'success' : 'info'}`}>
                    {message}
                </div>
            )}

            <div className="inquiries-container">
                {loading ? (
                    <div className="loading">문의를 불러오는 중...</div>
                ) : inquiries.length === 0 ? (
                    <div className="no-inquiries">
                        <div className="no-inquiries-icon">📝</div>
                        <h3>아직 문의가 없습니다</h3>
                        <p>상품을 판매하면 구매자들의 문의가 여기에 표시됩니다.</p>
                    </div>
                ) : (
                    <div className="inquiries-list">
                        {inquiries.map((inquiry) => (
                            <div key={inquiry.id} className="inquiry-card">
                                <div className="inquiry-header">
                                    <div className="inquiry-info">
                                        <h4 className="product-name">{inquiry.productName}</h4>
                                        <div className="inquirer-info">
                                            <span className="buyer-name">{inquiry.buyerName}</span>
                                            <span className="inquiry-date">{inquiry.inquiryDate}</span>
                                        </div>
                                    </div>
                                    {getStatusBadge(inquiry.status)}
                                </div>

                                <div className="inquiry-content">
                                    <h5 className="inquiry-title">{inquiry.title}</h5>
                                    <p className="inquiry-text">{inquiry.content}</p>
                                </div>

                                {inquiry.sellerReply ? (
                                    <div className="seller-reply">
                                        <div className="reply-header">
                                            <span className="reply-label">판매자 답변</span>
                                        </div>
                                        <div className="reply-content">
                                            <p>{inquiry.sellerReply}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="reply-section">
                                        {replyingTo === inquiry.id ? (
                                            <div className="reply-form">
                                                <textarea
                                                    value={replyText}
                                                    onChange={(e) => setReplyText(e.target.value)}
                                                    placeholder="구매자에게 답변을 작성하세요..."
                                                    rows="4"
                                                />
                                                <div className="reply-actions">
                                                    <button 
                                                        onClick={() => handleReply(inquiry.id)}
                                                        className="reply-btn"
                                                    >
                                                        답변 작성
                                                    </button>
                                                    <button 
                                                        onClick={() => {
                                                            setReplyingTo(null);
                                                            setReplyText('');
                                                        }}
                                                        className="cancel-btn"
                                                    >
                                                        취소
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <button 
                                                onClick={() => setReplyingTo(inquiry.id)}
                                                className="write-reply-btn"
                                            >
                                                답변 작성하기
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default InquiryManagement;
