package com.app.dao.auction;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import com.app.dto.auction.AuctionItem;

@Repository
public interface AuctionDAO {
	List<AuctionItem> getAuctionPage(@Param("pageable") Pageable pageable, @Param("kind") String kind);
	
	long getAuctionCount(@Param("kind") String kind);
}
