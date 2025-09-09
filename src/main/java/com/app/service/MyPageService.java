package com.app.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.app.dto.BidDto;
import com.app.dto.CartDto;
import com.app.dto.InquiryDto;
import com.app.dto.OrderDto;
import com.app.dto.ProductDto;
import com.app.dto.ReviewDto;
import com.app.dto.UserDto;
import com.app.mapper.BidMapper;
import com.app.mapper.CartMapper;
import com.app.mapper.InquiryMapper;
import com.app.mapper.OrderMapper;
import com.app.mapper.ProductMapper;
import com.app.mapper.ReviewMapper;
import com.app.mapper.UserMapper;




@Service
@Transactional
public class MyPageService {

    @Autowired
    private UserMapper userMapper;
    
    @Autowired
    private ProductMapper productMapper;
    
    @Autowired
    private OrderMapper orderMapper;
    
    @Autowired
    private ReviewMapper reviewMapper;
    
    @Autowired
    private InquiryMapper inquiryMapper;
    
    @Autowired
    private CartMapper cartMapper;
    
    @Autowired
    private BidMapper bidMapper;

    // 구매자 마이페이지 메인 정보 조회
    public Map<String, Object> getBuyerMyPageInfo(String buyerId) {
        Map<String, Object> result = new HashMap<>();
        
        // 사용자 정보
        UserDto user = userMapper.getUserById(buyerId);
        if (user == null) {
            throw new RuntimeException("사용자를 찾을 수 없습니다: " + buyerId);
        }
        
        // JSP에서 사용하는 키로 직접 매핑
        result.put("ID", user.getId());
        result.put("USERNAME", user.getUserName());
        result.put("EMAIL", user.getEmail());
        result.put("TEL", user.getTel());
        result.put("ADDRESS", user.getAddress());
        result.put("USER_TYPE", user.getUserType());
        result.put("TOTAL_BALANCE", user.getTotalBalance() != null ? user.getTotalBalance() : 0);
        result.put("BID_DEPOSIT", user.getBidDeposit() != null ? user.getBidDeposit() : 0);
        
        // 기본 정보 (다른 테이블 없이)
        result.put("recentOrders", new ArrayList<>());
        result.put("cartCount", 0);
        result.put("recentBids", new ArrayList<>());
        
        return result;
    }

    // 판매자 마이페이지 메인 정보 조회
    public Map<String, Object> getSellerMyPageInfo(String sellerId) {
        Map<String, Object> result = new HashMap<>();
        
        // 사용자 정보
        UserDto user = userMapper.getUserById(sellerId);
        if (user == null) {
            throw new RuntimeException("사용자를 찾을 수 없습니다: " + sellerId);
        }
        
        // JSP에서 사용하는 키로 직접 매핑
        result.put("ID", user.getId());
        result.put("USERNAME", user.getUserName());
        result.put("EMAIL", user.getEmail());
        result.put("TEL", user.getTel());
        result.put("ADDRESS", user.getAddress());
        result.put("USER_TYPE", user.getUserType());
        result.put("BUSINESS_NUMBER", user.getBusinessNumber());
        result.put("TOTAL_SALES", user.getTotalBalance() != null ? user.getTotalBalance() : 0);
        result.put("AVAILABLE_BALANCE", user.getBidDeposit() != null ? user.getBidDeposit() : 0);
        
        // 기본 정보 (다른 테이블 없이)
        result.put("products", new ArrayList<>());
        result.put("recentOrders", new ArrayList<>());
        result.put("pendingInquiryCount", 0);
        
        // 통계 정보 추가 (기본값 제공)
        result.put("orderStats", getDefaultOrderStats());
        result.put("reviewStats", getDefaultReviewStats());
        result.put("inquiryStats", getDefaultInquiryStats());
        
        return result;
    }

    // 개인정보 수정
    public boolean updateUserInfo(UserDto user) {
        return userMapper.updateUser(user) > 0;
    }

    // ==================== 구매자 마이페이지 서비스 ====================

    // 구매자 주문 목록 조회
    public List<OrderDto> getBuyerOrders(String buyerId, String orderStatus) {
        try {
            if (orderStatus != null && !orderStatus.isEmpty()) {
                return orderMapper.searchBuyerOrders(buyerId, orderStatus);
            }
            return orderMapper.getOrdersByBuyer(buyerId);
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    // 주문 확정
    public boolean confirmOrder(Long orderId) {
        try {
            int result = orderMapper.confirmOrder(orderId);
            return result > 0;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // 구매자 리뷰 목록 조회
    public List<ReviewDto> getBuyerReviews(String buyerId) {
        try {
            return reviewMapper.getReviewsByBuyer(buyerId);
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    // 판매자 리뷰 목록 조회
    public List<ReviewDto> getSellerReviews(String userId) {
        try {
            return reviewMapper.getReviewsBySeller(userId);
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    // 구매자 문의 목록 조회
    public List<InquiryDto> getBuyerInquiries(String buyerId) {
        try {
            return inquiryMapper.getInquiriesByBuyer(buyerId);
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    // 장바구니 상품 수량 수정
    public boolean updateCartQuantity(String userId, Long saleItemId, Integer quantity) {
        try {
            int result = cartMapper.updateCartQuantity(userId, saleItemId, quantity);
            return result > 0;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }


    // ==================== 판매자 마이페이지 서비스 ====================

    // 판매자 주문 목록 조회
    public List<OrderDto> getSellerOrders(String sellerId, String orderStatus, String buyerName, String buyerPhone) {
        return orderMapper.searchSellerOrders(sellerId, orderStatus, buyerName, buyerPhone);
    }

    // 배송 현황 업데이트
    public boolean updateDeliveryStatus(Long saleOrderId, String orderStatus) {
        return orderMapper.updateDeliveryStatus(saleOrderId, orderStatus) > 0;
    }

    // 판매자 리뷰 목록 조회
    public List<ReviewDto> getSellerReviews(Long productId) {
        return reviewMapper.getReviewsByProduct(productId);
    }

    // 리뷰 작성/수정
    public boolean saveReview(ReviewDto review) {
        ReviewDto existingReview = reviewMapper.getReviewById(review.getReviewId());
        if (existingReview != null) {
            return reviewMapper.updateReview(review) > 0;
        } else {
            return reviewMapper.insertReview(review) > 0;
        }
    }

    // 판매자 리뷰 답글 작성
    public boolean replyToReview(Long reviewId, String sellerReply) {
        return reviewMapper.updateSellerReply(reviewId, sellerReply) > 0;
    }

    // 리뷰 이미지 등록
    public boolean insertReviewImage(Long reviewId, String imageUrl, int orderIndex, boolean isThumbnail) {
        try {
            int result = productMapper.insertReviewImage(reviewId, imageUrl, orderIndex, isThumbnail);
            return result > 0;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // 리뷰 이미지 조회
    public List<String> getReviewImages(Long reviewId) {
        try {
            return productMapper.getReviewImages(reviewId);
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    // 리뷰 이미지 삭제
    public boolean deleteReviewImages(Long reviewId) {
        try {
            int result = productMapper.deleteReviewImages(reviewId);
            return result >= 0; // 삭제할 이미지가 없어도 성공으로 처리
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // ==================== 구매자 장바구니 서비스 ====================

    // 구매자 장바구니 목록 조회
    public List<CartDto> getCartItems(String buyerId) {
        return cartMapper.getCartByBuyer(buyerId);
    }

    // 구매자 장바구니 통계 조회 (총 상품 수, 총 금액)
    public Map<String, Object> getCartStats(String buyerId) {
        Map<String, Object> stats = new HashMap<>();
        try {
            // 총 상품 수 (CART 테이블의 SALE_ITEM_ID 종류 수)
            List<CartDto> cartItems = cartMapper.getCartByBuyer(buyerId);
            int totalItemCount = cartItems.size();
            
            // 총 결제 금액 (SALES 테이블의 PRICE 합계)
            Double totalAmount = cartMapper.getCartTotalAmount(buyerId);
            if (totalAmount == null) {
                totalAmount = 0.0;
            }
            
            stats.put("totalItemCount", totalItemCount);
            stats.put("totalAmount", totalAmount);
            
        } catch (Exception e) {
            e.printStackTrace();
            stats.put("totalItemCount", 0);
            stats.put("totalAmount", 0.0);
        }
        return stats;
    }

    // 판매자 문의 목록 조회
    public List<InquiryDto> getSellerInquiries(Long productId) {
        return inquiryMapper.getInquiriesByProduct(productId);
    }

    // 문의 작성
    public boolean saveInquiry(InquiryDto inquiry) {
        return inquiryMapper.insertInquiry(inquiry) > 0;
    }

    // 판매자 문의 답변 작성
    public boolean replyToInquiry(Long inquiryId, String sellerReply) {
        return inquiryMapper.updateSellerReply(inquiryId, sellerReply) > 0;
    }

    // 구매자 입찰 목록 조회
    public List<BidDto> getBuyerBids(String buyerId) {
        return bidMapper.getBidsByBidder(buyerId);
    }

    // 낙찰 상품 조회
    public List<BidDto> getWinningBids(String buyerId) {
        return bidMapper.getWinningBids(buyerId);
    }

    // 입찰 생성
    public boolean createBid(BidDto bid) {
        return bidMapper.insertBid(bid) > 0;
    }


    // 장바구니 상품 추가
    public boolean addToCart(CartDto cart) {
        CartDto existingItem = cartMapper.checkCartItem(cart.getUserId(), cart.getSaleItemId());
        if (existingItem != null) {
            return cartMapper.updateCartQuantity(cart.getUserId(), cart.getSaleItemId(), 
                existingItem.getQuantity() + cart.getQuantity()) > 0;
        } else {
            return cartMapper.insertCartItem(cart) > 0;
        }
    }

    // 장바구니 상품 삭제
    public boolean removeFromCart(String userId, Long saleItemId) {
        return cartMapper.deleteCartItem(userId, saleItemId) > 0;
    }

    // 장바구니 총 금액 계산
    public Double getCartTotalAmount(String buyerId) {
        return cartMapper.getCartTotalAmount(buyerId);
    }

    // 판매자 상품 목록 조회
    public List<ProductDto> getSellerProducts(String sellerId, String productName, String productType) {
        return productMapper.searchProducts(sellerId, productName, productType);
    }

    // 상품 등록
    public boolean registerProduct(ProductDto product) {
        System.out.println("=== MyPageService.registerProduct 호출됨 ===");
        System.out.println("ProductDto: " + product);
        
        try {
            int result = productMapper.insertProduct(product);
            System.out.println("=== MyBatis insertProduct 결과: " + result + " ===");
            
            if (result > 0) {
                System.out.println("✅ 데이터베이스에 상품이 성공적으로 저장되었습니다!");
                return true;
            } else {
                System.out.println("❌ 데이터베이스 저장 실패: " + result + "개 행이 영향받음");
                return false;
            }
        } catch (Exception e) {
            System.out.println("❌ 상품 등록 중 예외 발생: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    // 상품 수정
    public boolean updateProduct(ProductDto product) {
        return productMapper.updateProduct(product) > 0;
    }

    // 상품 삭제
    public boolean deleteProduct(Long productId) {
        return productMapper.deleteProduct(productId) > 0;
    }
    
    // 기본 주문 통계 (임시)
    private Map<String, Object> getDefaultOrderStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("pendingCount", 0);
        stats.put("confirmedCount", 0);
        stats.put("shippingCount", 0);
        stats.put("deliveredCount", 0);
        return stats;
    }
    
    // 기본 리뷰 통계 (임시)
    private Map<String, Object> getDefaultReviewStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalCount", 0);
        stats.put("avgRating", 0.0);
        stats.put("repliedCount", 0);
        stats.put("pendingReplyCount", 0);
        return stats;
    }
    
    // 기본 문의 통계 (임시)
    private Map<String, Object> getDefaultInquiryStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalCount", 0);
        stats.put("pendingCount", 0);
        stats.put("answeredCount", 0);
        stats.put("avgResponseTime", 0.0);
        return stats;
    }

    // 구매자 통계 정보 조회
    public Map<String, Object> getBuyerStats(String userId) {
        Map<String, Object> stats = new HashMap<>();
        
        try {
            // 주문 통계
            List<OrderDto> orders = orderMapper.getOrdersByBuyer(userId);
            long totalOrders = orders.size();
            long completedOrders = orders.stream()
                .filter(order -> "COMPLETED".equals(order.getOrderStatus()))
                .count();
            long pendingOrders = orders.stream()
                .filter(order -> "PENDING".equals(order.getOrderStatus()) || "SHIPPED".equals(order.getOrderStatus()))
                .count();
            
            // 리뷰 통계
            List<ReviewDto> reviews = reviewMapper.getReviewsByBuyer(userId);
            long totalReviews = reviews.size();
            double avgRating = reviews.stream()
                .mapToInt(ReviewDto::getRating)
                .average()
                .orElse(0.0);
            long fiveStarReviews = reviews.stream()
                .filter(review -> review.getRating() == 5)
                .count();
            
            // 문의 통계
            List<InquiryDto> inquiries = inquiryMapper.getInquiriesByBuyer(userId);
            long totalInquiries = inquiries.size();
            long pendingInquiries = inquiries.stream()
                .filter(inquiry -> "PENDING".equals(inquiry.getStatus()))
                .count();
            long answeredInquiries = inquiries.stream()
                .filter(inquiry -> "ANSWERED".equals(inquiry.getStatus()))
                .count();
            
            // 경매 통계 (임시로 빈 리스트 사용)
            long totalBids = 0;
            long activeBids = 0;
            long wonAuctions = 0;
            
            // 장바구니 통계
            List<CartDto> cartItems = cartMapper.getCartByBuyer(userId);
            long cartItemCount = cartItems.size();
            
            stats.put("orders", totalOrders);
            stats.put("completedOrders", completedOrders);
            stats.put("pendingOrders", pendingOrders);
            stats.put("reviews", totalReviews);
            stats.put("avgRating", Math.round(avgRating * 10.0) / 10.0);
            stats.put("fiveStarReviews", fiveStarReviews);
            stats.put("inquiries", totalInquiries);
            stats.put("pendingInquiries", pendingInquiries);
            stats.put("answeredInquiries", answeredInquiries);
            stats.put("bids", totalBids);
            stats.put("activeBids", activeBids);
            stats.put("wonAuctions", wonAuctions);
            stats.put("cartItems", cartItemCount);
            
        } catch (Exception e) {
            e.printStackTrace();
            // 기본값 설정
            stats.put("orders", 0);
            stats.put("completedOrders", 0);
            stats.put("pendingOrders", 0);
            stats.put("reviews", 0);
            stats.put("avgRating", 0.0);
            stats.put("fiveStarReviews", 0);
            stats.put("inquiries", 0);
            stats.put("pendingInquiries", 0);
            stats.put("answeredInquiries", 0);
            stats.put("bids", 0);
            stats.put("activeBids", 0);
            stats.put("wonAuctions", 0);
            stats.put("cartItems", 0);
        }
        
        return stats;
    }

    // 구매자 주문 내역 조회 (예외 처리 포함)
    public List<OrderDto> getBuyerOrdersWithExceptionHandling(String userId) {
        try {
            return orderMapper.getOrdersByBuyer(userId);
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    // 판매자 주문 목록 조회 (예외 처리 포함)
    public List<OrderDto> getSellerOrdersWithExceptionHandling(String userId) {
        try {
            List<OrderDto> orders = orderMapper.getOrdersBySeller(userId);
            return orders;
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    // 주문 확정 (예외 처리 포함)
    public boolean confirmOrderWithExceptionHandling(Long orderId) {
        try {
            int result = orderMapper.confirmOrder(orderId);
            return result > 0;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // 구매자 리뷰 내역 조회 (예외 처리 포함)
    public List<ReviewDto> getBuyerReviewsWithExceptionHandling(String userId) {
        try {
            return reviewMapper.getReviewsByBuyer(userId);
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    // 리뷰 수정
    public boolean updateReview(ReviewDto review) {
        try {
            int result = reviewMapper.updateReview(review);
            return result > 0;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // 리뷰 삭제
    public boolean deleteReview(Long reviewId) {
        try {
            int result = reviewMapper.deleteReview(reviewId);
            return result > 0;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // 구매자 문의 내역 조회 (예외 처리 포함)
    public List<InquiryDto> getBuyerInquiriesWithExceptionHandling(String userId) {
        try {
            return inquiryMapper.getInquiriesByBuyer(userId);
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    // 문의 종료 (상태 업데이트로 대체)
    public boolean closeInquiry(Long inquiryId) {
        try {
            int result = inquiryMapper.updateInquiryStatus(inquiryId, "CLOSED");
            return result > 0;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // 구매자 경매 내역 조회
    public List<BidDto> getBuyerAuctions(String userId) {
        try {
            // BidMapper 메서드가 없으므로 임시로 빈 리스트 반환
            return new ArrayList<>();
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    // 경매 결제 처리
    public boolean processAuctionPayment(Long auctionId, String paymentMethod, Double amount) {
        try {
            // 결제 시스템 연동 로직 (추후 구현 예정)
            System.out.println("경매 결제 처리: " + auctionId + ", " + paymentMethod + ", " + amount);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // 입찰 취소 (임시 구현 - BidMapper에 해당 메서드가 없음)
    public boolean cancelBid(Long auctionId) {
        try {
            // BidMapper에 cancelBid 메서드 추가 필요 (추후 구현 예정)
            System.out.println("입찰 취소 요청: " + auctionId + " (임시 구현)");
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // 구매자 장바구니 조회
    public List<CartDto> getBuyerCart(String userId) {
        try {
            return cartMapper.getCartByBuyer(userId);
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    // 장바구니 수량 변경 (예외 처리 포함)
    public boolean updateCartQuantityWithExceptionHandling(String userId, Long saleItemId, Integer quantity) {
        try {
            int result = cartMapper.updateCartQuantity(userId, saleItemId, quantity);
            return result > 0;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // 장바구니 상품 삭제
    public boolean removeCartItem(String userId, Long saleItemId) {
        try {
            int result = cartMapper.deleteCartItem(userId, saleItemId);
            return result > 0;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // 선택된 장바구니 상품들 삭제 (개선된 구현)
    public boolean removeCartItems(String userId, List<Long> saleItemIds) {
        try {
            boolean allSuccess = true;
            for (Long saleItemId : saleItemIds) {
                int result = cartMapper.deleteCartItem(userId, saleItemId);
                allSuccess = allSuccess && (result > 0);
            }
            return allSuccess;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // 장바구니 결제
    public boolean checkoutCart(List<Long> itemIds, Double totalAmount, String paymentMethod) {
        try {
            // 결제 시스템 연동 로직 (추후 구현 예정)
            System.out.println("장바구니 결제: " + itemIds + ", " + totalAmount + ", " + paymentMethod);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // 판매자 정보 업데이트
    public boolean updateSellerInfo(String userId, String businessNumber, String specialty) {
        try {
            Map<String, Object> params = new HashMap<>();
            params.put("userId", userId);
            params.put("businessNumber", businessNumber);
            params.put("specialty", specialty);
            
            int result = userMapper.updateSellerInfo(params);
            return result > 0;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
    
    // 상품 이미지 삭제
    public boolean deleteProductImages(Long productId) {
        try {
            int result = productMapper.deleteProductImages(productId);
            return result >= 0; // 삭제할 이미지가 없어도 성공으로 처리
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
    
    // 상품 이미지 등록
    public boolean insertProductImage(Long productId, String imageUrl, int orderIndex, boolean isThumbnail) {
        try {
            int result = productMapper.insertProductImage(productId, imageUrl, orderIndex, isThumbnail);
            return result > 0;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}