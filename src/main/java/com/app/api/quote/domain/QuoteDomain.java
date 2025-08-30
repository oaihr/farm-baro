package com.app.api.quote.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@NoArgsConstructor(access = lombok.AccessLevel.PROTECTED)
@Table(name = "quote") // 데이터베이스 테이블 이름을 명시합니다.
public class QuoteDomain {
    @Id
    private String stand_ymd;

    private String grade_name;
    private String judge_kind_name;
    private String net_sale_price;
    private String max_price;
    private String min_price;
    private String unit;

    private String judge_kind;
    private String item_code;
    
    // Lombok의 @Builder를 사용하려면 생성자 이름이 클래스 이름과 같아야 합니다.
    @Builder
    public QuoteDomain(String stand_ymd, String grade_name, String judge_kind_name, String judge_kind, 
            String item_code, String net_sale_price, String max_price, String min_price, String unit) {
        this.stand_ymd = stand_ymd;
        this.grade_name = grade_name;
        this.judge_kind_name = judge_kind_name;
        this.judge_kind = judge_kind;
        this.item_code = item_code;
        this.net_sale_price = net_sale_price;
        this.max_price = max_price;
        this.min_price = min_price;
        this.unit = unit;
    }
}