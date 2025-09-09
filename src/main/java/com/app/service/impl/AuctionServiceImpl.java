package com.app.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.app.dao.auction.AuctionDAO;
import com.app.dao.auction.BidDAO;
import com.app.dto.auction.AuctionItem;
import com.app.dto.auction.BidMessage;
import com.app.dto.auction.CurrentUser;
import com.app.service.AuctionService;

@Service
public class AuctionServiceImpl implements AuctionService{
	
	@Autowired
	AuctionDAO auctionDAO;
	
	@Autowired
	BidDAO bidDAO;
	
	@Override
	public Page<AuctionItem> getAuctionPage(Pageable pageable, String kind, String status) {
		List<AuctionItem> auctionPage = auctionDAO.getAuctionPage(pageable, kind, status);
		
		long totalCount = auctionDAO.getAuctionCount(kind, status);
		
		return new PageImpl<>(auctionPage, pageable, totalCount);
	}

	@Override
	public Optional<AuctionItem> getAuctionItem(Integer auctionId) {
		
		Optional<AuctionItem> auctionItem = auctionDAO.getAuctionItem(auctionId);
		return auctionItem;
	}

	@Override
	public Double getCurrentBidPrice(Integer auctionId) {
		Double currentBidPrice = auctionDAO.getCurrentBidPrice(auctionId);
		return currentBidPrice;
	}

	@Override
	public List<BidMessage> getBidHistory(Integer auctionId) {
		List<BidMessage> bidHistory = bidDAO.getBidHistory(auctionId);
		return bidHistory;
	}

	@Override
	public void closeExpiredAuctions() {
		List<Integer> expiredAuctions = auctionDAO.findExpiredAuctions(LocalDateTime.now());

		if (expiredAuctions.isEmpty()) {
			System.out.println("마감할 경매가 없습니다.");
			return;
		}
		
		for (Integer auctionId : expiredAuctions) {
            System.out.println("경매 마감 처리 중: " + auctionId);
            
            // 최고 입찰자 및 입찰가 조회
            Double latestBidPrice = auctionDAO.getCurrentBidPrice(auctionId);
            String topBidderId = null;
            
            if (latestBidPrice != null) {
                // 최고 입찰자가 있을 경우
                topBidderId = bidDAO.findTopBidderId(auctionId);
            } 
            
            // 경매 상태 DB에 업데이트
            AuctionItem auctionItem = new AuctionItem();
            auctionItem.setAuctionId(auctionId);
            auctionItem.setAuctionStatus("OFF");
            auctionItem.setWinnerId(topBidderId);
            auctionDAO.updateAuctionStatusAndWinner(auctionItem);
            
            System.out.println("경매 마감 완료: " + auctionId);
        }		
	}

	@Override
	public CurrentUser findByUserId(String userId) {
		CurrentUser currentUser = auctionDAO.findByUserId(userId);
		return currentUser;
	}

}
