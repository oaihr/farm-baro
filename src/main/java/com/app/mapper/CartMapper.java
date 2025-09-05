package com.app.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.app.dto.CartDto;

@Mapper
public interface CartMapper {
    
    // 구매자별 장바구니 목록 조회
    List<CartDto> getCartByBuyer(@Param("buyerId") String buyerId);
    
    // 장바구니 상품 상세 조회
    CartDto getCartItem(@Param("userId") String userId, @Param("saleItemId") Long saleItemId);
    
    // 장바구니에 상품 추가
    int insertCartItem(CartDto cart);
    
    // 장바구니 상품 수량 수정
    int updateCartQuantity(@Param("userId") String userId, 
                          @Param("saleItemId") Long saleItemId,
                          @Param("quantity") Integer quantity);
    
    // 장바구니 상품 삭제
    int deleteCartItem(@Param("userId") String userId, @Param("saleItemId") Long saleItemId);
    
    // 구매자 장바구니 전체 삭제
    int deleteAllCartItems(@Param("buyerId") String buyerId);
    
    // 장바구니 상품 존재 여부 확인
    CartDto checkCartItem(@Param("userId") String userId, 
                         @Param("saleItemId") Long saleItemId);
    
    // 장바구니 총 금액 계산
    Double getCartTotalAmount(@Param("buyerId") String buyerId);
}
