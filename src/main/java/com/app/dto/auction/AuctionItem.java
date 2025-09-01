package com.app.dto.auction;

import java.time.LocalDateTime;
import java.util.List;

import com.app.dto.sale.Image;

import lombok.Data;

@Data
public class AuctionItem {
	Integer auctionId;
	String title;
	String description;
	String auctionStatus;
	String judgeKindName;
	String kind;
	Integer initialPrice;
	Integer buyNowPrice;
	Integer currentBidPrice;
	Integer bidIncrement;
	LocalDateTime startDate;
	LocalDateTime endDate;
	String autoExtend;
	String sellerId;
	String grade;
	String userName;
	String weight;
	
	List<Image> images;
}
