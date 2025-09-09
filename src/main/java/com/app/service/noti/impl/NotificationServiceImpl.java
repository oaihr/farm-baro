package com.app.service.noti.impl;

import java.util.List;

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
		List<NotificationDTO> result = notificationDAO.findByUserId(userId);
		return result;
	}

	@Override
	public int updateIsRead(Long notificationId) {
		int result = notificationDAO.updateIsRead(notificationId);
		return result;
	}

	@Override
	public String maxBidId(Integer auctionId, double currentMaxBid) {
		String result = notificationDAO.maxBidId(auctionId, currentMaxBid);
		return result;
	}
    
    
    
}
