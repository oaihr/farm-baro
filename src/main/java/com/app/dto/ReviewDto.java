package com.app.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

@Data
public class ReviewDto {
    private Long reviewId;          // review_id
    private Long saleItemId;        // sale_item_id
    private String userId;          // user_id
    private Integer rating;         // rating (1~5)
    private String reviewComment;   // review_comment (기존 필드)
    private String title;           // 리뷰 제목
    private String content;         // 리뷰 내용 (reviewComment와 동일)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdTime; // created_time
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedTime; // updated_time
    
    // JOIN 정보
    private String productTitle;    // sales.title
    private String reviewerName;    // users.user_name
    private String sellerName;      // 판매자 이름
    private List<String> productImages; // 상품 이미지들
    
    // 리뷰 이미지 관련
    private List<String> reviewImages; // 리뷰 이미지 URL들
    private String sellerReply;     // 판매자 답글
}
