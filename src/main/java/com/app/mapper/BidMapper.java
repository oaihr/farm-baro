package com.app.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.app.dto.BidDto;

@Mapper
public interface BidMapper {
    
    // 구매자별 입찰 목록 조회
    List<BidDto> getBidsByBidder(@Param("bidderId") String bidderId);
    
    // 경매별 입찰 목록 조회
    List<BidDto> getBidsByAuction(@Param("auctionId") Long auctionId);
    
    // 입찰 상세 조회
    BidDto getBidById(@Param("bidId") Long bidId);
    
    // 입찰 생성
    int insertBid(BidDto bid);
    
    // 입찰 수정
    int updateBid(BidDto bid);
    
    // 입찰 삭제
    int deleteBid(@Param("bidId") Long bidId);
    
    // 최고 입찰가 조회
    BidDto getHighestBid(@Param("auctionId") Long auctionId);
    
    // 낙찰자 설정
    int setWinner(@Param("bidId") Long bidId);
    
    // 낙찰자 해제
    int unsetWinner(@Param("auctionId") Long auctionId);
    
    // 구매자별 낙찰 상품 조회
    List<BidDto> getWinningBids(@Param("bidderId") String bidderId);
    
    // 구매자별 낙찰상품 납부 대기 리스트 조회 (AUCTIONS 테이블의 WINNER_ID 기준)
    List<BidDto> getWinningAuctionsForPayment(@Param("winnerId") String winnerId);
}
