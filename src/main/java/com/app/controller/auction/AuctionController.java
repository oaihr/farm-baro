package com.app.controller.auction;

import java.util.List;
import java.util.Optional;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.app.dto.auction.AuctionItem;
import com.app.dto.auction.BidMessage;
import com.app.service.AuctionService;
import com.app.service.BidService;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class AuctionController {
	
	@Autowired
	AuctionService auctionService;
	@Autowired
	BidService bidService;
	
	@GetMapping("/api/auction")
	public Page<AuctionItem> getAuctionList(@RequestParam(defaultValue = "0") int page,
									  		@RequestParam(defaultValue = "12") int size,
									  		@RequestParam(required = false) String kind,
									  		@RequestParam(required = false) String status) {
		
		Pageable pageable = PageRequest.of(page, size);
		
		Page<AuctionItem> auctionPage = auctionService.getAuctionPage(pageable, kind, status);
		return auctionPage;
	}
	
	@GetMapping("/api/auction/detail/{auctionId}")
	public Optional<AuctionItem> getAuctionItem(@PathVariable Integer auctionId) {
		
		Optional<AuctionItem> auctionItem = auctionService.getAuctionItem(auctionId);
		return auctionItem;
	}
	
	@GetMapping("/api/auction/current-bid/{auctionId}")
	public ResponseEntity<Double> getCurrentBidPrice(@PathVariable Integer auctionId){
		Double currentBid = auctionService.getCurrentBidPrice(auctionId);
		return ResponseEntity.ok(currentBid);
	}
	
	@GetMapping("/api/auction/bid-history/{auctionId}")
	public List<BidMessage> getBidHistory(@PathVariable Integer auctionId){
		List<BidMessage> bidHistory = auctionService.getBidHistory(auctionId);
		return bidHistory;
	}
	
}

