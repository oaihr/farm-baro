import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import './ProductRegister.css';

const ProductRegister = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('register');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [products, setProducts] = useState([]);
    
    const [formData, setFormData] = useState({
        title: '',           // sales.TITLE
        meatKind: '',        // 고기 종류 (소, 돼지, 닭)
        meatPart: '',        // 부위 (등심, 삼겹살, 가슴살 등)
        qty: '',            // sales.QTY (재고 수량)
        weight: '',          // sales.WEIGHT (1개당 무게 + 단위, 예: "1kg")
        price: '',           // sales.PRICE (kg당 가격)
        saleStatus: 'draft', // sales.SALE_STATUS (보류중)
        description: '',     // sales.DESCRIPTION (요약 설명)
        detailDescription: '', // sales.DETAIL_DESCRIPTION (상세 설명)
        grade: '',           // sales.GRADE (고기 등급: A, B, C 등)
        traceabilityNum: '', // sales.TRACEABILITY_NUM (가축 이력번호)
        imageFiles: []       // product_images 테이블용
    });

    const [editingProduct, setEditingProduct] = useState(null);
    const [viewingProduct, setViewingProduct] = useState(null);

    const tabs = [
        { id: 'register', label: '상품 등록', icon: '📦' },
        { id: 'manage', label: '상품 관리', icon: '📋' },
        { id: 'detail', label: '상품 상세', icon: '🔍' },
        { id: 'analytics', label: '판매 분석', icon: '📊' }
    ];

    const quickActions = [
        { icon: '📦', label: '상품 정보', action: 'edit' },
        { icon: '💰', label: '가격 설정', action: 'price' },
        { icon: '📸', label: '이미지 업로드', action: 'image' },
        { icon: '📋', label: '재고 관리', action: 'stock' },
        { icon: '🚀', label: '상품 등록', action: 'submit' }
    ];

    // 상품 종류 옵션 정의
    const meatOptions = {
        '소': ['등심', '안심', '갈비', '기타'],
        '돼지': ['삼겹살', '목살', '갈비', '기타'],
        '닭': ['가슴살', '다리살', '기타']
    };

         // 고기 종류가 변경될 때 부위와 등급 초기화
     const handleMeatKindChange = (e) => {
         const selectedKind = e.target.value;
         setFormData(prev => ({
             ...prev,
             meatKind: selectedKind,
             meatPart: '', // 부위 초기화
             grade: ''     // 등급 초기화 (고기 종류별로 다른 등급 체계)
         }));
     };

    // 부위가 변경될 때 cutName 자동 설정
    const handleMeatPartChange = (e) => {
        const selectedPart = e.target.value;
        const meatKind = formData.meatKind;
        
        // cutName 자동 매핑
        let cutName = 'etc';
        if (meatKind === '소') {
            switch(selectedPart) {
                case '등심': cutName = 'sirloin'; break;
                case '안심': cutName = 'tenderloin'; break;
                case '갈비': cutName = 'rib'; break;
                default: cutName = 'etc';
            }
        } else if (meatKind === '돼지') {
            switch(selectedPart) {
                case '삼겹살': cutName = 'belly'; break;
                case '목살': cutName = 'neck'; break;
                case '갈비': cutName = 'rib'; break;
                default: cutName = 'etc';
            }
        } else if (meatKind === '닭') {
            switch(selectedPart) {
                case '가슴살': cutName = 'breast'; break;
                case '다리살': cutName = 'leg'; break;
                default: cutName = 'etc';
            }
        }

        setFormData(prev => ({
            ...prev,
            meatPart: selectedPart
        }));
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

    // 상품 목록 가져오기
    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:8080/mypage/api/mypage/seller/${userId}/products`);
            if (response.ok) {
                const data = await response.json();
                setProducts(data);
            } else {
                console.error('상품 목록 조회 실패');
            }
        } catch (error) {
            console.error('상품 목록 조회 오류:', error);
        } finally {
            setLoading(false);
        }
    };

    // 상품 상세 보기 함수
    const viewProductDetail = (product) => {
        setViewingProduct(product);
        setActiveTab('detail');
    };

    // 상품 업데이트 함수
    const handleUpdateProduct = async (product) => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:8080/mypage/api/products/${product.saleItemId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: product.title,
                    judgeKindName: product.judgeKindName,
                    cutName: product.cutName,
                    qty: product.qty,
                    weight: product.weight,
                    price: product.price,
                    description: product.description,
                    detailDescription: product.detailDescription,
                    grade: product.grade,
                    traceabilityNum: product.traceabilityNum,
                    saleStatus: product.saleStatus
                })
            });

            if (response.ok) {
                setMessage('상품 정보가 성공적으로 업데이트되었습니다.');
                // 상품 목록 새로고침
                await fetchProducts();
                setActiveTab('manage');
            } else {
                setMessage('상품 정보 업데이트에 실패했습니다.');
            }
        } catch (error) {
            console.error('상품 업데이트 오류:', error);
            setMessage('상품 정보 업데이트 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 상품 등록
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setMessage('');

            // 폼 데이터 검증
            if (!formData.title || !formData.meatKind || !formData.meatPart || !formData.qty || !formData.weight || !formData.price || !formData.grade) {
                setMessage('필수 항목을 모두 입력해주세요.');
                setLoading(false);
                return;
            }

            // 가격 검증
            if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
                setMessage('가격은 0보다 큰 숫자로 입력해주세요.');
                setLoading(false);
                return;
            }

            // 무게 형식 검증 (숫자 + 단위)
            const weightPattern = /^\d+(\.\d+)?(kg|g|lb)$/i;
            if (!weightPattern.test(formData.weight)) {
                setMessage('무게는 "1kg", "500g", "2lb" 형식으로 입력해주세요.');
                setLoading(false);
                return;
            }

            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            // judgeKindName과 cutName 자동 생성
            const judgeKindName = getJudgeKindName();
            const cutName = getCutName();
            formDataToSend.append('judgeKindName', judgeKindName);
            formDataToSend.append('cutName', cutName);
            formDataToSend.append('qty', formData.qty);
            formDataToSend.append('weight', formData.weight);
            formDataToSend.append('price', formData.price);
            formDataToSend.append('saleStatus', formData.saleStatus);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('detailDescription', formData.detailDescription);
            formDataToSend.append('grade', formData.grade);
            formDataToSend.append('traceabilityNum', formData.traceabilityNum);
            formDataToSend.append('sellerId', userId);
            
            if (formData.imageFiles && formData.imageFiles.length > 0) {
                formData.imageFiles.forEach((file, index) => {
                    formDataToSend.append(`imageFiles`, file);
                });
            }

            // 디버깅을 위한 로그
            console.log('상품 등록 요청 데이터:', {
                title: formData.title,
                judgeKindName,
                cutName,
                qty: formData.qty,
                weight: formData.weight,
                saleStatus: formData.saleStatus,
                description: formData.description,
                detailDescription: formData.detailDescription,
                grade: formData.grade,
                traceabilityNum: formData.traceabilityNum,
                sellerId: userId
            });
            
            // FormData 내용 확인
            console.log('FormData 내용:');
            for (let [key, value] of formDataToSend.entries()) {
                console.log(`${key}: ${value}`);
            }

            const response = await fetch('http://localhost:8080/mypage/api/products', {
                method: 'POST',
                body: formDataToSend
            });

            if (response.ok) {
                setMessage('상품이 성공적으로 등록되었습니다! 🎉');
                setFormData({
                    title: '',
                    meatKind: '',
                    meatPart: '',
                    qty: '',
                    weight: '',
                    saleStatus: 'draft',
                    imageFiles: [],
                    description: '',
                    detailDescription: '',
                    grade: '',
                    traceabilityNum: ''
                });
                fetchProducts(); // 상품 목록 새로고침
            } else {
                const errorText = await response.text();
                console.error('상품 등록 응답 오류:', response.status, errorText);
                setMessage(`상품 등록에 실패했습니다. (${response.status})`);
            }
        } catch (error) {
            console.error('상품 등록 오류:', error);
            setMessage('상품 등록 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 상품 수정
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setMessage('');

            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            // judgeKindName과 cutName 자동 생성
            const judgeKindName = getJudgeKindName();
            const cutName = getCutName();
            formDataToSend.append('judgeKindName', judgeKindName);
            formDataToSend.append('cutName', cutName);
            formDataToSend.append('qty', formData.qty);
            formDataToSend.append('weight', formData.weight);
            formDataToSend.append('price', formData.price);
            formDataToSend.append('saleStatus', formData.saleStatus);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('detailDescription', formData.detailDescription);
            formDataToSend.append('grade', formData.grade);
            formDataToSend.append('traceabilityNum', formData.traceabilityNum);
            
            if (formData.imageFiles && formData.imageFiles.length > 0) {
                formData.imageFiles.forEach((file, index) => {
                    formDataToSend.append(`imageFiles`, file);
                });
            }

                         const response = await fetch(`http://localhost:8080/mypage/api/products/${editingProduct.saleItemId}/form`, {
                method: 'PUT',
                body: formDataToSend
            });

            if (response.ok) {
                setMessage('상품이 성공적으로 수정되었습니다! ✨');
                setEditingProduct(null);
                setFormData({
                    title: '',
                    meatKind: '',
                    meatPart: '',
                    qty: '',
                    weight: '',
                    saleStatus: 'draft',
                    imageFiles: [],
                    description: '',
                    detailDescription: '',
                    grade: '',
                    traceabilityNum: ''
                });
                fetchProducts();
            } else {
                setMessage('상품 수정에 실패했습니다. 다시 시도해주세요.');
            }
        } catch (error) {
            console.error('상품 수정 오류:', error);
            setMessage('상품 수정 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 상품 삭제
    const handleDelete = async (productId) => {
        if (!window.confirm('정말로 이 상품을 삭제하시겠습니까?')) {
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`http://localhost:8080/mypage/api/products/${productId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setMessage('상품이 성공적으로 삭제되었습니다.');
                fetchProducts();
            } else {
                setMessage('상품 삭제에 실패했습니다.');
            }
        } catch (error) {
            console.error('상품 삭제 오류:', error);
            setMessage('상품 삭제 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 수정 모드 시작
    const startEdit = (product) => {
        setEditingProduct(product);
        // judgeKindName에서 고기 종류와 부위 분리
        let meatKind = '';
        let meatPart = '';
        if (product.judgeKindName) {
            const parts = product.judgeKindName.split(' ');
            if (parts.length >= 2) {
                meatKind = parts[0];
                meatPart = parts.slice(1).join(' ');
            }
        }

        // saleStatus 매핑 (기존 값과 새로운 값 호환)
        let saleStatus = product.saleStatus || 'draft';
        if (saleStatus === 'ACTIVE') saleStatus = 'on';
        if (saleStatus === 'WAITING') saleStatus = 'draft';
        
        setFormData({
            title: product.title || '',
            meatKind: meatKind,
            meatPart: meatPart,
            qty: product.qty ? String(product.qty) : '',
            weight: product.weight || '',
            price: product.price ? String(product.price) : '',
            saleStatus: saleStatus,
            imageFiles: [],
            description: product.description || '',
            detailDescription: product.detailDescription || '',
            grade: product.grade || '',
            traceabilityNum: product.traceabilityNum || ''
        });
    };

    // 수정 모드 취소
    const cancelEdit = () => {
        setEditingProduct(null);
        setFormData({
            title: '',
            meatKind: '',
            meatPart: '',
            qty: '',
            weight: '',
            saleStatus: 'draft',
            imageFiles: [],
            description: '',
            detailDescription: '',
            grade: '',
            traceabilityNum: ''
        });
    };

    // 입력 필드 변경 처리
    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'imageFiles') {
            // 여러 파일 선택 가능
            const selectedFiles = Array.from(files);
            setFormData(prev => ({
                ...prev,
                [name]: selectedFiles
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    // 컴포넌트 마운트 시 상품 목록 가져오기
    useEffect(() => {
        if (activeTab === 'manage') {
            fetchProducts();
        }
    }, [activeTab, userId]);

    return (
        <div className="product-register-container">
            {/* 헤더 */}
            <div className="header">
                <h1>📦 상품 등록</h1>
                <p>신선한 상품을 등록하고 관리하세요</p>
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
                    <button key={index} className="quick-action-card" onClick={() => console.log(action.action)}>
                        <div className="action-icon">{action.icon}</div>
                        <div className="action-label">{action.label}</div>
                    </button>
                ))}
            </div>

            {/* 메시지 표시 */}
            {message && (
                <div className={`message ${message.includes('성공') ? 'success' : 'error'}`}>
                    {message}
                </div>
            )}

            {/* 메인 콘텐츠 */}
            <div className="main-content">
                {/* 폼 섹션 */}
                <div className="form-section">
                    <h3>📦 상품 정보</h3>
                    
                    <form onSubmit={editingProduct ? handleUpdate : handleSubmit}>
                        <div className="form-group">
                            <label>상품명 *</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="예: 한우 등심, 돼지고기 삼겹살"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>고기 종류 *</label>
                            <select
                                name="meatKind"
                                value={formData.meatKind}
                                onChange={handleMeatKindChange}
                                required
                            >
                                <option value="">고기 종류를 선택하세요</option>
                                <option value="소">소</option>
                                <option value="돼지">돼지</option>
                                <option value="닭">닭</option>
                            </select>
                        </div>

                        {formData.meatKind && (
                            <div className="form-group">
                                <label>부위 *</label>
                                <select
                                    name="meatPart"
                                    value={formData.meatPart}
                                    onChange={handleMeatPartChange}
                                    required
                                >
                                    <option value="">부위를 선택하세요</option>
                                    {meatOptions[formData.meatKind]?.map(part => (
                                        <option key={part} value={part}>{part}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div className="form-group">
                            <label>판매 상태</label>
                            <select
                                name="saleStatus"
                                value={formData.saleStatus}
                                onChange={handleInputChange}
                            >
                                <option value="draft">보류중</option>
                                <option value="on">판매중</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>재고 수량 (개수) *</label>
                            <input
                                type="number"
                                name="qty"
                                value={formData.qty}
                                onChange={handleInputChange}
                                placeholder="재고 수량을 개수 단위로 입력하세요"
                                min="0"
                                step="1"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>kg당 가격 (원) *</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                placeholder="kg당 가격을 입력하세요"
                                min="0"
                                step="100"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>1개당 무게 *</label>
                            <input
                                type="text"
                                name="weight"
                                value={formData.weight}
                                onChange={handleInputChange}
                                placeholder="1개당 무게를 입력하세요 (예: 1kg, 500g, 2lb)"
                                required
                            />
                            <small className="input-help">무게와 단위를 함께 입력하세요 (예: 1kg, 500g, 2lb)</small>
                        </div>

                                                 <div className="form-group">
                             <label>고기 등급 *</label>
                             <select
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
                            <label>가축 이력번호</label>
                            <input
                                type="text"
                                name="traceabilityNum"
                                value={formData.traceabilityNum}
                                onChange={handleInputChange}
                                placeholder="가축 이력번호를 입력하세요 (선택사항)"
                            />
                            <small className="input-help">가축의 출생부터 도축까지의 이력을 추적할 수 있는 번호</small>
                        </div>



                        <div className="form-group">
                            <label>상품 이미지 (여러 장 선택 가능)</label>
                            <input
                                type="file"
                                name="imageFiles"
                                onChange={handleInputChange}
                                accept="image/*"
                                multiple
                                className="file-input"
                            />
                            <small className="file-help">JPG, PNG, GIF 파일을 선택하세요 (최대 20MB, 여러 장 선택 가능)</small>
                            {formData.imageFiles && formData.imageFiles.length > 0 && (
                                <div className="selected-files">
                                    <p>선택된 파일: {formData.imageFiles.length}개</p>
                                    <ul>
                                        {formData.imageFiles.map((file, index) => (
                                            <li key={index}>
                                                {file.name} ({(file.size / 1024 / 1024).toFixed(2)}MB)
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label>요약 설명</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="상품의 핵심 특징을 간단히 설명하세요 (예: 한우 등심, A등급, 신선도 보장)"
                                rows="3"
                            />
                        </div>

                        <div className="form-group">
                            <label>상세 설명</label>
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
                                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                                    ],
                                    toolbar: 'undo redo | blocks | ' +
                                        'bold italic forecolor | alignleft aligncenter ' +
                                        'alignright alignjustify | bullist numlist outdent indent | ' +
                                        'removeformat | help',
                                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                                }}
                            />
                        </div>

                        <div className="form-actions">
                            {editingProduct ? (
                                <>
                                    <button type="submit" className="submit-btn" disabled={loading}>
                                        {loading ? '수정 중...' : '📦 상품 수정하기'}
                                    </button>
                                    <button type="button" className="cancel-btn" onClick={cancelEdit}>
                                        취소
                                    </button>
                                </>
                            ) : (
                                <button type="submit" className="submit-btn" disabled={loading}>
                                    {loading ? '등록 중...' : '📦 상품 등록하기'}
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* 가이드 섹션 */}
                <div className="guide-section">
                    <h3>📦 상품 등록 팁</h3>
                    
                    <div className="guide-cards">
                        <div className="guide-card">
                            <div className="guide-icon">📸</div>
                            <h4>이미지 품질</h4>
                            <p>선명하고 깔끔한 상품 이미지를 업로드하세요.</p>
                        </div>
                        
                        <div className="guide-card">
                            <div className="guide-icon">💰</div>
                            <h4>가격 설정</h4>
                            <p>시장 가격을 참고하여 적절한 가격을 설정하세요.</p>
                        </div>
                        
                        <div className="guide-card">
                            <div className="guide-icon">📝</div>
                            <h4>상세 정보</h4>
                            <p>등급, 보관 방법, 조리법 등 상세한 정보를 작성하세요.</p>
                        </div>
                    </div>

                    {/* 상품 통계 */}
                    <div className="stats-summary">
                        <h4>📦 상품 판매 현황</h4>
                                                 <div className="stats-grid">
                             <div className="stat-item">
                                 <div className="stat-number">{products.length}</div>
                                 <div className="stat-label">등록된 상품</div>
                             </div>
                             <div className="stat-item">
                                 <div className="stat-number">{products.filter(p => p.saleStatus === 'on').length}</div>
                                 <div className="stat-label">판매중</div>
                             </div>
                             <div className="stat-item">
                                 <div className="stat-number">{products.filter(p => p.saleStatus === 'draft').length}</div>
                                 <div className="stat-label">보류중</div>
                             </div>
                         </div>
                    </div>
                </div>
            </div>

            {/* 상품 관리 탭 */}
            {activeTab === 'manage' && (
                <div className="products-section">
                    <div className="section-header">
                        <h3>📋 등록된 상품</h3>
                        <button className="refresh-btn" onClick={fetchProducts} disabled={loading}>
                            🔄 새로고침
                        </button>
                    </div>
                    
                    {loading ? (
                        <div className="loading">로딩 중...</div>
                    ) : products.length === 0 ? (
                        <div className="no-products">등록된 상품이 없습니다.</div>
                    ) : (
                        <div className="products-grid">
                            {products.map((product, index) => (
                                <div key={index} className="product-card" onClick={() => viewProductDetail(product)}>
                                    {/* 상품 이미지 영역 */}
                                    <div className="product-image-section">
                                        {product.imageUrl ? (
                                            <img src={product.imageUrl} alt={product.title} className="product-image" />
                                        ) : (
                                            <div className="placeholder-image">
                                                <span className="no-image-text">이미지 없음</span>
                                            </div>
                                        )}
                                        
                                        {/* 상태 배지 - 이미지가 있을 때만 표시 */}
                                        {product.imageUrl && (
                                            <div className="status-badge-overlay">
                                                <span className={`status-badge ${product.saleStatus?.toLowerCase()}`}>
                                                    {product.saleStatus === 'on' ? '판매중' : 
                                                     product.saleStatus === 'draft' ? '보류중' : 
                                                     product.saleStatus === 'off' ? '품절' : '미정'}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* 바로구매 버튼 */}
                                    <div className="buy-button-section">
                                        <button 
                                            className="buy-now-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                // 바로구매 로직 (추후 구현)
                                                alert('바로구매 기능은 추후 구현 예정입니다.');
                                            }}
                                        >
                                            🛒 바로구매
                                        </button>
                                    </div>
                                    
                                    {/* 상품 정보 영역 */}
                                    <div className="product-info-section">
                                        {/* 판매자명과 상태 배지 */}
                                        <div className="seller-status-row">
                                            <div className="seller-name">{product.sellerName || '판매자'}</div>
                                            <div className="status-badge-inline">
                                                <span className={`status-badge ${product.saleStatus?.toLowerCase()}`}>
                                                    {product.saleStatus === 'on' ? '판매중' : 
                                                     product.saleStatus === 'draft' ? '보류중' : 
                                                     product.saleStatus === 'off' ? '품절' : '미정'}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        {/* 카테고리 태그 */}
                                        <div className="category-tags">
                                            <span className="tag">{product.judgeKindName}</span>
                                            <span className="tag">{product.cutName}</span>
                                            {product.weight && <span className="tag">{product.weight}</span>}
                                        </div>
                                        
                                        {/* 상품 제목 */}
                                        <div className="product-title">{product.title}</div>
                                        
                                        {/* 가격 정보 */}
                                        <div className="price-section">
                                            <span className="price">
                                                {product.price ? product.price.toLocaleString() : '가격 미정'}
                                            </span>
                                            <span className="price-unit">(kg당)</span>
                                        </div>
                                        
                                        {/* 배송 정보 */}
                                        <div className="delivery-info">
                                            <span className="delivery-badge">신선배송</span>
                                        </div>
                                        
                                        {/* 재고 및 등급 정보 */}
                                        <div className="stock-grade-info">
                                            <div className="stock-info">
                                                <span className="stock-label">재고</span>
                                                <span className="stock-count">{product.qty}개</span>
                                            </div>
                                            {product.grade && (
                                                <div className="grade-info">
                                                    <span className="grade-label">등급</span>
                                                    <span className="grade-badge">{product.grade}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* 관리 버튼들 */}
                                    <div className="admin-actions">
                                        <button 
                                            className="edit-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                startEdit(product);
                                            }}
                                        >
                                            ✏️ 수정
                                        </button>
                                        <button 
                                            className="delete-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(product.saleItemId);
                                            }}
                                        >
                                            🗑️ 삭제
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* 상품 상세 탭 */}
            {activeTab === 'detail' && viewingProduct && (
                <div className="product-detail-section">
                    <div className="detail-header">
                        <button 
                            className="back-btn"
                            onClick={() => setActiveTab('manage')}
                        >
                            ← 목록으로 돌아가기
                        </button>
                        <h3>🔍 상품 상세 정보</h3>
                    </div>
                    
                    <div className="detail-content">
                        <div className="detail-main">
                            <div className="detail-image-section">
                                <div className="main-image">
                                    {viewingProduct.imageUrl ? (
                                        <img src={viewingProduct.imageUrl} alt={viewingProduct.title} />
                                    ) : (
                                        <div className="no-image">
                                            <span>📦</span>
                                            <p>이미지 없음</p>
                                        </div>
                                    )}
                                </div>
                                <div className="image-actions">
                                    <button className="btn-primary">
                                        📸 이미지 변경
                                    </button>
                                </div>
                            </div>
                            
                            <div className="detail-info-section">
                                <div className="info-group">
                                    <h4>기본 정보</h4>
                                    <div className="info-grid">
                                        <div className="info-item">
                                            <label>상품명</label>
                                            <input 
                                                type="text" 
                                                value={viewingProduct.title || ''} 
                                                onChange={(e) => setViewingProduct({
                                                    ...viewingProduct, 
                                                    title: e.target.value
                                                })}
                                            />
                                        </div>
                                        <div className="info-item">
                                            <label>종류</label>
                                            <input 
                                                type="text" 
                                                value={viewingProduct.judgeKindName || ''} 
                                                onChange={(e) => setViewingProduct({
                                                    ...viewingProduct, 
                                                    judgeKindName: e.target.value
                                                })}
                                            />
                                        </div>
                                        <div className="info-item">
                                            <label>부위</label>
                                            <input 
                                                type="text" 
                                                value={viewingProduct.cutName || ''} 
                                                onChange={(e) => setViewingProduct({
                                                    ...viewingProduct, 
                                                    cutName: e.target.value
                                                })}
                                            />
                                        </div>
                                        <div className="info-item">
                                            <label>재고 (개)</label>
                                            <input 
                                                type="number" 
                                                value={viewingProduct.qty || ''} 
                                                onChange={(e) => setViewingProduct({
                                                    ...viewingProduct, 
                                                    qty: parseInt(e.target.value) || 0
                                                })}
                                            />
                                        </div>
                                        <div className="info-item">
                                            <label>무게</label>
                                            <input 
                                                type="text" 
                                                value={viewingProduct.weight || ''} 
                                                onChange={(e) => setViewingProduct({
                                                    ...viewingProduct, 
                                                    weight: e.target.value
                                                })}
                                            />
                                        </div>
                                        <div className="info-item">
                                            <label>가격 (원/kg)</label>
                                            <input 
                                                type="number" 
                                                value={viewingProduct.price || ''} 
                                                onChange={(e) => setViewingProduct({
                                                    ...viewingProduct, 
                                                    price: parseInt(e.target.value) || 0
                                                })}
                                            />
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="info-group">
                                    <h4>상세 정보</h4>
                                    <div className="info-grid">
                                        <div className="info-item full-width">
                                            <label>요약 설명</label>
                                            <textarea 
                                                value={viewingProduct.description || ''} 
                                                onChange={(e) => setViewingProduct({
                                                    ...viewingProduct, 
                                                    description: e.target.value
                                                })}
                                                rows="3"
                                            />
                                        </div>
                                        <div className="info-item full-width">
                                            <label>상세 설명</label>
                                            <textarea 
                                                value={viewingProduct.detailDescription || ''} 
                                                onChange={(e) => setViewingProduct({
                                                    ...viewingProduct, 
                                                    detailDescription: e.target.value
                                                })}
                                                rows="5"
                                            />
                                        </div>
                                        <div className="info-item">
                                            <label>등급</label>
                                            <input 
                                                type="text" 
                                                value={viewingProduct.grade || ''} 
                                                onChange={(e) => setViewingProduct({
                                                    ...viewingProduct, 
                                                    grade: e.target.value
                                                })}
                                            />
                                        </div>
                                        <div className="info-item">
                                            <label>이력번호</label>
                                            <input 
                                                type="text" 
                                                value={viewingProduct.traceabilityNum || ''} 
                                                onChange={(e) => setViewingProduct({
                                                    ...viewingProduct, 
                                                    traceabilityNum: e.target.value
                                                })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="detail-actions">
                            <button 
                                className="btn-save"
                                onClick={() => handleUpdateProduct(viewingProduct)}
                            >
                                💾 변경사항 저장
                            </button>
                            <button 
                                className="btn-cancel"
                                onClick={() => setActiveTab('manage')}
                            >
                                ❌ 취소
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 판매 분석 탭 */}
            {activeTab === 'analytics' && (
                <div className="analytics-section">
                    <h3>📊 판매 분석</h3>
                    <div className="analytics-content">
                        <p>판매 분석 기능은 준비 중입니다. 곧 업데이트될 예정입니다.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductRegister;
