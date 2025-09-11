package com.app.dto.noti;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class NotificationDTO {
    Integer notificationId;
    String userId;
    String type;
    String message;
    Integer relatedId;
    String isRead; // 또는 boolean 타입
    LocalDateTime createdTime;
    
    String title;
}
