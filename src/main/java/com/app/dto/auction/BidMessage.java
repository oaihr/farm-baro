package com.app.dto.auction;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class BidMessage {
	Integer auctionId;
	String userId;
	Integer bidPrice;
	LocalDateTime bidTime;
	String userName;
	Integer totalBids;
}
