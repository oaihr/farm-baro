package com.app.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

@Data
public class OrderDto {
    private Long saleOrderId;       // sale_order_id
    private String userId;          // user_id
    private String orderStatus;     // order_status
    	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private LocalDateTime orderDate; // order_date
    
    // order_sales_items 테이블 정보
    private Long saleItemId;        // sale_item_id
    private Integer orderQuantity;  // order_quantity
    private BigDecimal totalPrice;  // total_price
    
    // JOIN 정보
    private String productTitle;    // sales.title
    private String buyerName;       // users.user_name
    private String sellerName;      // 판매자 이름
    private List<String> productImages; // 상품 이미지들
}
