package com.app.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.app.dto.BidDto;
import com.app.dto.CartDto;
import com.app.dto.InquiryDto;
import com.app.dto.OrderDto;
import com.app.dto.ProductDto;
import com.app.dto.ReviewDto;
import com.app.dto.UserDto;
import com.app.service.MyPageService;

@RestController
@RequestMapping("/api/mypage")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"},
        allowCredentials = "true",
        allowedHeaders = "*",
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class MyPageController {

    @Autowired
    private MyPageService myPageService;

    // 구매자 마이페이지 메인
    @GetMapping("/buyer/{buyerId}")
    public String getBuyerMyPage(@PathVariable String buyerId, Model model) {
        System.out.println("=== 구매자 마이페이지 접근: " + buyerId + " ===");
        try {
            Map<String, Object> result = myPageService.getBuyerMyPageInfo(buyerId);
            System.out.println("=== MyPageService 결과: " + result + " ===");
            model.addAttribute("userInfo", result);
            model.addAttribute("userType", "buyer");
            model.addAttribute("userId", buyerId);
            System.out.println("=== JSP 뷰 반환: mypage/buyer/main ===");
            return "mypage/buyer/main";
        } catch (Exception e) {
            System.out.println("=== 오류 발생: " + e.getMessage() + " ===");
            e.printStackTrace();
            model.addAttribute("error", e.getMessage());
            return "error";
        }
    }

    // 판매자 마이페이지 메인
    @GetMapping("/seller/{sellerId}")
    public String getSellerMyPage(@PathVariable String sellerId, Model model) {
        try {
            Map<String, Object> result = myPageService.getSellerMyPageInfo(sellerId);
            model.addAttribute("userInfo", result);
            model.addAttribute("userType", "seller");
            model.addAttribute("userId", sellerId);
            return "mypage/seller/main";
        } catch (Exception e) {
            model.addAttribute("error", e.getMessage());
            return "error";
        }
    }

    // 구매자 개인정보 수정 페이지
    @GetMapping("/buyer/{buyerId}/edit-info")
    public String buyerEditInfo(@PathVariable String buyerId, Model model) {
        try {
            Map<String, Object> result = myPageService.getBuyerMyPageInfo(buyerId);
            model.addAttribute("userInfo", result);
            model.addAttribute("userType", "buyer");
            model.addAttribute("userId", buyerId);
            return "mypage/buyer/edit";
        } catch (Exception e) {
            model.addAttribute("error", e.getMessage());
            return "error";
        }
    }

    // 판매자 개인정보 수정 페이지
    @GetMapping("/seller/{sellerId}/edit")
    public String sellerEditInfo(@PathVariable String sellerId, Model model) {
        try {
            Map<String, Object> result = myPageService.getSellerMyPageInfo(sellerId);
            model.addAttribute("userInfo", result);
            model.addAttribute("userType", "seller");
            model.addAttribute("userId", sellerId);
            return "mypage/seller/edit";
        } catch (Exception e) {
            model.addAttribute("error", e.getMessage());
            return "error";
        }
    }

    // 구매자 주문 목록 페이지
    @GetMapping("/buyer/{buyerId}/orders/page")
    public String getBuyerOrdersPage(@PathVariable String buyerId, Model model,
            @RequestParam(required = false) String orderStatus) {
        try {
            List<OrderDto> orders = myPageService.getBuyerOrders(buyerId, orderStatus);
            model.addAttribute("orders", orders);
            model.addAttribute("userType", "buyer");
            model.addAttribute("userId", buyerId);
            return "mypage/buyer/orders";
        } catch (Exception e) {
            model.addAttribute("error", e.getMessage());
            return "error";
        }
    }

    // 판매자 주문 목록 페이지
    @GetMapping("/seller/{sellerId}/orders/page")
    public String getSellerOrdersPage(@PathVariable String sellerId, Model model,
            @RequestParam(required = false) String orderStatus, @RequestParam(required = false) String buyerName,
            @RequestParam(required = false) String buyerPhone) {
        try {
            List<OrderDto> orders = myPageService.getSellerOrders(sellerId, orderStatus, buyerName, buyerPhone);
            model.addAttribute("orders", orders);
            model.addAttribute("userType", "seller");
            model.addAttribute("userId", sellerId);
            return "mypage/seller/orders";
        } catch (Exception e) {
            model.addAttribute("error", e.getMessage());
            return "error";
        }
    }

    // 구매자 리뷰 페이지
    @GetMapping("/buyer/{buyerId}/reviews/page")
    public String getBuyerReviewsPage(@PathVariable String buyerId, Model model) {
        try {
            List<ReviewDto> reviews = myPageService.getBuyerReviews(buyerId);
            model.addAttribute("reviews", reviews);
            model.addAttribute("userType", "buyer");
            model.addAttribute("userId", buyerId);
            return "mypage/buyer/reviews";
        } catch (Exception e) {
            model.addAttribute("error", e.getMessage());
            return "error";
        }
    }

    // 판매자 리뷰 페이지
    @GetMapping("/seller/{sellerId}/reviews/page")
    public String getSellerReviewsPage(@PathVariable String sellerId, Model model) {
        try {
            Map<String, Object> result = myPageService.getSellerMyPageInfo(sellerId);
            model.addAttribute("userInfo", result);
            model.addAttribute("userType", "seller");
            model.addAttribute("userId", sellerId);
            return "mypage/seller/reviews";
        } catch (Exception e) {
            model.addAttribute("error", e.getMessage());
            return "error";
        }
    }

    // 구매자 문의 페이지
    @GetMapping("/buyer/{buyerId}/inquiries/page")
    public String getBuyerInquiriesPage(@PathVariable String buyerId, Model model) {
        try {
            List<InquiryDto> inquiries = myPageService.getBuyerInquiries(buyerId);
            model.addAttribute("inquiries", inquiries);
            model.addAttribute("userType", "buyer");
            model.addAttribute("userId", buyerId);
            return "mypage/buyer/inquiries";
        } catch (Exception e) {
            model.addAttribute("error", e.getMessage());
            return "error";
        }
    }

    // 판매자 문의 페이지
    @GetMapping("/seller/{sellerId}/inquiries/page")
    public String getSellerInquiriesPage(@PathVariable String sellerId, Model model) {
        try {
            Map<String, Object> result = myPageService.getSellerMyPageInfo(sellerId);
            model.addAttribute("userInfo", result);
            model.addAttribute("userType", "seller");
            model.addAttribute("userId", sellerId);
            return "mypage/seller/inquiries";
        } catch (Exception e) {
            model.addAttribute("error", e.getMessage());
            return "error";
        }
    }

    // 구매자 경매 상품 페이지
    @GetMapping("/buyer/{buyerId}/bids/page")
    public String getBuyerBidsPage(@PathVariable String buyerId, Model model) {
        try {
            List<BidDto> bids = myPageService.getBuyerBids(buyerId);
            List<BidDto> winningBids = myPageService.getWinningBids(buyerId);
            model.addAttribute("bids", bids);
            model.addAttribute("winningBids", winningBids);
            model.addAttribute("userType", "buyer");
            model.addAttribute("userId", buyerId);
            return "mypage/buyer/bids";
        } catch (Exception e) {
            model.addAttribute("error", e.getMessage());
            return "error";
        }
    }

    // 구매자 장바구니 페이지
    @GetMapping("/buyer/{buyerId}/cart/page")
    public String getBuyerCartPage(@PathVariable String buyerId, Model model) {
        try {
            List<CartDto> cartItems = myPageService.getCartItems(buyerId);
            Double totalAmount = myPageService.getCartTotalAmount(buyerId);
            Map<String, Object> userInfo = myPageService.getBuyerMyPageInfo(buyerId);

            model.addAttribute("cartItems", cartItems);
            model.addAttribute("totalAmount", totalAmount);
            model.addAttribute("userInfo", userInfo);
            model.addAttribute("userType", "buyer");
            model.addAttribute("userId", buyerId);
            return "mypage/buyer/cart";
        } catch (Exception e) {
            model.addAttribute("error", e.getMessage());
            return "error";
        }
    }

    // 판매자 상품 목록 페이지
    @GetMapping("/seller/{sellerId}/products/page")
    public String getSellerProductsPage(@PathVariable String sellerId, Model model,
            @RequestParam(required = false) String productName, @RequestParam(required = false) String productType) {
        try {
            List<ProductDto> products = myPageService.getSellerProducts(sellerId, productName, productType);
            model.addAttribute("products", products);
            model.addAttribute("userType", "seller");
            model.addAttribute("userId", sellerId);
            return "mypage/seller/products";
        } catch (Exception e) {
            model.addAttribute("error", e.getMessage());
            return "error";
        }
    }

    // 판매자 상품 등록 페이지
    @GetMapping("/seller/{sellerId}/product-register")
    public String getSellerProductRegisterPage(@PathVariable String sellerId, Model model) {
        try {
            Map<String, Object> result = myPageService.getSellerMyPageInfo(sellerId);
            model.addAttribute("userInfo", result);
            model.addAttribute("userType", "seller");
            model.addAttribute("userId", sellerId);
            return "mypage/seller/product-register";
        } catch (Exception e) {
            model.addAttribute("error", e.getMessage());
            return "error";
        }
    }

    // ===== API 엔드포인트들 (JSON 반환) =====
    // 개인정보 수정 API
    @PutMapping("/api/user")
    @ResponseBody
    public ResponseEntity<Boolean> updateUserInfo(@RequestBody UserDto user) {
        try {
            boolean result = myPageService.updateUserInfo(user);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // 판매자 개인정보 수정 API
    @PutMapping("/api/mypage/seller/{sellerId}/edit")
    @ResponseBody
    public ResponseEntity<Boolean> updateSellerInfo(@PathVariable String sellerId, @RequestBody UserDto user) {
        try {
            System.out.println("=== 판매자 개인정보 수정 요청 ===");
            System.out.println("sellerId: " + sellerId);
            System.out.println("user: " + user);

            // userId 설정
            user.setId(sellerId);
            System.out.println("수정된 user: " + user);

            boolean result = myPageService.updateUserInfo(user);
            System.out.println("수정 결과: " + result);

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            System.out.println("=== 오류 발생: " + e.getMessage() + " ===");
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    // 구매자 개인정보 수정 API
    @PutMapping("/api/mypage/buyer/{buyerId}/edit")
    @ResponseBody
    public ResponseEntity<Boolean> updateBuyerInfo(@PathVariable String buyerId, @RequestBody UserDto user) {
        try {
            // userId 설정
            user.setId(buyerId);
            boolean result = myPageService.updateUserInfo(user);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // 사용자 개인정보 수정 API (범용)
    @PutMapping("/api/mypage/{userType}/{userId}/edit")
    @ResponseBody
    public ResponseEntity<Boolean> updateUserInfoMyPage(@PathVariable String userType, @PathVariable String userId, @RequestBody UserDto user) {
        try {
            // userId 설정
            user.setId(userId);
            boolean result = myPageService.updateUserInfo(user);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // 주문 확정 API
    @PutMapping("/api/orders/{saleOrderId}/confirm")
    @ResponseBody
    public ResponseEntity<Boolean> confirmOrder(@PathVariable Long saleOrderId) {
        try {
            boolean result = myPageService.confirmOrder(saleOrderId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // 배송 현황 업데이트 API
    @PutMapping("/api/orders/{saleOrderId}/delivery")
    @ResponseBody
    public ResponseEntity<Boolean> updateDeliveryStatus(@PathVariable Long saleOrderId, @RequestParam String orderStatus) {
        try {
            boolean result = myPageService.updateDeliveryStatus(saleOrderId, orderStatus);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // 리뷰 작성/수정 API
    @PostMapping("/api/reviews")
    @ResponseBody
    public ResponseEntity<Boolean> saveReview(@RequestBody ReviewDto review) {
        try {
            boolean result = myPageService.saveReview(review);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // 판매자 리뷰 답글 API
    @PutMapping("/reviews/{reviewId}/reply")
    @ResponseBody
    public ResponseEntity<Boolean> replyToReview(@PathVariable Long reviewId, @RequestBody Map<String, String> request) {
        try {
            String sellerReply = request.get("sellerReply");
            boolean result = myPageService.replyToReview(reviewId, sellerReply);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // 간단한 테스트 API
    @GetMapping("/test/ping")
    @CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
    @ResponseBody
    public ResponseEntity<Map<String, String>> ping() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "API is working");
        return ResponseEntity.ok(response);
    }

    // 판매자 리뷰 목록 조회 API
    @GetMapping("/seller/{userId}/reviews")
    @CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
    @ResponseBody
    public ResponseEntity<List<ReviewDto>> getSellerReviews(@PathVariable String userId) {
        try {
            List<ReviewDto> reviews = myPageService.getSellerReviews(userId);
            return ResponseEntity.ok(reviews);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    // 리뷰 이미지 등록 API
    @PostMapping("/api/reviews/{reviewId}/images")
    @CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
    @ResponseBody
    public ResponseEntity<Boolean> insertReviewImages(@PathVariable Long reviewId, @RequestBody List<String> imageUrls) {
        try {
            // 기존 리뷰 이미지 삭제
            myPageService.deleteReviewImages(reviewId);

            // 새로운 이미지들 등록
            boolean success = true;
            for (int i = 0; i < imageUrls.size(); i++) {
                String imageUrl = imageUrls.get(i);
                if (imageUrl != null && !imageUrl.trim().isEmpty()) {
                    boolean isThumbnail = (i == 0); // 첫 번째 이미지를 대표 이미지로 설정
                    boolean result = myPageService.insertReviewImage(reviewId, imageUrl.trim(), i + 1, isThumbnail);
                    if (!result) {
                        success = false;
                    }
                }
            }
            return ResponseEntity.ok(success);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    // 리뷰 이미지 조회 API
    @GetMapping("/reviews/{reviewId}/images")
    @CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
    @ResponseBody
    public ResponseEntity<List<String>> getReviewImages(@PathVariable Long reviewId) {
        try {
            List<String> images = myPageService.getReviewImages(reviewId);
            return ResponseEntity.ok(images);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    // 문의 작성 API
    @PostMapping("/api/inquiries")
    @ResponseBody
    public ResponseEntity<Boolean> saveInquiry(@RequestBody InquiryDto inquiry) {
        try {
            boolean result = myPageService.saveInquiry(inquiry);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // 판매자 문의 답변 API
    @PutMapping("/api/inquiries/{inquiryId}/reply")
    @ResponseBody
    public ResponseEntity<Boolean> replyToInquiry(@PathVariable Long inquiryId, @RequestParam String sellerReply) {
        try {
            boolean result = myPageService.replyToInquiry(inquiryId, sellerReply);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // 입찰 생성 API
    @PostMapping("/api/bids")
    @ResponseBody
    public ResponseEntity<Boolean> createBid(@RequestBody BidDto bid) {
        try {
            boolean result = myPageService.createBid(bid);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // 장바구니 상품 추가 API
    @PostMapping("/api/cart")
    @ResponseBody
    public ResponseEntity<Boolean> addToCart(@RequestBody CartDto cart) {
        try {
            boolean result = myPageService.addToCart(cart);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // 장바구니 상품 수량 수정 API
    @PutMapping("/api/cart/{userId}/{saleItemId}/quantity")
    @ResponseBody
    public ResponseEntity<Boolean> updateCartQuantity(@PathVariable String userId, @PathVariable Long saleItemId, @RequestParam Integer quantity) {
        try {
            boolean result = myPageService.updateCartQuantity(userId, saleItemId, quantity);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // 장바구니 상품 삭제 API
    @DeleteMapping("/api/cart/{userId}/{saleItemId}")
    @ResponseBody
    public ResponseEntity<Boolean> removeFromCart(@PathVariable String userId, @PathVariable Long saleItemId) {
        try {
            boolean result = myPageService.removeFromCart(userId, saleItemId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // 상품 등록 API
    @PostMapping("/products")
    @ResponseBody
    public ResponseEntity<Boolean> registerProduct(
            @RequestParam("title") String title,
            @RequestParam("judgeKindName") String judgeKindName,
            @RequestParam("cutName") String cutName,
            @RequestParam("qty") Integer qty,
            @RequestParam("saleStatus") String saleStatus,
            @RequestParam("description") String description,
            @RequestParam("detailDescription") String detailDescription,
            @RequestParam("weight") String weight,
            @RequestParam("price") Double price,
            @RequestParam("grade") String grade,
            @RequestParam("traceabilityNum") String traceabilityNum,
            @RequestParam("sellerId") String sellerId,
            @RequestParam(value = "imageUrls", required = false) String[] imageUrls,
            @RequestParam(value = "imageOrderIndexes", required = false) Integer[] imageOrderIndexes) {

        System.out.println("=== 상품 등록 요청 받음 ===");
        System.out.println("title: " + title);
        System.out.println("judgeKindName: " + judgeKindName);
        System.out.println("cutName: " + cutName);
        System.out.println("qty: " + qty);
        System.out.println("saleStatus: " + saleStatus);
        System.out.println("description: " + description);
        System.out.println("detailDescription: " + detailDescription);
        System.out.println("weight: " + weight);
        System.out.println("price: " + price);
        System.out.println("grade: " + grade);
        System.out.println("traceabilityNum: " + traceabilityNum);
        System.out.println("sellerId: " + sellerId);
        System.out.println("imageUrls: " + (imageUrls != null ? imageUrls.length : 0) + "개");

        try {
            ProductDto product = new ProductDto();
            product.setTitle(title);
            product.setJudgeKindName(judgeKindName);
            product.setCutName(cutName);
            product.setQty(qty);
            product.setDescription(description);
            product.setDetailDescription(detailDescription);
            product.setWeight(weight);
            product.setPrice(price);
            product.setGrade(grade);
            product.setTraceabilityNum(traceabilityNum);
            product.setSellerId(sellerId);
            product.setSaleStatus(saleStatus);

            // 상품 등록
            boolean result = myPageService.registerProduct(product);

            // 이미지 URL들이 있으면 처리
            if (result && imageUrls != null && imageUrls.length > 0) {
                Long productId = product.getSaleItemId();
                System.out.println("=== 생성된 상품 ID: " + productId + " ===");
                
                if (productId != null) {
                    for (int i = 0; i < imageUrls.length; i++) {
                        String imageUrl = imageUrls[i];
                        if (imageUrl != null && !imageUrl.trim().isEmpty()) {
                            // ORDER_INDEX가 1이면 IS_THUMBNAIL을 'Y'로 설정
                            int orderIndex = (imageOrderIndexes != null && i < imageOrderIndexes.length && imageOrderIndexes[i] != null) 
                                ? imageOrderIndexes[i].intValue() : (i + 1);
                            boolean isThumbnail = (orderIndex == 1); // ORDER_INDEX가 1이면 썸네일
                            
                            System.out.println("이미지 저장 시도: " + imageUrl + ", PRODUCT_ID: " + productId + ", ORDER_INDEX: " + orderIndex + ", IS_THUMBNAIL: " + isThumbnail);
                            boolean imageResult = myPageService.insertProductImage(productId, imageUrl.trim(), orderIndex, isThumbnail);
                            System.out.println("이미지 저장 결과: " + imageResult);
                        }
                    }
                } else {
                    System.out.println("❌ 상품 ID가 null입니다. 이미지 저장을 건너뜁니다.");
                }
            }
            System.out.println("=== 상품 등록 결과: " + result + " ===");

            if (result) {
                System.out.println("✅ 상품이 성공적으로 등록되었습니다!");
            } else {
                System.out.println("❌ 상품 등록에 실패했습니다!");
            }

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    // 상품 수정 API (JSON 방식)
    @PutMapping(value = "/products/{productId}", consumes = "application/json")
    @CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
    @ResponseBody
    public ResponseEntity<Boolean> updateProductJson(
            @PathVariable Long productId,
            @RequestBody ProductDto product) {
        try {
            product.setSaleItemId(productId);
            boolean result = myPageService.updateProduct(product);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    // 상품 이미지만 업데이트 API
    @PutMapping("/products/{productId}/images")
    @CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
    @ResponseBody
    public ResponseEntity<Boolean> updateProductImages(
            @PathVariable Long productId,
            @RequestBody Map<String, List<String>> request) {
        try {
            System.out.println("=== 상품 이미지 업데이트 요청 ===");
            System.out.println("productId: " + productId);
            
            List<String> imageUrls = request.get("imageUrls");
            System.out.println("imageUrls: " + imageUrls);
            
            boolean result = myPageService.updateProductImages(productId, imageUrls);
            System.out.println("이미지 업데이트 결과: " + result);
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    // 상품 수정 API (Form 방식)
    @PutMapping("/products/{productId}/form")
    @CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
    @ResponseBody
    public ResponseEntity<Boolean> updateProductForm(
            @PathVariable Long productId,
            @RequestParam("title") String title,
            @RequestParam("judgeKindName") String judgeKindName,
            @RequestParam("cutName") String cutName,
            @RequestParam("qty") Integer qty,
            @RequestParam("weight") String weight,
            @RequestParam("price") Double price,
            @RequestParam("saleStatus") String saleStatus,
            @RequestParam("description") String description,
            @RequestParam("detailDescription") String detailDescription,
            @RequestParam("grade") String grade,
            @RequestParam("traceabilityNum") String traceabilityNum,
            @RequestParam(value = "imageUrls", required = false) String[] imageUrls,
            @RequestParam(value = "imageOrderIndexes", required = false) Integer[] imageOrderIndexes) {
        try {
            ProductDto product = new ProductDto();
            product.setSaleItemId(productId);
            product.setTitle(title);
            product.setJudgeKindName(judgeKindName);
            product.setCutName(cutName);
            product.setQty(qty);
            product.setWeight(weight);
            product.setPrice(price);
            product.setSaleStatus(saleStatus);
            product.setDescription(description);
            product.setDetailDescription(detailDescription);
            product.setGrade(grade);
            product.setTraceabilityNum(traceabilityNum);

            // 이미지 URL들이 있으면 처리
            if (imageUrls != null && imageUrls.length > 0) {
                // 기존 이미지 삭제
                myPageService.deleteProductImages(productId);
                System.out.println("=== 기존 이미지 삭제 완료 ===");

                // 새로운 이미지 URL들 저장
                for (int i = 0; i < imageUrls.length; i++) {
                    String imageUrl = imageUrls[i];
                    if (imageUrl != null && !imageUrl.trim().isEmpty()) {
                        // ORDER_INDEX가 1이면 IS_THUMBNAIL을 'Y'로 설정
                        int orderIndex = (imageOrderIndexes != null && i < imageOrderIndexes.length && imageOrderIndexes[i] != null) 
                            ? imageOrderIndexes[i].intValue() : (i + 1);
                        boolean isThumbnail = (orderIndex == 1); // ORDER_INDEX가 1이면 썸네일
                        
                        System.out.println("이미지 저장: " + imageUrl + ", ORDER_INDEX: " + orderIndex + ", IS_THUMBNAIL: " + isThumbnail);
                        boolean imageResult = myPageService.insertProductImage(productId, imageUrl.trim(), orderIndex, isThumbnail);
                        System.out.println("이미지 저장 결과: " + imageResult);
                    }
                }
            }

            boolean result = myPageService.updateProduct(product);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    // 상품 삭제 API
    @DeleteMapping("/products/{productId}")
    @ResponseBody
    public ResponseEntity<Boolean> deleteProduct(@PathVariable Long productId) {
        try {
            boolean result = myPageService.deleteProduct(productId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // 판매자 상품 목록 조회 API
    @GetMapping("/seller/{sellerId}/products")
    @ResponseBody
    public ResponseEntity<List<ProductDto>> getSellerProducts(@PathVariable String sellerId) {
        try {
            List<ProductDto> products = myPageService.getSellerProducts(sellerId, null, null);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    // 판매자 주문 목록 조회 API
    @GetMapping("/sellers/{sellerId}/orders")
    @CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
    @ResponseBody
    public ResponseEntity<List<OrderDto>> getSellerOrders(@PathVariable String sellerId,
                                                         @RequestParam(required = false) String orderStatus,
                                                         @RequestParam(required = false) String buyerName,
                                                         @RequestParam(required = false) String buyerPhone) {
        try {
            System.out.println("=== 판매자 주문 목록 조회 요청 ===");
            System.out.println("sellerId: " + sellerId);
            System.out.println("orderStatus: " + orderStatus);
            System.out.println("buyerName: " + buyerName);
            System.out.println("buyerPhone: " + buyerPhone);
            
            List<OrderDto> orders = myPageService.getSellerOrders(sellerId, orderStatus, buyerName, buyerPhone);
            System.out.println("조회된 주문 수: " + orders.size());
            
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            System.out.println("=== 판매자 주문 목록 조회 오류: " + e.getMessage() + " ===");
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    // 판매자 최근 주문 조회 API (대시보드용 - 최근 5개)
    @GetMapping("/sellers/{sellerId}/recent-orders")
    @CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
    @ResponseBody
    public ResponseEntity<List<OrderDto>> getSellerRecentOrders(@PathVariable String sellerId) {
        try {
            System.out.println("=== 판매자 최근 주문 조회 요청 ===");
            System.out.println("sellerId: " + sellerId);
            
            List<OrderDto> allOrders = myPageService.getSellerOrders(sellerId, null, null, null);
            // 최근 5개만 반환
            List<OrderDto> recentOrders = allOrders.stream()
                    .limit(5)
                    .collect(java.util.stream.Collectors.toList());
            
            System.out.println("조회된 최근 주문 수: " + recentOrders.size());
            
            return ResponseEntity.ok(recentOrders);
        } catch (Exception e) {
            System.out.println("=== 판매자 최근 주문 조회 오류: " + e.getMessage() + " ===");
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    // ==================== 구매자 마이페이지 API ====================
    // 사용자 정보 조회 (마이페이지 메인)
    @GetMapping("/{userType}/{userId}")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> getUserInfoMyPage(@PathVariable String userType, @PathVariable String userId) {
        try {
            Map<String, Object> userInfo;
            if ("buyer".equals(userType)) {
                userInfo = myPageService.getBuyerMyPageInfo(userId);
            } else if ("seller".equals(userType)) {
                userInfo = myPageService.getSellerMyPageInfo(userId);
            } else {
                return ResponseEntity.badRequest().build();
            }
            return ResponseEntity.ok(userInfo);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    // 구매자 통계 정보 조회
    @GetMapping("/api/buyers/{userId}/stats")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> getBuyerStats(@PathVariable String userId) {
        try {
            Map<String, Object> stats = myPageService.getBuyerStats(userId);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    // 구매자 통계 정보 조회 (마이페이지 경로)
    @GetMapping("/buyers/{userId}/stats")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> getBuyerStatsMyPage(@PathVariable String userId) {
        try {
            Map<String, Object> stats = myPageService.getBuyerStats(userId);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    // 구매자 주문 내역 조회
    @GetMapping("/api/buyers/{userId}/orders")
    @ResponseBody
    public ResponseEntity<List<OrderDto>> getBuyerOrders(@PathVariable String userId) {
        try {
            List<OrderDto> orders = myPageService.getBuyerOrdersWithExceptionHandling(userId);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    // 구매자 주문 내역 조회 (마이페이지 경로)
    @GetMapping("/buyers/{userId}/orders")
    @ResponseBody
    public ResponseEntity<List<OrderDto>> getBuyerOrdersMyPage(@PathVariable String userId) {
        try {
            List<OrderDto> orders = myPageService.getBuyerOrdersWithExceptionHandling(userId);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }


    // 주문 확정 (구매자)
    @PutMapping("/api/orders/{orderId}/confirm")
    @ResponseBody
    public ResponseEntity<Boolean> confirmBuyerOrder(@PathVariable Long orderId) {
        try {
            boolean result = myPageService.confirmOrder(orderId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    // 구매자 리뷰 내역 조회
    @GetMapping("/api/buyers/{userId}/reviews")
    @ResponseBody
    public ResponseEntity<List<ReviewDto>> getBuyerReviews(@PathVariable String userId) {
        try {
            List<ReviewDto> reviews = myPageService.getBuyerReviews(userId);
            return ResponseEntity.ok(reviews);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    // 리뷰 수정
    @PutMapping("/api/reviews/{reviewId}")
    @ResponseBody
    public ResponseEntity<Boolean> updateReview(
            @PathVariable Long reviewId,
            @RequestParam("rating") Integer rating,
            @RequestParam("title") String title,
            @RequestParam("content") String content) {
        try {
            ReviewDto review = new ReviewDto();
            review.setReviewId(reviewId);
            review.setRating(rating);
            review.setTitle(title);
            review.setContent(content);
            review.setReviewComment(content); // 기존 필드에도 설정

            boolean result = myPageService.updateReview(review);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    // 리뷰 삭제
    @DeleteMapping("/api/reviews/{reviewId}")
    @ResponseBody
    public ResponseEntity<Boolean> deleteReview(@PathVariable Long reviewId) {
        try {
            boolean result = myPageService.deleteReview(reviewId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    // 구매자 문의 내역 조회
    @GetMapping("/api/buyers/{userId}/inquiries")
    @ResponseBody
    public ResponseEntity<List<InquiryDto>> getBuyerInquiries(@PathVariable String userId) {
        try {
            List<InquiryDto> inquiries = myPageService.getBuyerInquiries(userId);
            return ResponseEntity.ok(inquiries);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    // 문의 종료
    @PutMapping("/api/inquiries/{inquiryId}/close")
    @ResponseBody
    public ResponseEntity<Boolean> closeInquiry(@PathVariable Long inquiryId) {
        try {
            boolean result = myPageService.closeInquiry(inquiryId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    // 구매자 경매 내역 조회
    @GetMapping("/api/buyers/{userId}/auctions")
    @ResponseBody
    public ResponseEntity<List<BidDto>> getBuyerAuctions(@PathVariable String userId) {
        try {
            List<BidDto> auctions = myPageService.getBuyerAuctions(userId);
            return ResponseEntity.ok(auctions);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    // 구매자 경매 내역 조회 (마이페이지 경로)
    @GetMapping("/buyers/{userId}/auctions")
    @ResponseBody
    public ResponseEntity<List<BidDto>> getBuyerAuctionsMyPage(@PathVariable String userId) {
        try {
            List<BidDto> auctions = myPageService.getBuyerAuctions(userId);
            return ResponseEntity.ok(auctions);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    // 구매자 입찰 내역 조회 (마이페이지 경로)
    @GetMapping("/buyer/{userId}/bids")
    @ResponseBody
    public ResponseEntity<List<BidDto>> getBuyerBidsMyPage(@PathVariable String userId) {
        try {
            List<BidDto> bids = myPageService.getBuyerBids(userId);
            return ResponseEntity.ok(bids);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    // 구매자 낙찰 내역 조회 (마이페이지 경로)
    @GetMapping("/buyer/{userId}/winning-bids")
    @ResponseBody
    public ResponseEntity<List<BidDto>> getWinningBidsMyPage(@PathVariable String userId) {
        try {
            List<BidDto> winningBids = myPageService.getWinningBids(userId);
            return ResponseEntity.ok(winningBids);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    // 구매자 낙찰상품 납부 대기 리스트 조회 (마이페이지 경로)
    @GetMapping("/buyer/{userId}/winning-auctions")
    @ResponseBody
    public ResponseEntity<List<BidDto>> getWinningAuctionsForPaymentMyPage(@PathVariable String userId) {
        try {
            System.out.println("=== 낙찰상품 조회 요청 ===");
            System.out.println("userId: " + userId);
            
            List<BidDto> winningAuctions = myPageService.getWinningAuctionsForPayment(userId);
            System.out.println("조회된 낙찰상품 수: " + winningAuctions.size());
            System.out.println("낙찰상품 목록: " + winningAuctions);
            
            return ResponseEntity.ok(winningAuctions);
        } catch (Exception e) {
            System.out.println("=== 낙찰상품 조회 오류: " + e.getMessage() + " ===");
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    // 경매 결제
    @PostMapping("/api/auctions/{auctionId}/payment")
    @ResponseBody
    public ResponseEntity<Boolean> processAuctionPayment(
            @PathVariable Long auctionId,
            @RequestBody Map<String, Object> paymentData) {
        try {
            String paymentMethod = (String) paymentData.get("paymentMethod");
            Double amount = Double.valueOf(paymentData.get("amount").toString());

            boolean result = myPageService.processAuctionPayment(auctionId, paymentMethod, amount);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    // 입찰 취소
    @PutMapping("/api/auctions/{auctionId}/cancel-bid")
    @ResponseBody
    public ResponseEntity<Boolean> cancelBid(@PathVariable Long auctionId) {
        try {
            boolean result = myPageService.cancelBid(auctionId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    // 구매자 장바구니 조회 (세션 기반)
    @GetMapping("/cart")
    @CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"}, allowCredentials = "true")
    @ResponseBody
    public ResponseEntity<List<CartDto>> getBuyerCartBySession(HttpSession session) {
        try {
            String userId = (String) session.getAttribute("LOGIN_ID");
            if (userId == null) {
                System.out.println("세션에 로그인 정보가 없습니다.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            
            System.out.println("=== 세션 기반 장바구니 조회 ===");
            System.out.println("세션에서 가져온 userId: " + userId);
            
            List<CartDto> cartItems = myPageService.getBuyerCart(userId);
            return ResponseEntity.ok(cartItems);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    // 장바구니에 상품 추가 (세션 기반)
    @PostMapping("/cart")
    @CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"}, allowCredentials = "true")
    @ResponseBody
    public ResponseEntity<Boolean> addToCartBySession(@RequestBody Map<String, Object> cartData, HttpSession session) {
        try {
            String userId = (String) session.getAttribute("LOGIN_ID");
            if (userId == null) {
                System.out.println("세션에 로그인 정보가 없습니다.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(false);
            }
            
            Long saleItemId = Long.valueOf(cartData.get("saleItemId").toString());
            Integer quantity = Integer.valueOf(cartData.get("quantity").toString());
            
            System.out.println("=== 세션 기반 장바구니 추가 ===");
            System.out.println("세션에서 가져온 userId: " + userId);
            System.out.println("saleItemId: " + saleItemId);
            System.out.println("quantity: " + quantity);
            
            boolean result = myPageService.addToCart(userId, saleItemId, quantity);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(false);
        }
    }

    // 구매자 장바구니 조회 (기존 - URL 파라미터 기반)
    @GetMapping("/api/buyers/{userId}/cart")
    @ResponseBody
    public ResponseEntity<List<CartDto>> getBuyerCart(@PathVariable String userId) {
        try {
            List<CartDto> cartItems = myPageService.getBuyerCart(userId);
            return ResponseEntity.ok(cartItems);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    // 장바구니 조회 (마이페이지 경로)
    @GetMapping("/{userType}/{userId}/cart")
    @ResponseBody
    public ResponseEntity<List<CartDto>> getCartMyPage(@PathVariable String userType, @PathVariable String userId) {
        try {
            List<CartDto> cartItems = myPageService.getBuyerCart(userId);
            return ResponseEntity.ok(cartItems);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    // 장바구니 총 금액 조회
    @GetMapping("/{userType}/{userId}/cart/total")
    @ResponseBody
    public ResponseEntity<Double> getCartTotal(@PathVariable String userType, @PathVariable String userId) {
        try {
            Double totalAmount = myPageService.getCartTotalAmount(userId);
            return ResponseEntity.ok(totalAmount);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    // 장바구니 수량 변경
    @PutMapping("/api/cart/{itemId}/quantity")
    @ResponseBody
    public ResponseEntity<Boolean> updateCartQuantity(
            @PathVariable Long itemId,
            @RequestBody Map<String, Object> quantityData) {
        try {
            Integer quantity = Integer.valueOf(quantityData.get("quantity").toString());
            // itemId에서 userId와 saleItemId를 추출하는 로직 필요
            // 현재는 임시로 userId를 "temp"로 설정
            String userId = "temp"; // 실제로는 itemId에서 추출 필요
            Long saleItemId = itemId; // 실제로는 itemId에서 추출 필요
            boolean result = myPageService.updateCartQuantity(userId, saleItemId, quantity);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    // OPTIONS 요청 처리 (CORS preflight)
    @RequestMapping(value = "/cart/{cartId}/quantity", method = RequestMethod.OPTIONS)
    @CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"}, allowCredentials = "true")
    public ResponseEntity<Void> handleOptionsRequest() {
        return ResponseEntity.ok().build();
    }

    // 장바구니 수량 변경 (마이페이지 경로)
    @PutMapping("/cart/{cartId}/quantity")
    @CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"}, allowCredentials = "true")
    @ResponseBody
    public ResponseEntity<Boolean> updateCartQuantityMyPage(
            @PathVariable Long cartId,
            @RequestBody Map<String, Integer> requestBody,
            HttpSession session) {
        try {
            // 세션에서 현재 사용자 ID 가져오기
            String userId = (String) session.getAttribute("LOGIN_ID");
            if (userId == null) {
                System.out.println("세션에 로그인 정보가 없습니다.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(false);
            }
            
            // cartId는 실제로는 saleItemId입니다 (프론트엔드에서 전달)
            Long saleItemId = cartId;
            Integer quantity = requestBody.get("quantity");
            
            System.out.println("장바구니 수량 변경 요청 - userId: " + userId + ", saleItemId: " + saleItemId + ", quantity: " + quantity);
            
            boolean result = myPageService.updateCartQuantity(userId, saleItemId, quantity);
            System.out.println("장바구니 수량 변경 결과: " + result);
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(false);
        }
    }

    // 장바구니 상품 삭제
    @DeleteMapping("/api/cart/{itemId}")
    @ResponseBody
    public ResponseEntity<Boolean> removeCartItem(@PathVariable Long itemId) {
        try {
            // itemId에서 userId와 saleItemId를 추출하는 로직 필요
            // 현재는 임시로 userId를 "temp"로 설정
            String userId = "temp"; // 실제로는 itemId에서 추출 필요
            Long saleItemId = itemId; // 실제로는 itemId에서 추출 필요
            boolean result = myPageService.removeCartItem(userId, saleItemId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    // OPTIONS 요청 처리 (CORS preflight) - 삭제
    @RequestMapping(value = "/cart/{cartId}", method = RequestMethod.OPTIONS)
    @CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"}, allowCredentials = "true")
    public ResponseEntity<Void> handleDeleteOptionsRequest() {
        return ResponseEntity.ok().build();
    }

    // 장바구니 상품 삭제 (마이페이지 경로)
    @DeleteMapping("/cart/{cartId}")
    @CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"}, allowCredentials = "true")
    @ResponseBody
    public ResponseEntity<Boolean> removeCartItemMyPage(@PathVariable Long cartId, HttpSession session) {
        try {
            System.out.println("=== 장바구니 삭제 API 호출 ===");
            System.out.println("cartId (saleItemId): " + cartId);
            System.out.println("세션 ID: " + session.getId());
            
            // 세션에서 현재 사용자 ID 가져오기
            String userId = (String) session.getAttribute("LOGIN_ID");
            System.out.println("세션에서 가져온 userId: " + userId);
            
            if (userId == null) {
                System.out.println("세션에 로그인 정보가 없습니다.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(false);
            }
            
            // cartId는 실제로는 saleItemId입니다 (프론트엔드에서 전달)
            Long saleItemId = cartId;
            
            System.out.println("장바구니 삭제 요청 - userId: " + userId + ", saleItemId: " + saleItemId);
            
            boolean result = myPageService.removeCartItem(userId, saleItemId);
            System.out.println("장바구니 삭제 결과: " + result);
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            System.out.println("=== 장바구니 삭제 API 오류 ===");
            e.printStackTrace();
            return ResponseEntity.badRequest().body(false);
        }
    }

    // OPTIONS 요청 처리 (CORS preflight) - 배치 삭제
    @RequestMapping(value = "/cart/batch-remove", method = RequestMethod.OPTIONS)
    @CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"}, allowCredentials = "true")
    public ResponseEntity<Void> handleBatchDeleteOptionsRequest() {
        return ResponseEntity.ok().build();
    }

    // 선택된 장바구니 상품들 삭제
    @DeleteMapping("/cart/batch-remove")
    @CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"}, allowCredentials = "true")
    @ResponseBody
    public ResponseEntity<Boolean> removeCartItems(@RequestBody Map<String, Object> removeData, HttpSession session) {
        try {
            // 세션에서 현재 사용자 ID 가져오기
            String userId = (String) session.getAttribute("LOGIN_ID");
            if (userId == null) {
                System.out.println("세션에 로그인 정보가 없습니다.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(false);
            }
            
            @SuppressWarnings("unchecked")
            List<Long> itemIds = (List<Long>) removeData.get("itemIds");
            
            System.out.println("장바구니 배치 삭제 요청 - userId: " + userId + ", itemIds: " + itemIds);
            
            boolean result = myPageService.removeCartItems(userId, itemIds);
            System.out.println("장바구니 배치 삭제 결과: " + result);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    // 장바구니 결제
    @PostMapping("/api/cart/checkout")
    @ResponseBody
    public ResponseEntity<Boolean> checkoutCart(@RequestBody Map<String, Object> checkoutData) {
        try {
            @SuppressWarnings("unchecked")
            List<Long> itemIds = (List<Long>) checkoutData.get("itemIds");
            Double totalAmount = Double.valueOf(checkoutData.get("totalAmount").toString());
            String paymentMethod = (String) checkoutData.get("paymentMethod");

            boolean result = myPageService.checkoutCart(itemIds, totalAmount, paymentMethod);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    // 판매자 정보 업데이트 API
    @PostMapping("/api/mypage/seller/update-info")
    @ResponseBody
    public ResponseEntity<?> updateSellerInfo(@RequestBody Map<String, Object> updateData, HttpSession session) {
        try {
            String userId = (String) session.getAttribute("LOGIN_ID");
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "로그인이 필요합니다."));
            }

            String businessNumber = (String) updateData.get("businessNumber");
            String specialty = (String) updateData.get("specialty");

            // MyPageService에 업데이트 메서드 호출
            boolean result = myPageService.updateSellerInfo(userId, businessNumber, specialty);

            if (result) {
                return ResponseEntity.ok(Map.of("message", "정보가 성공적으로 업데이트되었습니다."));
            } else {
                return ResponseEntity.badRequest().body(Map.of("message", "정보 업데이트에 실패했습니다."));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", "오류가 발생했습니다: " + e.getMessage()));
        }
    }

    // 예치금 입금 API
    @PostMapping("/buyer/deposit")
    @ResponseBody
    public ResponseEntity<?> depositAmount(@RequestBody Map<String, Object> depositData, HttpSession session) {
        try {
            System.out.println("=== 예치금 입금 API 호출됨 ===");
            System.out.println("요청 데이터: " + depositData);
            System.out.println("세션 ID: " + session.getId());
            
            String userId = (String) session.getAttribute("LOGIN_ID");
            System.out.println("세션에서 가져온 userId: " + userId);
            
            // 세션에서 userId를 가져올 수 없는 경우, 요청 데이터에서 직접 가져오기 (개발용)
            if (userId == null) {
                userId = (String) depositData.get("userId");
                System.out.println("요청 데이터에서 가져온 userId: " + userId);
            }
            
            if (userId == null) {
                System.out.println("로그인되지 않은 사용자");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "로그인이 필요합니다."));
            }

            Double amount = Double.valueOf(depositData.get("amount").toString());
            System.out.println("입금 금액: " + amount);
            
            if (amount <= 0) {
                System.out.println("잘못된 금액: " + amount);
                return ResponseEntity.badRequest().body(Map.of("message", "올바른 금액을 입력해주세요."));
            }

            // MyPageService에 예치금 업데이트 메서드 호출
            System.out.println("MyPageService.updateUserBalance 호출 시작");
            boolean result = myPageService.updateUserBalance(userId, amount);
            System.out.println("MyPageService.updateUserBalance 결과: " + result);

            if (result) {
                System.out.println("예치금 입금 성공");
                return ResponseEntity.ok(Map.of("message", "예치금이 성공적으로 입금되었습니다.", "amount", amount));
            } else {
                System.out.println("예치금 입금 실패");
                return ResponseEntity.badRequest().body(Map.of("message", "예치금 입금에 실패했습니다."));
            }
        } catch (Exception e) {
            System.out.println("=== 예치금 입금 API 오류 ===");
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", "오류가 발생했습니다: " + e.getMessage()));
        }
    }
}
