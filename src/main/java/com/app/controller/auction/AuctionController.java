package com.app.controller.auction;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.app.dto.auction.AuctionItem;
import com.app.service.AuctionService;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class AuctionController {
	
	@Autowired
	AuctionService auctionService;
	
	@GetMapping("/api/auction")
	public Page<AuctionItem> getAuctionList(@RequestParam(defaultValue = "0") int page,
									  		@RequestParam(defaultValue = "12") int size,
									  		@RequestParam(required = false) String kind) {
		
		Pageable pageable = PageRequest.of(page, size);
		
		Page<AuctionItem> auctionPage = auctionService.getAuctionPage(pageable, kind);
		return auctionPage;
	}
}
