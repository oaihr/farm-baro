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
                "다른 입찰자가 더 높은 가격으로 입찰하였습니다.현재 입찰가는 [" + bidMessage.getBidPrice() + "원] 입니다.",
                auctionItem.getAuctionId()
            );
        }
                
        // 알림 전송 후, 입찰 내역 반환
        
        List<BidMessage> bidHistory = bidDAO.getBidHistory(auctionItem.getAuctionId());
        return bidHistory;
	}

}
