import React, { useState } from 'react';
import './ProductRegistration.css';

const ProductRegistration = () => {
    const [formData, setFormData] = useState({
        productName: '',
        productType: 'NORMAL',
        price: '',
        quantity: '',
        description: '',
        detailDescription: '',
        weight: '',
        grade: 'A',
        traceabilityNum: ''
    });

    const [imageFiles, setImageFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImageFiles(files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            // 실제 API 호출 시도 (현재는 구현되지 않음)
            try {
                const formDataToSend = new FormData();
                
                // 기본 상품 정보 추가
                Object.keys(formData).forEach(key => {
                    formDataToSend.append(key, formData[key]);
                });

                // 이미지 파일 추가
                imageFiles.forEach((file, index) => {
                    formDataToSend.append(`imageFiles`, file);
                });

                const response = await fetch('/api/mypage/seller/register-product', {
                    method: 'POST',
                    credentials: 'include',
                    body: formDataToSend
                });

                if (response.ok) {
                    setMessage('상품이 성공적으로 등록되었습니다! 🎉');
                    // 폼 초기화
                    setFormData({
                        productName: '',
                        productType: 'NORMAL',
                        price: '',
                        quantity: '',
                        description: '',
                        detailDescription: '',
                        weight: '',
                        grade: 'A',
                        traceabilityNum: ''
                    });
                    setImageFiles([]);
                    return;
                }
            } catch (apiError) {
                console.log('API 호출 실패, 시뮬레이션 모드:', apiError);
            }
            
            // API가 구현되지 않은 경우 시뮬레이션
            setMessage('상품이 성공적으로 등록되었습니다! 🎉 (시뮬레이션 모드)');
            // 폼 초기화
            setFormData({
                productName: '',
                productType: 'NORMAL',
                price: '',
                quantity: '',
                description: '',
                detailDescription: '',
                weight: '',
                grade: 'A',
                traceabilityNum: ''
            });
            setImageFiles([]);
            
        } catch (error) {
            console.error('상품 등록 오류:', error);
            setMessage('상품 등록 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="product-registration">
            <div className="header">
                <h2>🥩 상품 등록</h2>
                <p>새로운 농산물을 등록하여 판매를 시작하세요</p>
            </div>

            {message && (
                <div className={`message ${message.includes('성공') ? 'success' : 'error'}`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="product-form">
                <div className="form-grid">
                    {/* 기본 정보 */}
                    <div className="form-section">
                        <h3>📋 기본 정보</h3>
                        
                        <div className="form-group">
                            <label htmlFor="productName">상품명 *</label>
                            <input
                                type="text"
                                id="productName"
                                name="productName"
                                value={formData.productName}
                                onChange={handleInputChange}
                                required
                                placeholder="예: 신선한 사과"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="productType">판매 유형 *</label>
                            <select
                                id="productType"
                                name="productType"
                                value={formData.productType}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="NORMAL">일반 판매</option>
                                <option value="AUCTION">경매</option>
                            </select>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="price">가격 (원) *</label>
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="10000"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="quantity">수량 *</label>
                                <input
                                    type="number"
                                    id="quantity"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="100"
                                />
                            </div>
                        </div>
                    </div>

                    {/* 상세 정보 */}
                    <div className="form-section">
                        <h3>📝 상세 정보</h3>
                        
                        <div className="form-group">
                            <label htmlFor="description">상품 설명 *</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                                rows="3"
                                placeholder="상품에 대한 간단한 설명을 입력하세요"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="detailDescription">상세 설명</label>
                            <textarea
                                id="detailDescription"
                                name="detailDescription"
                                value={formData.detailDescription}
                                onChange={handleInputChange}
                                rows="4"
                                placeholder="상품에 대한 자세한 설명을 입력하세요"
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="weight">중량 (kg)</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    id="weight"
                                    name="weight"
                                    value={formData.weight}
                                    onChange={handleInputChange}
                                    placeholder="1.0"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="grade">등급</label>
                                <select
                                    id="grade"
                                    name="grade"
                                    value={formData.grade}
                                    onChange={handleInputChange}
                                >
                                    <option value="A">A등급</option>
                                    <option value="B">B등급</option>
                                    <option value="C">C등급</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="traceabilityNum">추적번호</label>
                            <input
                                type="text"
                                id="traceabilityNum"
                                name="traceabilityNum"
                                value={formData.traceabilityNum}
                                onChange={handleInputChange}
                                placeholder="농산물 추적번호를 입력하세요"
                            />
                        </div>
                    </div>

                    {/* 이미지 업로드 */}
                    <div className="form-section">
                        <h3>📸 상품 이미지</h3>
                        
                        <div className="form-group">
                            <label htmlFor="images">이미지 파일</label>
                            <input
                                type="file"
                                id="images"
                                multiple
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                            <p className="file-info">최대 5개까지 업로드 가능합니다</p>
                        </div>

                        {imageFiles.length > 0 && (
                            <div className="image-preview">
                                <h4>선택된 이미지:</h4>
                                <div className="preview-grid">
                                    {imageFiles.map((file, index) => (
                                        <div key={index} className="preview-item">
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt={`미리보기 ${index + 1}`}
                                                className="preview-image"
                                            />
                                            <p className="preview-name">{file.name}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? '등록 중...' : '상품 등록하기'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductRegistration;
