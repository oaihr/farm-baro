# Farm Baro - 농산물 거래 플랫폼

농산물 거래를 위한 웹 플랫폼으로, 구매자와 판매자의 마이페이지 기능을 제공합니다.

## 🚀 주요 기능

### 구매자 마이페이지
- **프로필 관리**: 개인정보 조회 및 수정
- **주문/배송 관리**: 주문 내역 조회, 배송 현황 확인, 구매 확정
- **리뷰 관리**: 작성한 리뷰 조회 및 수정
- **문의 관리**: 상품 문의 내역 조회
- **경매 상품**: 입찰 내역, 낙찰 상품 관리
- **장바구니**: 상품 담기, 수량 조정, 선택 결제

### 판매자 마이페이지
- **프로필 관리**: 개인정보 조회 및 수정
- **주문/배송 관리**: 주문 현황, 배송 상태 업데이트
- **리뷰 관리**: 구매자 리뷰 확인 및 답글 작성
- **문의 관리**: 구매자 문의 확인 및 답변 작성
- **상품 관리**: 등록 상품 목록, 상품 검색, 상품 등록/수정/삭제

## 🛠 기술 스택

### Backend
- **Java 11**
- **Spring Framework 5.3.27**
- **MyBatis 3.5.10**
- **Oracle Database**
- **Maven**

### Frontend
- **React 19.1.1**
- **React Router DOM 7.8.2**
- **CSS3**

## 📁 프로젝트 구조

```
farm-baro/
├── src/
│   ├── main/
│   │   ├── java/com/app/
│   │   │   ├── controller/     # REST API 컨트롤러
│   │   │   ├── service/        # 비즈니스 로직
│   │   │   ├── mapper/         # MyBatis 매퍼 인터페이스
│   │   │   └── dto/           # 데이터 전송 객체
│   │   ├── frontend/          # React 프론트엔드
│   │   │   └── src/
│   │   │       └── components/MyPage/
│   │   └── webapp/
│   │       ├── WEB-INF/
│   │       │   ├── mybatis/   # MyBatis XML 매퍼
│   │       │   └── spring/    # Spring 설정
│   │       └── sql/           # 데이터베이스 스키마
└── pom.xml
```

## 🗄 데이터베이스 스키마

### 주요 테이블
- `users`: 사용자 정보 (구매자/판매자)
- `products`: 상품 정보 (일반/경매)
- `orders`: 주문 정보
- `cart`: 장바구니
- `bids`: 입찰 정보
- `reviews`: 리뷰 정보
- `inquiries`: 문의 정보

## 🚀 실행 방법

### 1. 데이터베이스 설정
```sql
-- Oracle Database에서 스키마 실행
@src/main/webapp/sql/mypage_schema.sql
```

### 2. 백엔드 실행
```bash
# Maven으로 프로젝트 빌드
mvn clean install

# Spring Boot 애플리케이션 실행
mvn spring-boot:run
```

### 3. 프론트엔드 실행
```bash
# 프론트엔드 디렉토리로 이동
cd src/main/frontend

# 의존성 설치
npm install

# 개발 서버 실행
npm start
```

## 📱 API 엔드포인트

### 마이페이지 API
- `GET /api/mypage/{userType}/{userId}` - 마이페이지 메인 정보
- `GET /api/mypage/{userType}/{userId}/orders` - 주문 목록
- `GET /api/mypage/{userType}/{userId}/cart` - 장바구니
- `POST /api/mypage/products` - 상품 등록
- `PUT /api/mypage/user` - 개인정보 수정

### 상세 API 문서는 각 컨트롤러 클래스 참조

## 🎨 UI/UX 특징

- **반응형 디자인**: 모바일, 태블릿, 데스크톱 지원
- **모던 UI**: 그라데이션, 그림자, 애니메이션 효과
- **직관적인 네비게이션**: 사용자 타입별 메뉴 구성
- **실시간 상태 표시**: 주문 상태, 배송 현황 실시간 업데이트

## 🔧 개발 환경 설정

### 필수 요구사항
- Java 11 이상
- Node.js 16 이상
- Oracle Database 19c 이상
- Maven 3.6 이상

### IDE 설정
- **IntelliJ IDEA** 또는 **Eclipse** (백엔드)
- **VS Code** (프론트엔드)

## 📝 라우팅 구조

```
/mypage/:userType/:userId                    # 마이페이지 메인
/mypage/:userType/:userId/orders            # 주문/배송 관리
/mypage/:userType/:userId/cart              # 장바구니
/mypage/:userType/:userId/product-register  # 상품 등록
```

## 🤝 기여 방법

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해 주세요.
