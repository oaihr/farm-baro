package com.app.controller.auction;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import com.app.dto.auction.BidMessage;
import com.app.service.BidService;

@Controller
public class BidController {
	
	@Autowired
	BidService bidService;
	
	@MessageMapping("/bid")
	@SendTo("/topic/auction/{auctionId}")
	public BidMessage handleBid(BidMessage bidMessage) throws Exception{
		
        
        if (bidMessage.getBidPrice() <= 0) {           
            throw new IllegalArgumentException("입찰 금액은 0보다 커야 합니다.");
        }
        
        // DB 저장 및 최고 입찰가 업데이트
        bidService.saveBid(bidMessage);
        
        // 클라이언트에 응답 (최종 입찰 정보)        
        BidMessage latestBid = bidService.getLatestBid(bidMessage.getAuctionId());
        
        // @SendTo 어노테이션에 따라 /topic/auction/{auctionId}로 메시지 전송
        return latestBid;
    }
}
