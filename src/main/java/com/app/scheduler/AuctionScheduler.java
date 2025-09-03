package com.app.scheduler;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class AuctionScheduler {
	
	@Scheduled(cron = "0 * * * * *")
	public void closeExpiredAuctions() {
		
	}
}
