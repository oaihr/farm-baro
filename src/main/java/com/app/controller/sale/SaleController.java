package com.app.controller.sale;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.app.dto.sale.SaleItem;
import com.app.service.SaleService;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class SaleController {
	
	@Autowired
	SaleService saleService;
	
	@GetMapping("/api/meat/{kind}/{part}")
	public Page<SaleItem> getSaleList(@PathVariable String kind, 
									  @PathVariable String part,
									  @RequestParam(defaultValue = "0") int page,
									  @RequestParam(defaultValue = "12") int size) {
		
		Pageable pageable = PageRequest.of(page, size);
		
//		List<SaleItem> saleList = saleService.getSaleList(kind, part);
		Page<SaleItem> salePage = saleService.getSalePage(kind, part, pageable);
		return salePage;
	}
}
