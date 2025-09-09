package com.app.dao.sale;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import com.app.dto.sale.CartItemReq;
import com.app.dto.sale.Review;
import com.app.dto.sale.SaleItem;

@Repository
public interface SaleDAO {
	
	List<SaleItem> getSalePage(@Param("kind") String kind, @Param("part") String part, @Param("pageable") Pageable pageable);
	
	long getSaleCount(@Param("kind") String kind, @Param("part") String part);
	
	SaleItem getSaleItem(Integer saleId);	
	
	void addItemToCart(CartItemReq cartItem);
}
