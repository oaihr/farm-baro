package com.app.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.app.dto.auction.AuctionItem;
import com.app.dto.auction.BidMessage;

public interface AuctionService {

	Page<AuctionItem> getAuctionPage(Pageable pageable, String kind, String status);
	
	Optional<AuctionItem> getAuctionItem(Integer auctionId);
	
	Double getCurrentBidPrice(Integer auctionId);
	
	List<BidMessage> getBidHistory(Integer auctionId);
	
	void closeExpiredAuctions();
}
