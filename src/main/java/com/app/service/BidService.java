package com.app.service;

import com.app.dto.auction.BidMessage;

public interface BidService {
	
	void saveBid(BidMessage bidMessage);
	
	BidMessage getLatestBid(Integer auctionId);
}
