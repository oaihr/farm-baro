package com.app.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.app.dao.auction.AuctionDAO;
import com.app.dao.auction.BidDAO;
import com.app.dto.auction.AuctionItem;
import com.app.dto.auction.Bid;
import com.app.dto.auction.BidMessage;
import com.app.dto.noti.WebSocketMessage;
import com.app.service.BidService;
import com.app.service.noti.NotificationService;

@Service
public class BidServiceImpl implements BidService{
	
	@Autowired
	BidDAO bidDAO;
	
	@Autowired
	AuctionDAO auctionDAO;
	
    // 알림 서비스 주입
    @Autowired
    NotificationService notificationService;
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
	@Override
	@Transactional
	public List<BidMessage> processBidAndGetLatest(BidMessage bidMessage) {
		
		AuctionItem auctionItem = auctionDAO.getAuctionItem(bidMessage.getAuctionId()).orElseThrow(() -> new IllegalArgumentException("유효하지 않은 경매 ID입니다."));
		
		double currentMaxBid = auctionItem.getCurrentBidPrice();
		
		if (bidMessage.getBidPrice() <= currentMaxBid) {
            return null;
        }
		
		LocalDateTime currentBidTime = LocalDateTime.now();
		
		Integer auctionId = bidMessage.getAuctionId();
		
		// 🚨 기존 최고 입찰자 정보를 가져옴 (알림을 위해) -> DTO 말고 mapper에서 가져와야할듯(최고 입찰자 id)
        String previousMaxBidderId = notificationService.maxBidId(auctionId, currentMaxBid);
        
		
		// 이전 입찰 outbid로 변경
		bidDAO.updatePreviousBidsToOutbid(auctionItem.getAuctionId());
		
		// 경매 현재 입찰가 업데이트
		bidDAO.updateAuctionCurrentbid(auctionItem.getAuctionId(), bidMessage.getBidPrice());
		
		// 새로운 입찰 정보 저장
		Bid newBid = new Bid();
		newBid.setAuctionId(auctionItem.getAuctionId()); 
        newBid.setUserId(bidMessage.getUserId());
        newBid.setBidPrice(bidMessage.getBidPrice());
        newBid.setBidTime(currentBidTime);
        
        bidDAO.saveBid(newBid);
        
     // --- 알림 기능 추가 ---
        // 1. 새로운 최고 입찰자에게 성공 알림 전송
        notificationService.sendNotification(
            bidMessage.getUserId(),
            "입찰 성공",
            "축하합니다! 최고가 입찰자가 되셨습니다.",
            auctionItem.getAuctionId()
        );

        // 2. 이전 최고 입찰자에게 패찰 알림 전송
        if (previousMaxBidderId != null && !previousMaxBidderId.equals(bidMessage.getUserId())) {
            notificationService.sendNotification(
                previousMaxBidderId,
                "입찰 실패",
                "아쉽게도 최고가 입찰 지위를 잃으셨습니다.",
                auctionItem.getAuctionId()
            );
        }

     // --- 💡 웹소켓을 통한 실시간 알림 전송 ---
        // 모든 경매 참여자에게 최신 입찰 정보를 실시간으로 업데이트
        // 이 메시지는 프론트엔드에서 입찰 현황을 갱신하는 데 사용됩니다.
        WebSocketMessage updateMessage = new WebSocketMessage(
            "auction_update", 
            "새로운 입찰이 발생했습니다.",
            auctionItem.getAuctionId(),
            bidMessage.getBidPrice()
        );
        
        // 💡 messagingTemplate을 사용해 '/topic/auction/{id}' 채널로 메시지 전송
        messagingTemplate.convertAndSend(
            "/topic/auction/" + auctionItem.getAuctionId(),
            updateMessage
        );
        
        // 알림 전송 후, 입찰 내역 반환
        
        List<BidMessage> bidHistory = bidDAO.getBidHistory(auctionItem.getAuctionId());
        return bidHistory;
	}


	
	
}
