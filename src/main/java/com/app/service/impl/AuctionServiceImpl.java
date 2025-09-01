package com.app.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.app.dao.auction.AuctionDAO;
import com.app.dto.auction.AuctionItem;
import com.app.service.AuctionService;

@Service
public class AuctionServiceImpl implements AuctionService{
	
	@Autowired
	AuctionDAO auctionDAO;
	
	@Override
	public Page<AuctionItem> getAuctionPage(Pageable pageable, String kind) {
		List<AuctionItem> auctionPage = auctionDAO.getAuctionPage(pageable, kind);
		
		long totalCount = auctionDAO.getAuctionCount(kind);
		
		return new PageImpl<>(auctionPage, pageable, totalCount);
	}

}
