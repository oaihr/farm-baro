-- users 테이블에 테스트용 사용자 추가
-- buyer001 (구매자)와 seller001 (판매자) 사용자 생성

-- 구매자 사용자 추가
INSERT INTO users (ID, USERNAME, PASSWORD, EMAIL, TEL, ADDRESS, USER_TYPE, CREATED_TIME, UPDATED_TIME)
VALUES ('buyer001', '구매자1', 'password123', 'buyer001@test.com', '010-1234-5678', '서울시 강남구 테스트동 123-45', 'BUYER', SYSTIMESTAMP, SYSTIMESTAMP);

-- 판매자 사용자 추가
INSERT INTO users (ID, USERNAME, PASSWORD, EMAIL, TEL, ADDRESS, USER_TYPE, CREATED_TIME, UPDATED_TIME)
VALUES ('seller001', '판매자1', 'password123', 'seller001@test.com', '010-9876-5432', '경기도 성남시 테스트구 456-78', 'SELLER', SYSTIMESTAMP, SYSTIMESTAMP);

-- 추가 테스트 사용자들
INSERT INTO users (ID, USERNAME, PASSWORD, EMAIL, TEL, ADDRESS, USER_TYPE, CREATED_TIME, UPDATED_TIME)
VALUES ('buyer002', '구매자2', 'password123', 'buyer002@test.com', '010-1111-2222', '부산시 해운대구 테스트동 789-12', 'BUYER', SYSTIMESTAMP, SYSTIMESTAMP);

INSERT INTO users (ID, USERNAME, PASSWORD, EMAIL, TEL, ADDRESS, USER_TYPE, CREATED_TIME, UPDATED_TIME)
VALUES ('seller002', '판매자2', 'password123', 'seller002@test.com', '010-3333-4444', '대구시 수성구 테스트구 321-54', 'SELLER', SYSTIMESTAMP, SYSTIMESTAMP);

COMMIT;

-- 추가된 사용자 확인
SELECT ID, USERNAME, USER_TYPE, EMAIL, TEL, ADDRESS FROM users WHERE ID IN ('buyer001', 'seller001', 'buyer002', 'seller002');
