package com.app.dao.home.impl;

import java.util.List;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.app.dao.home.HomeDAO;
import com.app.dto.home.AuctionItemHome;
import com.app.dto.home.SalesItemHome;

@Repository
public class HomeDAOImpl implements HomeDAO{
	
	@Autowired
	SqlSessionTemplate sqlSessionTemplate;

	@Override
	public List<AuctionItemHome> getAuctionPage() {
		List<AuctionItemHome> homeList = sqlSessionTemplate.selectList("home_mapper.getAuctionPage");
		return homeList;
	}

	@Override
	public List<SalesItemHome> getSalesPage() {
		List<SalesItemHome> salesList = sqlSessionTemplate.selectList("home_mapper.getSalesPage");
		return salesList;
	}

	@Override
	public List<AuctionItemHome> searchAuctions(String keyword) {
		List<AuctionItemHome> auctionList = sqlSessionTemplate.selectList("home_mapper.searchAuctions", keyword);
		return auctionList;
	}

	@Override
	public List<SalesItemHome> searchSales(String keyword) {
		List<SalesItemHome> salesList = sqlSessionTemplate.selectList("home_mapper.searchSales", keyword);
		return salesList;
	}

}
