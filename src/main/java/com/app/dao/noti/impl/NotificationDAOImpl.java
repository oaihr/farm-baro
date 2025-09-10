package com.app.dao.noti.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.management.Notification;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.app.dao.noti.NotificationDAO;
import com.app.dto.noti.NotificationDTO;

@Repository
public class NotificationDAOImpl implements NotificationDAO{

	@Autowired
	SqlSessionTemplate sqlSessionTemplate;
	
	@Override
	public int insertNotification(NotificationDTO notification) {
		int result = sqlSessionTemplate.insert("com.app.dao.NotificationDAO.insertNotification", notification);
		return result;
	}

	@Override
	public List<NotificationDTO> findByUserId(String userId) {
		List<NotificationDTO> result = sqlSessionTemplate.selectList("com.app.dao.NotificationDAO.findByUserId", userId);
		return result;
	}

	@Override
	public int updateIsRead(Long notificationId) {
		int result = sqlSessionTemplate.update("com.app.dao.NotificationDAO.updateIsRead", notificationId);
		return result;
	}

	@Override
	public String maxBidId(Integer auctionId, double currentMaxBid) {
		
		// Map에 두 매개변수를 key-value 형태로 담습니다.
	    Map<String, Object> params = new HashMap<>();
	    params.put("auctionId", auctionId);
	    params.put("currentMaxBid", currentMaxBid);
		
	    String result = sqlSessionTemplate.selectOne("com.app.dao.NotificationDAO.maxBidId", params);
		return result;
	}

	@Override
	public List<Notification> userNotiList(String userId) {
		List<Notification> result = sqlSessionTemplate.selectList("com.app.dao.NotificationDAO.userNotiList", userId);
		return result;
	}
	


}
