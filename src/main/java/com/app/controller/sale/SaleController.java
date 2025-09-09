package com.app.controller.sale;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.app.dto.sale.CartItemReq;
import com.app.dto.sale.Review;
import com.app.dto.sale.SaleItem;
import com.app.service.ReviewService;
import com.app.service.SaleService;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class SaleController {
	
	@Autowired
	SaleService saleService;
	
	@Autowired
	ReviewService reviewService;
	
	@GetMapping("/api/sale/{kind}/{part}")
	public Page<SaleItem> getSaleList(@PathVariable String kind, 
									  @PathVariable String part,
									  @RequestParam(defaultValue = "0") int page,
									  @RequestParam(defaultValue = "12") int size) {
		
		Pageable pageable = PageRequest.of(page, size);
		
		Page<SaleItem> salePage = saleService.getSalePage(kind, part, pageable);
		return salePage;
	}
	
	@GetMapping("/api/sale/detail/{saleId}")
	public SaleItem getSaleItem(@PathVariable Integer saleId) {
		
		SaleItem saleItem = saleService.getSaleItem(saleId);
		return saleItem;
	}
	
	@GetMapping("/api/reviews")
	public Page<Review> getReviews(
			 	@RequestParam("saleId") int saleId,
	            @RequestParam(value = "page", defaultValue = "1") int page,
	            @RequestParam(value = "size", defaultValue = "10") int size){
		
		Pageable pageable = PageRequest.of(page, size, Sort.by("createdTime").descending());
        
        return reviewService.getReviews(saleId, pageable);
	}
	
	@GetMapping("/api/review/{reviewId}")
	public Review getReviewById(@PathVariable Integer reviewId) {
		Review review = reviewService.getReviewById(reviewId);
		return review;
	}
	
	@PostMapping("/api/cart/add")
	public void addItemToCart(@RequestBody CartItemReq cartItem){
		System.out.println("Received userId: " + cartItem.getUserId());
		saleService.addItemToCart(cartItem);
	}
	
}
