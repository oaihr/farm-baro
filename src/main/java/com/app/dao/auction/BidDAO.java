package com.app.dao.auction;

import org.springframework.stereotype.Repository;

import com.app.dto.auction.Bid;
import com.app.dto.auction.BidMessage;

@Repository
public interface BidDAO {
	void saveBid(Bid newBid);
	void updatePreviousBidsToOutbid(Integer auctionId);
	BidMessage getLatestBid(Integer auctionId);
	
}
