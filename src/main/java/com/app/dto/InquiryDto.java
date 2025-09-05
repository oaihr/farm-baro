package com.app.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

@Data
public class InquiryDto {
    private Long qnaId;             // qna_id
    private Long productId;         // product_id
    private String productType;     // product_type
    private String questionUserId;  // question_user_id
    private String questionContent; // question_content
    private String replyContent;    // reply_content
    private String replyId;         // reply_id
    private String isAnswered;      // is_answered (Y/N) (기존 필드)
    private String status;          // 문의 상태 (PENDING, ANSWERED, CLOSED)
    	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private LocalDateTime createdTime; // created_time
	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private LocalDateTime updatedTime; // updated_time
    
    // JOIN 정보
    private String productTitle;    // 상품 제목
    private String questionerName;  // 질문자 이름
    private String replierName;     // 답변자 이름
    private List<String> productImages; // 상품 이미지들
}
