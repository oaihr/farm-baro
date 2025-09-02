package com.app.dto.auction;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class BidMessage {
	Integer auctionId;
	Integer userId;
	Integer bidPrice;
	LocalDateTime bidTime;
	String userName;
}
