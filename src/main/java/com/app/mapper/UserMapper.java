package com.app.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.app.domain.User;

@Mapper
public interface UserMapper {

  // 조회/체크
  int existsByEmail(@Param("email") String email);
  int existsById(@Param("id") String id);
  User findById(@Param("id") String id);
  User findByEmail(@Param("email") String email);

  // 가입
  int insertUser(User user);
  int insertBuyer(Map<String, Object> params);   // ← @Param 제거
  int insertSeller(Map<String, Object> params);  // ← @Param 제거

  // 비밀번호 재설정
  int updatePasswordByEmail(Map<String, Object> params); // {email, pw}

  // SNS
  User findByProvider(@Param("provider") String provider,
                      @Param("providerId") String providerId);
  int existsByProvider(@Param("provider") String provider,
                       @Param("providerId") String providerId);
  int linkProviderByEmail(@Param("email") String email,
                          @Param("provider") String provider,
                          @Param("providerId") String providerId);
  int insertSnsUser(Map<String, Object> params);

  // 역할/유저타입(및 레거시)
  int updateUserType(@Param("id") String id, @Param("userType") String userType);
  int updateRole(@Param("id") String id, @Param("role") String role);
}
