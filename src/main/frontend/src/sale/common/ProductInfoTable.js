import React from 'react';
import './ProductInfoTable.css'; // CSS 파일을 불러옵니다.
import { Link } from 'react-router-dom';

function ProductInfoTable({ title }) {
    return (
        <div>
        <div className='product-info-container'>
            <div className='product-info-header'>
                <h3>상품정보제공고시</h3>
                {/* <span>&#9660;</span> */}
            </div>
            <div className='info-table-wrapper'>
                <table className='info-table'>
                    <tbody>
                        <tr>
                            <td className='info-label'>품목 또는 명칭</td>
                            <td className='info-content'>{title}</td>
                        </tr>
                        <tr>
                            <td className='info-label'>포장단위별 내용물의 용량(중량), 수량, 크기</td>
                            <td className='info-content'>
                                <p>포장단위별 내용물의 용량(중량): 상세페이지 참조</p>
                                <p>포장단위별 수량: 상세페이지 참조</p>
                                <p>포장단위별 크기: 상세페이지 참조</p>
                                <br/>
                                <p>상세페이지는 대표상품으로 작성되었으며, 원물 특성상 규격 및 중량 등 차이가 있을 수 있습니다.</p>
                                <p>상품정보 관련 기타 자세한 사항은 판매자에게 문의 바랍니다.</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='info-label'>생산자 및 수입자</td>
                            <td className='info-content'>상품 페이지 상단 [축산물 이력정보] 참조</td>
                        </tr>
                        <tr>
                            <td className='info-label'>원산지</td>
                            <td className='info-content'>국내산</td>
                        </tr>
                        <tr>
                            <td className='info-label'>제조연월일, 소비기한 또는 품질유지기한</td>
                            <td className='info-content'>제조일로부터 60일</td>
                        </tr>
                        <tr>
                            <td className='info-label'>세부 품목군별 표시사항</td>
                            <td className='info-content'>「축산법」에 따른 등급 표시: 상품 상세페이지 상단 등급표기 참고. 「가축 및 축산물 이력 관리에 관한 법률」에 따른 이력 관리대상축산물 유무: 이력번호표시(이력번호는 배송된 상품에 표시)</td>
                        </tr>
                        <tr>
                            <td className='info-label'>상품구성</td>
                            <td className='info-content'>상세페이지 참조</td>
                        </tr>
                        <tr>
                            <td className='info-label'>보관방법 또는 취급방법</td>
                            <td className='info-content'>-2~10℃ 이하 냉장보관</td>
                        </tr>
                         <tr>
                            <td className='info-label'>소비자 안전을 위한 주의사항</td>
                            <td className='info-content'>
                                <p>※ 본 제품은 공정거래위원회에 고시된 소비자 분쟁해결기준에 의거하여 교환 또는 보상 받으실 수 있습니다.</p>
                                <p>※ 흡습제 제거 후 드시기 바랍니다.</p>
                                <p>※ 부정, 불량 식품 신고는 국번 없이 1399</p>
                                <p>※ 이 제품은 돼지고기를 사용한 제품과 같은 시설에서 제조하고 있습니다.</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='info-label'>소비자 상담 관련 전화번호</td>
                            <td className='info-content'>목장바로 고객센터 1588-8949</td>
                        </tr>
                    </tbody>
                </table>
            </div>            
        </div>
            <div className="refund-container">
                    <div className="refund-header">
                        <h3>취소/반품/교환</h3>
                    </div>
                    <div className="refund-content">
                        <div className="refund-text">
                            <h4>
                                취소/반품/교환 절차가 궁금하시다면 목장바로에서 도와드리겠습니다.
                            </h4>
                            <p>
                                목장바로는 전자상거래 등에서의 소비자보호에 관한 법률에 의한 취소/반품/교환 규정을 준수합니다.
                            </p>
                    </div>
                    <Link to='/'>
                        <button className="customer-center-btn">
                            고객센터
                            <span className="arrow-icon">&gt;</span>
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ProductInfoTable;