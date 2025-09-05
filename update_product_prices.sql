-- 기존 상품들에 가격 정보 추가/업데이트

-- 소고기 등심 상품 가격 업데이트
UPDATE sales 
SET PRICE = 25000, 
    JUDGE_KIND_NAME = '소', 
    CUT_NAME = '등심', 
    TITLE = '소고기 등심',
    WEIGHT = '1kg',
    GRADE = '1++',
    TRACEABILITY_NUM = 'KR123456789',
    SALE_STATUS = 'on'
WHERE TITLE LIKE '%사과%' OR TITLE LIKE '%소고기%' OR JUDGE_KIND_NAME = '쌀';

-- 돼지고기 삼겹살 상품 추가 (기존 데이터가 없는 경우)
INSERT INTO sales (SALE_ITEM_ID, QTY, SALE_STATUS, JUDGE_KIND_NAME, CUT_NAME, TITLE, DESCRIPTION, WEIGHT, PRICE, GRADE, TRACEABILITY_NUM, SELLER_ID, CREATED_TIME)
SELECT sale_item_seq.NEXTVAL, 50, 'on', '돼지', '삼겹살', '돼지고기 삼겹살', '프리미엄 돼지고기 삼겹살입니다', '500g', 15000, '1+', 'KR987654321', 'seller001', SYSTIMESTAMP
FROM dual
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE TITLE = '돼지고기 삼겹살');

-- 닭고기 가슴살 상품 추가
INSERT INTO sales (SALE_ITEM_ID, QTY, SALE_STATUS, JUDGE_KIND_NAME, CUT_NAME, TITLE, DESCRIPTION, WEIGHT, PRICE, GRADE, TRACEABILITY_NUM, SELLER_ID, CREATED_TIME)
SELECT sale_item_seq.NEXTVAL, 30, 'on', '닭', '가슴살', '닭고기 가슴살', '신선한 닭고기 가슴살입니다', '1kg', 12000, '1', 'KR555666777', 'seller001', SYSTIMESTAMP
FROM dual
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE TITLE = '닭고기 가슴살');

-- 모든 상품에 기본 가격 설정 (가격이 NULL인 경우)
UPDATE sales 
SET PRICE = CASE 
    WHEN JUDGE_KIND_NAME = '소' THEN 25000
    WHEN JUDGE_KIND_NAME = '돼지' THEN 15000
    WHEN JUDGE_KIND_NAME = '닭' THEN 12000
    ELSE 10000
END
WHERE PRICE IS NULL;

-- 상품 상태를 'on'으로 설정 (판매중)
UPDATE sales 
SET SALE_STATUS = 'on'
WHERE SALE_STATUS IS NULL OR SALE_STATUS = 'ACTIVE';

COMMIT;
