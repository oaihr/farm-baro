package com.app.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.app.domain.User;
import com.app.dto.UserDto;

@Mapper
public interface UserMapper {
    
    // 사용자 정보 조회
    UserDto getUserById(@Param("userId") String userId);
    
    // 사용자 정보 수정
    int updateUser(UserDto user);
    
    // 사용자 타입별 조회
    List<UserDto> getUsersByType(@Param("userType") String userType);
    
    // 이메일로 사용자 조회
    UserDto getUserByEmail(@Param("email") String email);
    
    // ==================== UserServiceImpl에서 사용하는 메서드들 ====================
    
    // User 도메인 객체용 메서드들
    User findById(@Param("id") String id);
    User findByEmail(@Param("email") String email);
    int insertUser(User user);
    
    // 구매자 가입
    int insertBuyer(Map<String, Object> params);
    
    // 판매자 가입
    int insertSeller(Map<String, Object> params);
    
    // 이메일 존재 여부 확인
    int existsByEmail(@Param("email") String email);
    
    // ID 존재 여부 확인
    int existsById(@Param("id") String id);
    
    // 비밀번호 업데이트
    int updatePasswordByEmail(Map<String, Object> params);
    
    // 판매자 정보 업데이트
    int updateSellerInfo(Map<String, Object> params);
}
