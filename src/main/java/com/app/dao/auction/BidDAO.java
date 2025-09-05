package com.app.dao.auction;

import java.util.List;

import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.app.dto.auction.AuctionItem;
import com.app.dto.auction.Bid;
import com.app.dto.auction.BidMessage;

@Repository
public interface BidDAO {
	void saveBid(Bid newBid);
	void updatePreviousBidsToOutbid(Integer auctionId);
//	BidMessage getLatestBid(Integer auctionId);
	String getUserName(String userId);
	List<BidMessage> getBidHistory(Integer auctionId);
	void updateAuctionCurrentbid(Integer auctionId, Integer bidPrice);	
	String findTopBidderId(Integer auctionId);
}
