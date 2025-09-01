package com.app.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.app.dto.auction.AuctionItem;

public interface AuctionService {

	Page<AuctionItem> getAuctionPage(Pageable pageable, String kind);

}
