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

	  int updatePasswordByEmail(Map<String, Object> p);
	}