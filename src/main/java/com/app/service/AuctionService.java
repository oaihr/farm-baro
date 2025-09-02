package com.app.service;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.app.dto.auction.AuctionItem;

public interface AuctionService {

	Page<AuctionItem> getAuctionPage(Pageable pageable, String kind);
	
	Optional<AuctionItem> getAuctionItem(Integer auctionId);
}
