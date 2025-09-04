package com.app.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.app.dto.sale.Review;

public interface ReviewService {
	Page<Review> getReviews(int saleId, Pageable pageable);
	Review getReviewById(Integer userId);
	
}
