package com.app.dto.sale;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class Review {
	Integer reviewId;
	Integer saleItemId;
	String userId;
	String userName;
	Integer rating;
	String reviewComment;
	LocalDateTime updatedTime;
	Integer views;
	String title;
}
