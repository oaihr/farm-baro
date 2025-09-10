-- 테스트용 사용자 데이터 추가

-- 구매자 데이터
INSERT INTO users (user_id, user_type, username, email, password, phone, address, profile_image, created_at, updated_at)
VALUES ('buyer001', 'BUYER', '구매자1', 'buyer1@example.com', 'password123', '010-1234-5678', '서울시 강남구', NULL, SYSDATE, SYSDATE);

INSERT INTO users (user_id, user_type, username, email, password, phone, address, profile_image, created_at, updated_at)
VALUES ('buyer002', 'BUYER', '구매자2', 'buyer2@example.com', 'password123', '010-2345-6789', '서울시 서초구', NULL, SYSDATE, SYSDATE);

-- 판매자 데이터
INSERT INTO users (user_id, user_type, username, email, password, phone, address, profile_image, created_at, updated_at)
VALUES ('seller001', 'SELLER', '판매자1', 'seller1@example.com', 'password123', '010-3456-7890', '경기도 성남시', NULL, SYSDATE, SYSDATE);

INSERT INTO users (user_id, user_type, username, email, password, phone, address, profile_image, created_at, updated_at)
VALUES ('seller002', 'SELLER', '판매자2', 'seller2@example.com', 'password123', '010-4567-8901', '경기도 수원시', NULL, SYSDATE, SYSDATE);

-- 테스트용 상품 데이터
INSERT INTO products (product_id, seller_id, product_name, product_type, price, initial_bid_price, quantity, description, auction_end_time, status, created_at)
VALUES (1, 'seller001', '소고기 등심 1++등급', 'NORMAL', 25000, NULL, 100, '신선한 소고기 등심입니다', NULL, 'ACTIVE', SYSDATE);

INSERT INTO products (product_id, seller_id, product_name, product_type, price, initial_bid_price, quantity, description, auction_end_time, status, created_at)
VALUES (2, 'seller001', '돼지고기 삼겹살 1+등급', 'AUCTION', NULL, 15000, 50, '프리미엄 돼지고기 삼겹살입니다', SYSDATE + 7, 'ACTIVE', SYSDATE);

-- 테스트용 주문 데이터
INSERT INTO orders (order_id, buyer_id, product_id, quantity, total_price, order_status, shipping_address, shipping_phone, shipping_name, order_date)
VALUES (1, 'buyer001', 1, 5, 25000, 'ORDERED', '서울시 강남구', '010-1234-5678', '구매자1', SYSDATE);

-- 테스트용 장바구니 데이터
INSERT INTO cart (cart_id, buyer_id, product_id, quantity, added_at)
VALUES (1, 'buyer001', 1, 3, SYSDATE);

-- 커밋
COMMIT;
