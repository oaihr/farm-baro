package com.app.service.noti.impl;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.app.dao.noti.NotificationDAO;
import com.app.dto.noti.NotificationDTO;
import com.app.service.noti.NotificationService;

@Service
public class NotificationServiceImpl implements NotificationService{
    
	@Autowired
    private NotificationDAO notificationDAO;
	

	@Override
	public int insertNotification(NotificationDTO notification) {
		int result = notificationDAO.insertNotification(notification);
		return result;
	}

	@Override
	public List<NotificationDTO> findByUserId(String userId) {
		List<NotificationDTO> result = notificationDAO.getNotificationsByUserId(userId);
		return result;
	}

	@Override
	public int updateIsRead(Integer notificationId) {
		int result = notificationDAO.updateIsRead(notificationId);
		return result;
	}

	@Override
	public String maxBidId(Integer auctionId, double currentMaxBid) {
		
		Map<String, Object> params = new HashMap<>();
        params.put("auctionId", auctionId);
        params.put("currentMaxBid", currentMaxBid);
        
		String result = notificationDAO.maxBidId(params);
		return result;
	}

    @Override
    public void sendNotification(String userId, String type, String message, Integer relatedId) {
        // 1. DTO 객체 생성 및 데이터 설정
        NotificationDTO notification = new NotificationDTO();
        notification.setUserId(userId);
        notification.setType(type);
        notification.setMessage(message);
        notification.setRelatedId(relatedId);
        notification.setIsRead("N");
        notification.setCreatedTime(LocalDateTime.now());

        // 2. DAO를 호출해 데이터베이스에 저장
        notificationDAO.insertNotification(notification);
    }

	@Override
	public List<NotificationDTO> userNotiList(String userId) {
		return notificationDAO.userNotiList(userId);
	}


    
    
}
