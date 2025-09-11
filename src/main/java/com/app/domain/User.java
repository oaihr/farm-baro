package com.app.domain;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.apache.ibatis.type.Alias;

import lombok.Data;

/**
 * USERS 테이블 도메인
 * - 금액 컬럼은 BigDecimal 권장
 * - createdTime: Oracle TIMESTAMP ↔ LocalDateTime 매핑 (MyBatis 3.5+ 가능)
 */
@Data
@Alias("User")
public class User implements Serializable {
  private static final long serialVersionUID = 1L;

  private String id;               // ID
  private String pw;               // 암호화된 비밀번호(BCrypt 등)
  private String email;
  private String address;
  private String tel;
  private String userName;         // USER_NAME
  private String userType;         // USER_TYPE (BUYER/SELLER/NULL)
  private String userStatus;       // USER_STATUS (ACTIVE/PENDING/...)
  private String businessNumber;   // BUSINESS_NUMBER

  private LocalDateTime createdTime;   // CREATED_TIME
  private BigDecimal totalBalance;     // NUMBER(10,2)
  private BigDecimal bidDeposit;       // NUMBER(10,2)

  private String provider;         // SNS 제공자 (KAKAO/NAVER/...)
  private String providerId;       // SNS 식별자
}
