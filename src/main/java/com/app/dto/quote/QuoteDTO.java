package com.app.dto.quote;

import lombok.Data;

@Data
public class QuoteDTO {

	int id;
	String tradeDate;
	String itemName;
	int avg_price;

	public QuoteDTO(String date, String item, double price) {
		// TODO Auto-generated constructor stub
	}
}
