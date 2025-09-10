package com.app.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.app.dto.ReviewDto;

@Mapper
public interface ReviewMapper {
    
    // 구매자별 리뷰 목록 조회
    List<ReviewDto> getReviewsByBuyer(@Param("buyerId") String buyerId);
    
    // 판매자별 리뷰 목록 조회
    List<ReviewDto> getReviewsBySeller(@Param("userId") String userId);
    
    // 상품별 리뷰 목록 조회 (판매자용)
    List<ReviewDto> getReviewsByProduct(@Param("productId") Long productId);
    
    // 리뷰 상세 조회
    ReviewDto getReviewById(@Param("reviewId") Long reviewId);
    
    // 리뷰 작성
    int insertReview(ReviewDto review);
    
    // 리뷰 수정
    int updateReview(ReviewDto review);
    
    // 리뷰 삭제
    int deleteReview(@Param("reviewId") Long reviewId);
    
    // 판매자 답글 작성
    int updateSellerReply(@Param("reviewId") Long reviewId,
                         @Param("sellerReply") String sellerReply);
    
    // 주문별 리뷰 존재 여부 확인
    ReviewDto getReviewByOrder(@Param("orderId") Long orderId);
}
