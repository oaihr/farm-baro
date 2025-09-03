package com.app.scheduler;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.app.dao.auction.AuctionDAO;
import com.app.dao.auction.BidDAO;
import com.app.dto.auction.AuctionItem;
import com.app.service.AuctionService;

@Component
public class AuctionScheduler {
	
	@Autowired
	private AuctionService auctionService;
    
    
	@Scheduled(cron = "0 * * * * *")
	public void closeExpiredAuctions() {
		System.out.println("경매 마감 스케줄러 실행: " + LocalDateTime.now());
		auctionService.closeExpiredAuctions();
	}
}
