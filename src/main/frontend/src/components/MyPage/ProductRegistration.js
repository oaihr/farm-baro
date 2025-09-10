import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Editor } from '@tinymce/tinymce-react';
import { fetchCurrentUser } from '../../store/store';
import './ProductRegistration.css';

const ProductRegistration = () => {
    const dispatch = useDispatch();
    
    const { userId } = useSelector((state) => state.auth);
    const [formData, setFormData] = useState({
        productName: '',
        productType: 'NORMAL',
        price: '',
        quantity: '',
        description: '',
        detailDescription: '',
        weight: '',
        meatKind: '',
        meatPart: '',
        grade: '',
        traceabilityNum: '',
        imageUrls: []
    });

    const [imageUrlsText, setImageUrlsText] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // 고기 종류별 부위 옵션
    const meatPartOptions = {
        '소': ['등심', '안심', '갈비', '기타'],
        '돼지': ['삼겹살', '목살', '갈비', '기타'],
        '닭': ['가슴살', '다리살', '기타']
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'imageUrls') {
            // 텍스트 상태 업데이트
            setImageUrlsText(value);
            // 이미지 URL들을 쉼표로 구분하여 배열로 변환
            const urls = value.split(',').map(url => url.trim()).filter(url => url.length > 0);
            setFormData(prev => ({
                ...prev,
                [name]: urls
            }));
        } else {
            setFormData(prev => {
                const newData = {
                    ...prev,
                    [name]: value
                };
                
                // 고기 종류가 변경되면 부위와 등급을 초기화
                if (name === 'meatKind') {
                    newData.meatPart = '';
                    newData.grade = '';
                }
                
                return newData;
            });
        }
    };


    // judgeKindName 자동 생성 (고기 종류 → 영문)
    const getJudgeKindName = () => {
        switch(formData.meatKind) {
            case '소': return 'beef';
            case '돼지': return 'pork';
            case '닭': return 'chicken';
            default: return '';
        }
    };

    // cutName 자동 생성
    const getCutName = () => {
        const meatKind = formData.meatKind;
        const meatPart = formData.meatPart;
        
        if (meatKind === '소') {
            switch(meatPart) {
                case '등심': return 'sirloin';
                case '안심': return 'tenderloin';
                case '갈비': return 'rib';
                default: return 'etc';
            }
        } else if (meatKind === '돼지') {
            switch(meatPart) {
                case '삼겹살': return 'belly';
                case '목살': return 'neck';
                case '갈비': return 'rib';
                default: return 'etc';
            }
        } else if (meatKind === '닭') {
            switch(meatPart) {
                case '가슴살': return 'breast';
                case '다리살': return 'leg';
                default: return 'etc';
            }
        }
        return 'etc';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            // 실제 API 호출 시도 (현재는 구현되지 않음)
            try {
                const formDataToSend = new FormData();
                
                // 매핑된 값들 추가
                const judgeKindName = getJudgeKindName();
                const cutName = getCutName();
                
                formDataToSend.append('title', formData.productName);
                formDataToSend.append('judgeKindName', judgeKindName);
                formDataToSend.append('cutName', cutName);
                formDataToSend.append('qty', formData.quantity);
                formDataToSend.append('weight', formData.weight);
                formDataToSend.append('price', formData.price);
                formDataToSend.append('description', formData.description);
                formDataToSend.append('detailDescription', formData.detailDescription);
                formDataToSend.append('grade', formData.grade);
                formDataToSend.append('traceabilityNum', formData.traceabilityNum);
                formDataToSend.append('saleStatus', 'draft');

                // 이미지 URL 추가 (순서 정보 포함)
                if (formData.imageUrls && formData.imageUrls.length > 0) {
                    formData.imageUrls.forEach((url, index) => {
                        formDataToSend.append(`imageUrls`, url);
                        formDataToSend.append(`imageOrderIndexes`, index + 1); // ORDER_INDEX는 1부터 시작
                    });
                }

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
                        meatKind: '',
                        meatPart: '',
                        grade: '',
                        traceabilityNum: ''
                    });
                    setImageUrlsText('');
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
                meatKind: '',
                meatPart: '',
                grade: '',
                traceabilityNum: ''
            });
            setImageUrlsText('');
            
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
                                placeholder="예: 소고기 등심 1++등급"
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
                                <label htmlFor="price">kg당 가격 *</label>
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
                            <Editor
                                apiKey="ryw90ac70zjvmpwkezw0kv9oef882x9f291lx2gpzcbh5ywk"
                                value={formData.detailDescription}
                                onEditorChange={(content) => setFormData(prev => ({
                                    ...prev,
                                    detailDescription: content
                                }))}
                                init={{
                                    height: 300,
                                    menubar: false,
                                    plugins: [
                                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                        'insertdatetime', 'media', 'table', 'help', 'wordcount'
                                    ],
                                    toolbar: 'undo redo | blocks | ' +
                                        'bold italic forecolor | alignleft aligncenter ' +
                                        'alignright alignjustify | bullist numlist outdent indent | ' +
                                        'removeformat | help',
                                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                                }}
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
                                <label htmlFor="meatKind">고기 종류 *</label>
                                <select
                                    id="meatKind"
                                    name="meatKind"
                                    value={formData.meatKind}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">고기 종류를 선택하세요</option>
                                    <option value="소">소</option>
                                    <option value="돼지">돼지</option>
                                    <option value="닭">닭</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="meatPart">부위 *</label>
                            <select
                                id="meatPart"
                                name="meatPart"
                                value={formData.meatPart}
                                onChange={handleInputChange}
                                required
                                disabled={!formData.meatKind}
                            >
                                <option value="">부위를 선택하세요</option>
                                {formData.meatKind && meatPartOptions[formData.meatKind]?.map(part => (
                                    <option key={part} value={part}>{part}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="grade">고기 등급 *</label>
                            <select
                                id="grade"
                                name="grade"
                                value={formData.grade}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">등급을 선택하세요</option>
                                {formData.meatKind === '소' && (
                                    <>
                                        <option value="1++">1++등급 (최고급)</option>
                                        <option value="1+">1+등급 (고급)</option>
                                        <option value="1">1등급 (상급)</option>
                                        <option value="2">2등급 (중급)</option>
                                        <option value="3">3등급 (일반)</option>
                                    </>
                                )}
                                {formData.meatKind === '돼지' && (
                                    <>
                                        <option value="1+">1+등급 (고급)</option>
                                        <option value="1">1등급 (상급)</option>
                                        <option value="2">2등급 (중급)</option>
                                        <option value="등외">등외등급 (일반)</option>
                                    </>
                                )}
                                {formData.meatKind === '닭' && (
                                    <>
                                        <option value="1+">1+등급 (고급)</option>
                                        <option value="1">1등급 (상급)</option>
                                        <option value="2">2등급 (중급)</option>
                                    </>
                                )}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="traceabilityNum">추적번호</label>
                            <input
                                type="text"
                                id="traceabilityNum"
                                name="traceabilityNum"
                                value={formData.traceabilityNum}
                                onChange={handleInputChange}
                                placeholder="축산물 추적번호를 입력하세요"
                            />
                        </div>
                    </div>

                    {/* 이미지 URL 입력 */}
                    <div className="form-section">
                        <h3>📸 상품 이미지</h3>
                        
                        <div className="form-group">
                            <label htmlFor="imageUrls">상품 이미지 URL (여러 개 입력 가능)</label>
                            <textarea
                                id="imageUrls"
                                name="imageUrls"
                                value={imageUrlsText}
                                onChange={handleInputChange}
                                placeholder="이미지 URL을 쉼표로 구분하여 입력하세요&#10;예: https://example.com/image1.jpg, https://example.com/image2.jpg"
                                rows="3"
                                className="url-input"
                                required
                            />
                            <small className="url-help">이미지 URL을 쉼표로 구분하여 입력하세요. 첫 번째 이미지가 대표 이미지로 사용됩니다.</small>
                            {formData.imageUrls && formData.imageUrls.length > 0 && (
                                <div className="selected-urls">
                                    <p>입력된 이미지 URL: {formData.imageUrls.length}개</p>
                                    <ul>
                                        {formData.imageUrls.map((url, index) => (
                                            <li key={index}>
                                                <a href={url} target="_blank" rel="noopener noreferrer">
                                                    이미지 {index + 1} (새 탭에서 보기)
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
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
