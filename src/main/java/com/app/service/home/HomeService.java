package com.app.service.home;

import java.util.List;

import com.app.dto.home.AuctionItemHome;
import com.app.dto.home.SalesItemHome;
import com.app.dto.home.UserHome;

public interface HomeService {

	List<AuctionItemHome> getAuctionPage();
	List<SalesItemHome> getSalesPage();
	
	List<AuctionItemHome> searchAuctions(String keyword);
	List<SalesItemHome> searchSales(String keyword);
	
	UserHome findUserIdOfSession(String session);
}
