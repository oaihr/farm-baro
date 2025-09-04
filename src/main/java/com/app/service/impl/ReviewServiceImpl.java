package com.app.service.impl;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.app.dao.sale.ReviewDAO;
import com.app.dto.sale.Review;
import com.app.service.ReviewService;

@Service
public class ReviewServiceImpl implements ReviewService{	

	@Autowired
	ReviewDAO reviewDAO;
	
	@Override
	public Page<Review> getReviews(int saleId, Pageable pageable) {
		List<Review> reviews = reviewDAO.getReviews(saleId, pageable.getPageSize(), (int) pageable.getOffset());
		long totalReviews = reviewDAO.getReviewCount(saleId);
		
	    return new PageImpl<>(reviews, pageable, totalReviews);
	}
	
	public Review getReviewById(Integer userId) {
		Review review = reviewDAO.getReviewById(userId);
		return review;
	}
}
