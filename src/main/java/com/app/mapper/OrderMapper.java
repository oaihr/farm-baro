package com.app.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.app.dto.OrderDto;

@Mapper
public interface OrderMapper {
    
    // 구매자별 주문 목록 조회
    List<OrderDto> getOrdersByBuyer(@Param("buyerId") String buyerId);
    
    // 판매자별 주문 목록 조회
    List<OrderDto> getOrdersBySeller(@Param("sellerId") String sellerId);
    
    // 주문 상세 조회
    OrderDto getOrderById(@Param("saleOrderId") Long saleOrderId);
    
    // 주문 생성
    int insertOrder(OrderDto order);
    
    // 주문 상태 업데이트
    int updateOrderStatus(@Param("saleOrderId") Long saleOrderId, 
                         @Param("orderStatus") String orderStatus);
    
    // 주문 확정
    int confirmOrder(@Param("saleOrderId") Long saleOrderId);
    
    // 배송 현황 업데이트
    int updateDeliveryStatus(@Param("saleOrderId") Long saleOrderId, 
                            @Param("orderStatus") String orderStatus);
    
    // 주문 검색 (구매자)
    List<OrderDto> searchBuyerOrders(@Param("buyerId") String buyerId,
                                    @Param("orderStatus") String orderStatus);
    
    // 주문 검색 (판매자)
    List<OrderDto> searchSellerOrders(@Param("sellerId") String sellerId,
                                     @Param("orderStatus") String orderStatus,
                                     @Param("buyerName") String buyerName,
                                     @Param("buyerPhone") String buyerPhone);
}
