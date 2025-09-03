package com.app.service.impl;

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
import com.app.service.AuctionService;

@Service
public class AuctionServiceImpl implements AuctionService{
	
	@Autowired
	AuctionDAO auctionDAO;
	
	@Autowired
	BidDAO bidDAO;
	
	@Override
	public Page<AuctionItem> getAuctionPage(Pageable pageable, String kind) {
		List<AuctionItem> auctionPage = auctionDAO.getAuctionPage(pageable, kind);
		
		long totalCount = auctionDAO.getAuctionCount(kind);
		
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

}
