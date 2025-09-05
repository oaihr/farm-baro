package com.app.dto.quote;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor(access = lombok.AccessLevel.PUBLIC)
public class QuoteDTO {
	String standYmd;
	String gradeName;
	String judgeKindName;
	String judgeKind;
	String itemName;
	String itemCode;
	String netSalePrice;
	String maxPrice;
	String minPrice;
	String unit;
	
    @Builder
    public QuoteDTO(String stand_ymd, String grade_name, String judge_kind_name, String judge_kind, 
    		String item_name,
            String item_code, String net_sale_price, String max_price, String min_price, String unit) {
        this.standYmd = stand_ymd;
        this.gradeName = grade_name;
        this.judgeKindName = judge_kind_name;
        this.judgeKind = judge_kind;
        this.itemName = item_name;
        this.itemCode = item_code;
        this.netSalePrice = net_sale_price;
        this.maxPrice = max_price;
        this.minPrice = min_price;
        this.unit = unit;
    }

}
