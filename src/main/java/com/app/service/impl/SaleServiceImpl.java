package com.app.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.app.dao.sale.SaleDAO;
import com.app.dto.sale.SaleItem;
import com.app.service.SaleService;

@Service
public class SaleServiceImpl implements SaleService{

	@Autowired
	SaleDAO saleDAO;

	@Override
	public Page<SaleItem> getSalePage(String kind, String part, Pageable pageable) {
		
		List<SaleItem> salePage = saleDAO.getSalePage(kind, part, pageable);
		
		long totalCount = saleDAO.getSaleCount(kind, part);
		
		return new PageImpl<>(salePage, pageable, totalCount);
	}

	@Override
	public SaleItem getSaleItem(Integer saleId) {
		SaleItem saleItem = saleDAO.getSaleItem(saleId);
		return saleItem;
	}
	
	

}
