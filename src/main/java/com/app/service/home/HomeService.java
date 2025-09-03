package com.app.service.home;

import java.util.List;

import com.app.dto.home.AuctionItem;
import com.app.dto.home.SalesItem;

public interface HomeService {

	List<AuctionItem> autionOnList();
	List<SalesItem> getSalesPage();
	
	List<AuctionItem> searchAuctions(String keyword);
	List<SalesItem> searchSales(String keyword);
}
