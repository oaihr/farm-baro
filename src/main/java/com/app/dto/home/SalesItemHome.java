package com.app.dto.home;

import java.util.List;

import lombok.Data;

@Data
public class SalesItemHome {

	int saleItemId;
	int qty;
	String saleStatus;
	String judgeKindName;
	String title;
	String description;
	String sellerId;
	//timestamp
	String cutName;
	int price;
	String weight;
	String grade;
	String traceabilityNum;
	String detailDescription;
	
	List<Image> images;
}
