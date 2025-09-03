package com.app.mapper;

import com.app.dto.UserDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

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
}
