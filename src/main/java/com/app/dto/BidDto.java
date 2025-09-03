package com.app.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

@Data
public class BidDto {
    private Long bidId;             // bid_id
    private Long auctionId;         // auction_id
    private String userId;          // user_id
    private BigDecimal bidPrice;    // bid_price
    private String bidStatus;       // bid_status
    	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private LocalDateTime bidTime;  // bid_time
	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private LocalDateTime createdTime; // created_time
    
    // JOIN 정보
    private String auctionTitle;    // auctions.title
    private String bidderName;      // users.user_name
    	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private LocalDateTime auctionEndDate; // auctions.end_date
    private BigDecimal currentHighestBid; // 현재 최고 입찰가
    private Boolean isWinner;       // 낙찰 여부
}
