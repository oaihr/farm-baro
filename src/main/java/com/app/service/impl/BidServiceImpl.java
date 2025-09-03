package com.app.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.app.dao.auction.AuctionDAO;
import com.app.dao.auction.BidDAO;
import com.app.dto.auction.AuctionItem;
import com.app.dto.auction.Bid;
import com.app.dto.auction.BidMessage;
import com.app.service.BidService;

@Service
public class BidServiceImpl implements BidService{
	
	@Autowired
	BidDAO bidDAO;
	
	@Autowired
	AuctionDAO auctionDAO;
	
	@Override
	@Transactional
	public List<BidMessage> processBidAndGetLatest(BidMessage bidMessage) {
		
		AuctionItem auctionItem = auctionDAO.getAuctionItem(bidMessage.getAuctionId()).orElseThrow(() -> new IllegalArgumentException("유효하지 않은 경매 ID입니다."));
		
		double currentMaxBid = auctionItem.getCurrentBidPrice();
		
		if (bidMessage.getBidPrice() <= currentMaxBid) {
            return null;
        }
		
		LocalDateTime currentBidTime = LocalDateTime.now();
		
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
        
//        String userName = bidDAO.getUserName(bidMessage.getUserId());
//        
//        bidMessage.setBidTime(currentBidTime);
//        bidMessage.setUserName(userName);
        
        List<BidMessage> bidHistory = bidDAO.getBidHistory(auctionItem.getAuctionId());
        return bidHistory;
	}

//	@Override
//	public BidMessage getLatestBid(Integer auctionId) {
//		return null;
//	}
	
	
}
