package com.app.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Data;

@Data
public class UserDto {
    private String id;           // ID (기본키)
    private String pw;           // 비밀번호
    private String email;        // 이메일
    private String address;      // 주소
    private String tel;          // 전화번호
    private String userName;     // 사용자 이름
    private String userType;     // 사용자 타입 (BUYER/SELLER)
    private String userStatus;   // 사용자 상태
    private String businessNumber; // 사업자 번호 (판매자용)
    	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private LocalDateTime createdTime; // 생성 시간
    private BigDecimal totalBalance;   // 총 잔액
    private BigDecimal bidDeposit;     // 입찰 보증금
    private String provider;     // 제공자
    private String providerId;   // 제공자 ID
}
