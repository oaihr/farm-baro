package com.app.domain;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDateTime;

import org.apache.ibatis.type.Alias;

import lombok.Data;



/**
 * USERS 테이블 VO
 *  - PW: 평문이 아니라 BCrypt 해시 저장
 *  - SNS 로그인은 provider/providerId 사용
 */

@Data
@Alias("User")
public class User {
	  private String id;               // ID (VARCHAR2)
	  private String pw;               // 암호화된 비밀번호
	  private String email;
	  private String address;
	  private String tel;
	  private String userName;         // USER_NAME
	  private String userType;         // USER_TYPE
	  private String userStatus;       // USER_STATUS
	  private String businessNumber;   // BUSINESS_NUMBER
	  private LocalDateTime createdTime;
	  private Double totalBalance; // NUMBER(10,2)
	  private Double bidDeposit;   // NUMBER(10,2)
	  private String provider;         // SNS 제공자 (kakao/naver/google 등)
	  private String providerId;       // SNS 식별자


}
