-- 기존 데이터베이스에 누락된 테이블들 생성

-- 상품 테이블
CREATE TABLE products (
    product_id NUMBER PRIMARY KEY,
    seller_id VARCHAR2(100) NOT NULL,
    product_name VARCHAR2(200) NOT NULL,
    product_type VARCHAR2(20) NOT NULL CHECK (product_type IN ('NORMAL', 'AUCTION')),
    price NUMBER,
    initial_bid_price NUMBER,
    quantity NUMBER DEFAULT 0,
    description CLOB,
    auction_end_time TIMESTAMP,
    status VARCHAR2(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT SYSTIMESTAMP
);

-- 상품 이미지 테이블
CREATE TABLE product_images (
    image_id NUMBER PRIMARY KEY,
    product_id NUMBER NOT NULL,
    image_url VARCHAR2(500) NOT NULL,
    image_order NUMBER DEFAULT 0,
    created_at TIMESTAMP DEFAULT SYSTIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- 주문 테이블
CREATE TABLE orders (
    order_id NUMBER PRIMARY KEY,
    buyer_id VARCHAR2(100) NOT NULL,
    product_id NUMBER NOT NULL,
    quantity NUMBER NOT NULL,
    total_price NUMBER NOT NULL,
    order_status VARCHAR2(20) DEFAULT 'ORDERED',
    shipping_address VARCHAR2(500),
    shipping_phone VARCHAR2(20),
    shipping_name VARCHAR2(100),
    order_date TIMESTAMP DEFAULT SYSTIMESTAMP,
    payment_date TIMESTAMP,
    delivery_date TIMESTAMP,
    FOREIGN KEY (buyer_id) REFERENCES users(ID),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- 장바구니 테이블
CREATE TABLE cart (
    cart_id NUMBER PRIMARY KEY,
    buyer_id VARCHAR2(100) NOT NULL,
    product_id NUMBER NOT NULL,
    quantity NUMBER NOT NULL DEFAULT 1,
    added_at TIMESTAMP DEFAULT SYSTIMESTAMP,
    FOREIGN KEY (buyer_id) REFERENCES users(ID),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- 입찰 테이블
CREATE TABLE bids (
    bid_id NUMBER PRIMARY KEY,
    auction_id NUMBER NOT NULL,
    bidder_id VARCHAR2(100) NOT NULL,
    bid_amount NUMBER NOT NULL,
    bid_time TIMESTAMP DEFAULT SYSTIMESTAMP,
    is_winner NUMBER(1) DEFAULT 0,
    FOREIGN KEY (bidder_id) REFERENCES users(ID)
);

-- 리뷰 테이블
CREATE TABLE reviews (
    review_id NUMBER PRIMARY KEY,
    order_id NUMBER NOT NULL,
    buyer_id VARCHAR2(100) NOT NULL,
    product_id NUMBER NOT NULL,
    rating NUMBER(1) NOT NULL CHECK (rating BETWEEN 1 AND 5),
    review_content CLOB,
    review_date TIMESTAMP DEFAULT SYSTIMESTAMP,
    seller_reply CLOB,
    reply_date TIMESTAMP,
    FOREIGN KEY (buyer_id) REFERENCES users(ID),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- 문의 테이블
CREATE TABLE inquiries (
    inquiry_id NUMBER PRIMARY KEY,
    buyer_id VARCHAR2(100) NOT NULL,
    product_id NUMBER NOT NULL,
    inquiry_title VARCHAR2(200) NOT NULL,
    inquiry_content CLOB,
    inquiry_date TIMESTAMP DEFAULT SYSTIMESTAMP,
    seller_reply CLOB,
    reply_date TIMESTAMP,
    status VARCHAR2(20) DEFAULT 'PENDING',
    FOREIGN KEY (buyer_id) REFERENCES users(ID),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- 시퀀스 생성
CREATE SEQUENCE product_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE order_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE cart_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE bid_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE review_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE inquiry_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE image_seq START WITH 1 INCREMENT BY 1;

-- 인덱스 생성
CREATE INDEX idx_products_seller ON products(seller_id);
CREATE INDEX idx_orders_buyer ON orders(buyer_id);
CREATE INDEX idx_orders_product ON orders(product_id);
CREATE INDEX idx_cart_buyer ON cart(buyer_id);
CREATE INDEX idx_bids_bidder ON bids(bidder_id);
CREATE INDEX idx_reviews_buyer ON reviews(buyer_id);
CREATE INDEX idx_inquiries_buyer ON inquiries(buyer_id);

COMMIT;
