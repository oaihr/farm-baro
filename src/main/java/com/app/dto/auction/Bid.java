package com.app.dto.auction;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class Bid {
	Integer auctionId;
	Integer userId;
	Integer bidPrice;
}
