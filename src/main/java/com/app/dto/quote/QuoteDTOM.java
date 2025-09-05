package com.app.dto.quote;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor(access = lombok.AccessLevel.PUBLIC)
public class QuoteDTOM {
	String standYm;
	String gradeName;
	String judgeKindName;
	String judgeKind;
	String itemName;
	String itemCode;
	String unit;
	String netSalePrice;
	String avgYearPrice;
	
	
    @Builder
    public QuoteDTOM(String stand_ym, String grade_name, String judge_kind_name, String judge_kind, 
    		String item_name,
            String item_code, String unit, String net_sale_price, String avg_year_price) {
        this.standYm = stand_ym;
        this.gradeName = grade_name;
        this.judgeKindName = judge_kind_name;
        this.judgeKind = judge_kind;
        this.itemName = item_name;
        this.itemCode = item_code;
        this.unit = unit;
        this.netSalePrice = net_sale_price;
        this.avgYearPrice = avg_year_price;
        
        
    }
}
