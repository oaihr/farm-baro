package com.app.service.home.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.app.dao.home.HomeDAO;
import com.app.dto.home.AuctionItem;
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

}
