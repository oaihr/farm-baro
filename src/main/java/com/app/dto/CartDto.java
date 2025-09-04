package com.app.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

@Data
public class CartDto {
    private String userId;          // user_id
    private Long saleItemId;        // sale_item_id
    private Integer quantity;       // quantity
    	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private LocalDateTime createdTime; // created_time
	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private LocalDateTime updatedTime; // updated_time
    
    // JOIN 정보
    private String productTitle;    // sales.title
    private String productDescription; // sales.description
    private String sellerName;      // 판매자 이름
    private List<String> productImages; // 상품 이미지들
    private Integer availableQty;   // sales.qty
}
