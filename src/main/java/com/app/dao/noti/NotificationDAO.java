package com.app.dao.noti;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.app.dto.noti.NotificationDTO;

@Mapper // 이 어노테이션이 있어야 Spring이 이 인터페이스를 MyBatis 매퍼로 인식합니다.
public interface NotificationDAO {
	
	// 알림 객체를 삽입합니다.
    int insertNotification(NotificationDTO notification);

	// 사용자 ID로 알림 목록을 조회합니다.
    List<NotificationDTO> getNotificationsByUserId(String userId);

	// 알림 ID로 is_read 상태를 'Y'로 업데이트합니다.
    int updateIsRead(Integer notificationId);
	
	// Map을 파라미터로 받아 최고 입찰자 ID를 조회합니다.
    String maxBidId(Map<String, Object> params);

	// 사용자별 알림 리스트를 불러옵니다.
    List<NotificationDTO> userNotiList(String userId);
}