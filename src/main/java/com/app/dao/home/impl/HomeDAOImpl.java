package com.app.dao.home.impl;

import java.util.List;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.app.dao.home.HomeDAO;
import com.app.dto.home.AuctionItem;
import com.app.dto.home.SalesItem;

@Repository
public class HomeDAOImpl implements HomeDAO{
	
	@Autowired
	SqlSessionTemplate sqlSessionTemplate;

	@Override
	public List<AuctionItem> autionOnList() {
		List<AuctionItem> homeList = sqlSessionTemplate.selectList("home_mapper.getAuctionPage");
		return homeList;
	}

	@Override
	public List<SalesItem> getSalesPage() {
		List<SalesItem> salesList = sqlSessionTemplate.selectList("home_mapper.getSalesPage");
		return salesList;
	}

}
