package com.app.dto.quote;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor(access = lombok.AccessLevel.PUBLIC)
public class QuoteDTO {
	String stand_ymd;
	String grade_name;
	String judge_kind_name;
	String judge_kind;
	String item_name;
	String item_code;
	String net_sale_price;
	String max_price;
	String min_price;
	String unit;
	
    @Builder
    public QuoteDTO(String stand_ymd, String grade_name, String judge_kind_name, String judge_kind, 
//    		String item_name,
            String item_code, String net_sale_price, String max_price, String min_price, String unit) {
        this.stand_ymd = stand_ymd;
        this.grade_name = grade_name;
        this.judge_kind_name = judge_kind_name;
        this.judge_kind = judge_kind;
//        this.item_name = item_name;
        this.item_code = item_code;
        this.net_sale_price = net_sale_price;
        this.max_price = max_price;
        this.min_price = min_price;
        this.unit = unit;
    }

}
