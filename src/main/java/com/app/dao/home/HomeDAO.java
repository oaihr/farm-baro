package com.app.dao.home;

import java.util.List;

import com.app.dto.home.AuctionItem;
import com.app.dto.home.SalesItem;

public interface HomeDAO {

	List<AuctionItem> autionOnList();
	List<SalesItem> getSalesPage();
}
