package com.app.mapper;

import com.app.dto.InquiryDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface InquiryMapper {
    
    // 구매자별 문의 목록 조회
    List<InquiryDto> getInquiriesByBuyer(@Param("buyerId") String buyerId);
    
    // 상품별 문의 목록 조회 (판매자용)
    List<InquiryDto> getInquiriesByProduct(@Param("productId") Long productId);
    
    // 문의 상세 조회
    InquiryDto getInquiryById(@Param("inquiryId") Long inquiryId);
    
    // 문의 작성
    int insertInquiry(InquiryDto inquiry);
    
    // 문의 수정
    int updateInquiry(InquiryDto inquiry);
    
    // 문의 삭제
    int deleteInquiry(@Param("inquiryId") Long inquiryId);
    
    // 판매자 답변 작성
    int updateSellerReply(@Param("inquiryId") Long inquiryId,
                         @Param("sellerReply") String sellerReply);
    
    // 문의 상태 업데이트
    int updateInquiryStatus(@Param("inquiryId") Long inquiryId,
                           @Param("status") String status);
}
