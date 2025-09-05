package com.app.mapper;

import com.app.dto.BidDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

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
}
