package com.app.dto.auction;

import java.time.LocalDateTime;
import java.util.List;

import com.app.dto.sale.Image;
import com.fasterxml.jackson.annotation.JsonFormat;

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
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
	LocalDateTime startDate;
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
	LocalDateTime endDate;
	String autoExtend;
	String sellerId;
	String grade;
	String userName;
	String weight;
	String traceabilityNum;
	String winnerId;
	
	List<Image> images;
}
