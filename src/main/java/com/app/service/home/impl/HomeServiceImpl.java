package com.app.service.home.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.app.dao.home.HomeDAO;
import com.app.dto.home.AuctionItem;
import com.app.dto.home.SalesItem;
import com.app.service.home.HomeService;

@Service
public class HomeServiceImpl implements HomeService{
	
	@Autowired
	HomeDAO homeDAO;

	@Override
	public List<AuctionItem> autionOnList() {
		List<AuctionItem> homeList = homeDAO.autionOnList();
		return homeList;
	}

	@Override
	public List<SalesItem> getSalesPage() {
		List<SalesItem> salesList = homeDAO.getSalesPage();
		return salesList;
	}

	@Override
	public List<AuctionItem> searchAuctions(String keyword) {
		List<AuctionItem> auctionList = homeDAO.searchAuctions(keyword);
		return auctionList;
	}

	@Override
	public List<SalesItem> searchSales(String keyword) {
		List<SalesItem> salesList = homeDAO.searchSales(keyword);
		return salesList;
	}

}
