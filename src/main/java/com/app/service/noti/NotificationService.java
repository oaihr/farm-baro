package com.app.service.noti;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.app.dto.noti.NotificationDTO;

public interface NotificationService {

    // 알림을 데이터베이스에 저장
    int insertNotification(NotificationDTO notification);

    // 특정 사용자의 알림 목록을 가져옴
    List<NotificationDTO> findByUserId(@Param("userId") String userId);

    // 알림을 읽음 처리
    int updateIsRead(@Param("notificationId") Long notificationId);
    
    //현재 최고 입찰자 정보
    String maxBidId(Integer auctionId, double currentMaxBid);
    
    void sendNotification(String userId, String type, String message, Integer integer);
    
}