package com.app.service.home.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.app.dao.home.HomeDAO;
import com.app.dto.home.AuctionItemHome;
import com.app.dto.home.SalesItemHome;
import com.app.service.home.HomeService;

@Service
public class HomeServiceImpl implements HomeService{
	
	@Autowired
	HomeDAO homeDAO;

	@Override
	public List<AuctionItemHome> getAuctionPage() {
		List<AuctionItemHome> homeList = homeDAO.getAuctionPage();
		return homeList;
	}

	@Override
	public List<SalesItemHome> getSalesPage() {
		List<SalesItemHome> salesList = homeDAO.getSalesPage();
		return salesList;
	}

	@Override
	public List<AuctionItemHome> searchAuctions(String keyword) {
		List<AuctionItemHome> auctionList = homeDAO.searchAuctions(keyword);
		return auctionList;
	}

	@Override
	public List<SalesItemHome> searchSales(String keyword) {
		List<SalesItemHome> salesList = homeDAO.searchSales(keyword);
		return salesList;
	}


}
