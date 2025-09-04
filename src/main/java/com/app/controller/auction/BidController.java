package com.app.controller.auction;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.app.dto.auction.BidMessage;
import com.app.service.BidService;

@Controller
public class BidController {
	
	@Autowired
	BidService bidService;
	
	@Autowired
    private SimpMessagingTemplate messagingTemplate;
	
	@MessageMapping("/bid")
	public void handleBid(BidMessage bidMessage) throws Exception{		
       
        // DB 저장 및 최고 입찰가 업데이트 + 클라이언트에 응답 (최종 입찰 정보)        
        List<BidMessage> bidHistory = bidService.processBidAndGetLatest(bidMessage);
        
        if (bidHistory != null && !bidHistory.isEmpty()) {
            messagingTemplate.convertAndSend("/topic/auction/" + bidHistory.get(0).getAuctionId(), bidHistory);
        } else {            
            System.out.println("입찰에 실패했습니다: 입찰 금액이 현재 최고가보다 낮거나 같습니다.");
        }
    }
}
