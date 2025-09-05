package com.app.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Data;

@Data
public class ProductDto {
    private Long saleItemId;        // sale_item_id
    private Integer qty;            // qty (재고 수량)
    private String saleStatus;      // sale_status
    private String judgeKindName;   // judge_kind_name (beef, pork, chicken)
    private String cutName;         // cut_name (sirloin, tenderloin, rib, belly, neck, breast, leg, etc)
    private String title;           // title
    private String description;     // description (요약 설명)
    private String detailDescription; // detail_description (상세 설명)
    private String weight;          // weight (1개당 무게 + 단위, 예: "1kg", "500g")
    private String grade;           // grade (고기 등급: A, B, C 등)
    private String traceabilityNum; // traceability_num (가축 이력번호)
    private String sellerId;        // seller_id
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private LocalDateTime createdTime; // created_time
    private String sellerName;      // 판매자 이름 (JOIN용)
    private List<String> imageUrls; // 상품 이미지들
}
