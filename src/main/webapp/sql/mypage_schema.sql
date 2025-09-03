-- 사용자 테이블 (구매자/판매자 구분)
CREATE TABLE users (
    user_id VARCHAR2(50) PRIMARY KEY,
    user_type VARCHAR2(10) NOT NULL CHECK (user_type IN ('BUYER', 'SELLER')),
    username VARCHAR2(100) NOT NULL,
    email VARCHAR2(100) UNIQUE NOT NULL,
    password VARCHAR2(255) NOT NULL,
    phone VARCHAR2(20),
    address VARCHAR2(500),
    profile_image VARCHAR2(255),
    created_at TIMESTAMP DEFAULT SYSDATE,
    updated_at TIMESTAMP DEFAULT SYSDATE
);

-- 상품 테이블
CREATE TABLE products (
    product_id NUMBER PRIMARY KEY,
    seller_id VARCHAR2(50) NOT NULL,
    product_name VARCHAR2(200) NOT NULL,
    product_type VARCHAR2(20) NOT NULL CHECK (product_type IN ('NORMAL', 'AUCTION')),
    price NUMBER,
    initial_bid_price NUMBER,
    quantity NUMBER,
    description CLOB,
    auction_end_time TIMESTAMP,
    status VARCHAR2(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'SOLD_OUT', 'AUCTION_ENDED')),
    created_at TIMESTAMP DEFAULT SYSDATE,
    FOREIGN KEY (seller_id) REFERENCES users(user_id)
);

-- 상품 이미지 테이블
CREATE TABLE product_images (
    image_id NUMBER PRIMARY KEY,
    product_id NUMBER NOT NULL,
    image_url VARCHAR2(255) NOT NULL,
    image_order NUMBER DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- 주문 테이블
CREATE TABLE orders (
    order_id NUMBER PRIMARY KEY,
    buyer_id VARCHAR2(50) NOT NULL,
    product_id NUMBER NOT NULL,
    quantity NUMBER NOT NULL,
    total_price NUMBER NOT NULL,
    order_status VARCHAR2(20) DEFAULT 'PENDING' CHECK (order_status IN ('PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'COMPLETED', 'CANCELLED')),
    shipping_address VARCHAR2(500),
    shipping_phone VARCHAR2(20),
    shipping_name VARCHAR2(100),
    order_date TIMESTAMP DEFAULT SYSDATE,
    payment_date TIMESTAMP,
    delivery_date TIMESTAMP,
    FOREIGN KEY (buyer_id) REFERENCES users(user_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- 장바구니 테이블
CREATE TABLE cart (
    cart_id NUMBER PRIMARY KEY,
    buyer_id VARCHAR2(50) NOT NULL,
    product_id NUMBER NOT NULL,
    quantity NUMBER DEFAULT 1,
    added_at TIMESTAMP DEFAULT SYSDATE,
    FOREIGN KEY (buyer_id) REFERENCES users(user_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- 입찰 테이블
CREATE TABLE bids (
    bid_id NUMBER PRIMARY KEY,
    auction_id NUMBER NOT NULL,
    bidder_id VARCHAR2(50) NOT NULL,
    bid_amount NUMBER NOT NULL,
    bid_time TIMESTAMP DEFAULT SYSDATE,
    is_winner NUMBER(1) DEFAULT 0 CHECK (is_winner IN (0, 1)),
    FOREIGN KEY (auction_id) REFERENCES products(product_id),
    FOREIGN KEY (bidder_id) REFERENCES users(user_id)
);

-- 리뷰 테이블
CREATE TABLE reviews (
    review_id NUMBER PRIMARY KEY,
    order_id NUMBER NOT NULL,
    buyer_id VARCHAR2(50) NOT NULL,
    product_id NUMBER NOT NULL,
    rating NUMBER CHECK (rating >= 1 AND rating <= 5),
    review_content CLOB,
    review_date TIMESTAMP DEFAULT SYSDATE,
    seller_reply CLOB,
    reply_date TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (buyer_id) REFERENCES users(user_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- 문의 테이블
CREATE TABLE inquiries (
    inquiry_id NUMBER PRIMARY KEY,
    buyer_id VARCHAR2(50) NOT NULL,
    product_id NUMBER NOT NULL,
    inquiry_title VARCHAR2(200) NOT NULL,
    inquiry_content CLOB NOT NULL,
    inquiry_date TIMESTAMP DEFAULT SYSDATE,
    seller_reply CLOB,
    reply_date TIMESTAMP,
    status VARCHAR2(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'REPLIED')),
    FOREIGN KEY (buyer_id) REFERENCES users(user_id),
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
CREATE INDEX idx_bids_auction ON bids(auction_id);
CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_inquiries_product ON inquiries(product_id);
