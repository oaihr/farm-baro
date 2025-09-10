package com.app.dto;

import lombok.Data;

@Data
public class CartDto {
    private String userId;          // user_id
    private Long saleItemId;        // sale_item_id
    private Integer quantity;       // quantity
    private String createdTime;     // created_time (Oracle TIMESTAMP(6) 형식)
    private String updatedTime;     // updated_time (Oracle TIMESTAMP(6) 형식)
    
    // JOIN 정보
    private String productTitle;    // sales.title
    private String productDescription; // sales.description
    private String sellerName;      // 판매자 이름 (현재 사용하지 않음)
    private Integer availableQty;   // sales.qty
    
    // 가격 정보 (MyBatis 매퍼에서 조회)
    private Double price;           // sales.price (단가)
    private Double totalPrice;      // quantity * price (총액)
    private Integer stock;          // sales.qty (재고)
    private String productType;     // sales.judge_kind_name
    private String cutType;         // sales.cut_name
    private String grade;           // sales.grade
    
    // 프론트엔드 호환성을 위한 추가 필드들
    private String title;           // productTitle과 동일 (프론트엔드 호환)
    private String description;     // productDescription과 동일 (프론트엔드 호환)
    private String category;        // productType과 동일 (프론트엔드 호환)
    private String productImageUrl; // 대표 이미지 URL
    private Long cartItemId;        // 프론트엔드에서 사용하는 ID (saleItemId와 동일)
}
