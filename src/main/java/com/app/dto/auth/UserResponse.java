package com.app.dto.auth;

import java.time.LocalDateTime;

import com.app.domain.User;

import lombok.Data;

/**
 * 응답 DTO
 * - 절대 비밀번호 포함 금지
 * - 필요한 정보만 선택적으로 노출
 */
@Data
public class UserResponse {

    private String id;
    private String email;
    private String userName;
    private String tel;
    private String provider;      // (선택) 소셜로그인 공급자
    private LocalDateTime createdTime;

    public UserResponse() {}

    public UserResponse(String id, String email, String userName, String tel,
                        String provider, LocalDateTime createdTime) {
        this.id = id;
        this.email = email;
        this.userName = userName;
        this.tel = tel;
        this.provider = provider;
        this.createdTime = createdTime;
    }

    /** 도메인 → 응답 DTO 변환 편의 메서드 */
    public static UserResponse from(User u) {
        if (u == null) return null;
        return new UserResponse(
            u.getId(),
            u.getEmail(),
            u.getUserName(),
            u.getTel(),
            u.getProvider(),
            u.getCreatedTime()
        );
    }

    
}
