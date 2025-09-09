package com.app.dto.sale;

import lombok.Data;

@Data
public class CartItemReq {
	String userId;
	Integer saleItemId;
	Integer quantity;
}
