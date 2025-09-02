package com.app.dto.sale;

import java.sql.Timestamp;
import java.util.List;

import lombok.Data;

@Data
public class SaleItem {
	Integer saleItemId;
	Integer qty;
	String judgeKindName;
	String title;
	String description;
	String sellerId;
	String cutName;
	String weight;
	Integer price;
	String grade;
	String userName;
	String traceabilityNum;

	List<Image> images;
}
