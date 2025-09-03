package com.app.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.app.dto.BidDto;
import com.app.dto.CartDto;
import com.app.dto.InquiryDto;
import com.app.dto.OrderDto;
import com.app.dto.ProductDto;
import com.app.dto.ReviewDto;
import com.app.dto.UserDto;
import com.app.service.MyPageService;

@Controller
@RequestMapping("/mypage")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"}, allowCredentials = "true")
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
	@GetMapping("/buyer/{buyerId}/orders")
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
	@GetMapping("/seller/{sellerId}/orders")
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
	@GetMapping("/buyer/{buyerId}/reviews")
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
	@GetMapping("/seller/{sellerId}/reviews")
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
	@GetMapping("/buyer/{buyerId}/inquiries")
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
	@GetMapping("/seller/{sellerId}/inquiries")
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
	@GetMapping("/buyer/{buyerId}/bids")
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
	@GetMapping("/buyer/{buyerId}/cart")
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
	@GetMapping("/seller/{sellerId}/products")
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
	@PutMapping("/api/reviews/{reviewId}/reply")
	@ResponseBody
	public ResponseEntity<Boolean> replyToReview(@PathVariable Long reviewId, @RequestParam String sellerReply) {
		try {
			boolean result = myPageService.replyToReview(reviewId, sellerReply);
			return ResponseEntity.ok(result);
		} catch (Exception e) {
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
	@PostMapping("/api/products")
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
			@RequestParam("grade") String grade,
			@RequestParam("traceabilityNum") String traceabilityNum,
			@RequestParam("sellerId") String sellerId,
			@RequestPart(value = "imageFiles", required = false) MultipartFile[] imageFiles) {
		
		System.out.println("=== 상품 등록 요청 받음 ===");
		System.out.println("title: " + title);
		System.out.println("judgeKindName: " + judgeKindName);
		System.out.println("cutName: " + cutName);
		System.out.println("qty: " + qty);
		System.out.println("saleStatus: " + saleStatus);
		System.out.println("description: " + description);
		System.out.println("detailDescription: " + detailDescription);
		System.out.println("weight: " + weight);
		System.out.println("grade: " + grade);
		System.out.println("traceabilityNum: " + traceabilityNum);
		System.out.println("sellerId: " + sellerId);
		System.out.println("imageFiles: " + (imageFiles != null ? imageFiles.length : 0) + "개");
		
		try {
			ProductDto product = new ProductDto();
			product.setTitle(title);
			product.setJudgeKindName(judgeKindName);
			product.setCutName(cutName);
			product.setQty(qty);
			product.setDescription(description);
			product.setDetailDescription(detailDescription);
			product.setWeight(weight);
			product.setGrade(grade);
			product.setTraceabilityNum(traceabilityNum);
			product.setSellerId(sellerId);
			product.setSaleStatus(saleStatus);
			
			// 이미지 파일들이 있으면 처리
			if (imageFiles != null && imageFiles.length > 0) {
				for (MultipartFile imageFile : imageFiles) {
					if (imageFile != null && !imageFile.isEmpty()) {
						// 이미지 파일명을 상품 정보에 저장
						String imageFileName = imageFile.getOriginalFilename();
						// TODO: 실제 파일 저장 로직 구현 필요
						// File uploadDir = new File("uploads/");
						// if (!uploadDir.exists()) uploadDir.mkdirs();
						// File dest = new File(uploadDir.getAbsolutePath() + File.separator + imageFileName);
						// imageFile.transferTo(dest);
					}
				}
			}
			
			boolean result = myPageService.registerProduct(product);
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

	// 상품 수정 API
	@PutMapping("/api/products/{productId}")
	@ResponseBody
	public ResponseEntity<Boolean> updateProduct(
			@PathVariable Long productId,
			@RequestParam("title") String title,
			@RequestParam("judgeKindName") String judgeKindName,
			@RequestParam("cutName") String cutName,
			@RequestParam("qty") Integer qty,
			@RequestParam("saleStatus") String saleStatus,
			@RequestParam("description") String description,
			@RequestParam("detailDescription") String detailDescription,
			@RequestParam("weight") String weight,
			@RequestParam("grade") String grade,
			@RequestParam("traceabilityNum") String traceabilityNum,
			@RequestPart(value = "imageFiles", required = false) MultipartFile[] imageFiles) {
		try {
			ProductDto product = new ProductDto();
			product.setSaleItemId(productId);
			product.setTitle(title);
			product.setJudgeKindName(judgeKindName);
			product.setCutName(cutName);
			product.setQty(qty);
			product.setSaleStatus(saleStatus);
			product.setDescription(description);
			product.setDetailDescription(detailDescription);
			product.setWeight(weight);
			product.setGrade(grade);
			product.setTraceabilityNum(traceabilityNum);
			
			// 이미지 파일들이 있으면 처리
			if (imageFiles != null && imageFiles.length > 0) {
				for (MultipartFile imageFile : imageFiles) {
					if (imageFile != null && !imageFile.isEmpty()) {
						// 이미지 파일명을 상품 정보에 저장
						String imageFileName = imageFile.getOriginalFilename();
						// TODO: 실제 파일 저장 로직 구현 필요
						// File uploadDir = new File("uploads/");
						// if (!uploadDir.exists()) uploadDir.mkdirs();
						// File dest = new File(uploadDir.getAbsolutePath() + File.separator + imageFileName);
						// imageFile.transferTo(dest);
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
	 @DeleteMapping("/api/products/{productId}")  // /mypage/api/products/{productId}에서 변경
    @ResponseBody
    public ResponseEntity<Boolean> deleteProduct(@PathVariable Long productId) {	try {
			boolean result = myPageService.deleteProduct(productId);
			return ResponseEntity.ok(result);
		} catch (Exception e) {
			return ResponseEntity.badRequest().build();
		}
	}
    // 판매자 상품 목록 조회 API
    @GetMapping("/api/mypage/seller/{sellerId}/products")
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

    // ==================== 구매자 마이페이지 API ====================

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

    // 구매자 주문 내역 조회
    @GetMapping("/api/buyers/{userId}/orders")
    @ResponseBody
    public ResponseEntity<List<OrderDto>> getBuyerOrders(@PathVariable String userId) {
        try {
            List<OrderDto> orders = myPageService.getBuyerOrders(userId);
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

    // 구매자 장바구니 조회
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

    // 선택된 장바구니 상품들 삭제
    @DeleteMapping("/api/cart/batch-remove")
    @ResponseBody
    public ResponseEntity<Boolean> removeCartItems(@RequestBody Map<String, Object> removeData) {
        try {
            @SuppressWarnings("unchecked")
            List<Long> itemIds = (List<Long>) removeData.get("itemIds");
            boolean result = myPageService.removeCartItems(itemIds);
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
}
