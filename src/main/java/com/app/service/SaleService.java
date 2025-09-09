package com.app.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.app.dto.sale.CartItemReq;
import com.app.dto.sale.Review;
import com.app.dto.sale.SaleItem;


public interface SaleService {
	
	Page<SaleItem> getSalePage(String kind, String part, Pageable pageable);
	SaleItem getSaleItem(Integer saleId);
	void addItemToCart(CartItemReq cartItem);
}
