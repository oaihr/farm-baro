package com.app.dao.sale;

import java.util.List;

import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.app.dto.sale.Review;

@Repository
public interface ReviewDAO {
	
	List<Review> getReviews(@Param("saleId") Integer saleId, @Param("limit") Integer limit, @Param("offset") Integer offset);
	Integer getReviewCount(Integer saleId);
	Review getReviewById(Integer userId);
}
