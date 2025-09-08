package com.app.dao.auction;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.apache.ibatis.annotations.Param;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import com.app.dto.auction.AuctionItem;
import com.app.dto.auction.CurrentUser;

@Repository
public interface AuctionDAO {
	List<AuctionItem> getAuctionPage(@Param("pageable") Pageable pageable, @Param("kind") String kind, @Param("status") String status);
	
	long getAuctionCount(@Param("kind") String kind, @Param("status") String status);
	
	Optional<AuctionItem> getAuctionItem(Integer auctionId);
	
	Double getCurrentBidPrice(Integer auctionId);
	
	List<Integer> findExpiredAuctions(@Param("currentTime") LocalDateTime currentTime);
	
	Integer findLatestBidPrice(Integer auctionId);
	
	void updateAuctionStatusAndWinner(AuctionItem auctionItem);
	
	CurrentUser findByUserId(String userId);
}
