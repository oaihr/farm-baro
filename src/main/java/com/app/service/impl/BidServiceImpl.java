package com.app.service.impl;

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
	public void saveBid(BidMessage bidMessage) {
		
		AuctionItem auctionItem = auctionDAO.getAuctionItem(bidMessage.getAuctionId()).orElseThrow(() -> new IllegalArgumentException("유효하지 않은 경매 ID입니다."));
		
		double currentMaxBid = auctionItem.getCurrentBidPrice();
		
		if (bidMessage.getBidPrice() <= currentMaxBid) {
            throw new IllegalArgumentException("입찰 금액이 현재 최고 입찰가보다 낮거나 같습니다.");
        }
		
		// 이전 입찰 outbid로 변경
		bidDAO.updatePreviousBidsToOutbid(auctionItem.getAuctionId());
		
		// 새로운 입찰 정보 저장
		Bid newBid = new Bid();
		newBid.setAuctionId(auctionItem.getAuctionId()); 
        newBid.setUserId(bidMessage.getUserId());
        newBid.setBidPrice(bidMessage.getBidPrice());
        
        bidDAO.saveBid(newBid);
	}

	@Override
	public BidMessage getLatestBid(Integer auctionId) {
		BidMessage bidMessage = bidDAO.getLatestBid(auctionId);
		return bidMessage;
	}
	
	
}
