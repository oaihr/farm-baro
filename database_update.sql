-- ✅ sales 테이블에 상세 설명 컬럼 추가 완료
-- ALTER TABLE sales ADD COLUMN DETAIL_DESCRIPTION VARCHAR2(4000);

-- ✅ sales 테이블에 무게 관련 컬럼 추가
-- ALTER TABLE sales ADD COLUMN WEIGHT NUMBER(8,2); -- 무게 (kg 단위, 소수점 2자리)
-- ALTER TABLE sales ADD COLUMN WEIGHT_UNIT VARCHAR2(10); -- 무게 단위 (kg, g, lb 등)

-- 기존 description 컬럼의 의미를 명확히 하기 위한 주석 추가
COMMENT ON COLUMN sales.DESCRIPTION IS '상품 요약 설명';
COMMENT ON COLUMN sales.DETAIL_DESCRIPTION IS '상품 상세 설명 (HTML 형식)';
COMMENT ON COLUMN sales.QTY IS '재고 수량 (개수 단위)';
COMMENT ON COLUMN sales.WEIGHT IS '상품 무게 (kg 단위)';
COMMENT ON COLUMN sales.WEIGHT_UNIT IS '무게 단위 (kg, g, lb 등)';

-- 기존 데이터가 있다면 detail_description을 빈 값으로 설정 (필요시 실행)
-- UPDATE sales SET DETAIL_DESCRIPTION = '' WHERE DETAIL_DESCRIPTION IS NULL;
