package com.app.service;

import java.util.List;

import com.app.dto.auction.BidMessage;

public interface BidService {
	
	List<BidMessage> processBidAndGetLatest(BidMessage bidMessage);
	
//	BidMessage getLatestBid(Integer auctionId);
	
}
