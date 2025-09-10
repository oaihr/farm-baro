package com.app.mapper;

import java.util.Map;

import org.apache.ibatis.annotations.Param;

import com.app.domain.User;


public interface UserMapper {
	  int existsByEmail(@Param("email") String email);
	// 판매자 신규 가입 (USERS 테이블)
	  void insertSeller(@Param("u") Map<String, Object> u);
	  User findByEmail(String email);
	  int insertUser(User u);
	  User findById(String id);
	  
	  int insertBuyer(java.util.Map<String,Object> p);
	  
	// 비번 변경
	  int updatePasswordByEmail(Map<String, Object> p);
	  
	// SNS용
	  User findByProvider(@Param("provider") String provider, @Param("providerId") String providerId);
	  int linkProviderByEmail(@Param("email") String email,
	                          @Param("provider") String provider,
	                          @Param("providerId") String providerId);
	  int insertSnsUser(Map<String, Object> p);

	// provider 존재 여부
	  int existsByProvider(@Param("provider") String provider,
			  			   @Param("providerId") String providerId);
	  
	// 역할 저장	  
	  void updateRole(Map<String,Object> p);
	  
	// interface SNS  유저 소비자,판매자 선택
	  int updateRole(@Param("id") String id, @Param("role") String role);

	  
	  
	  
	  
	}