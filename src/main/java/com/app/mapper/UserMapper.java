package com.app.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.app.domain.User;
import com.app.dto.UserDto;

@Mapper
public interface UserMapper {
    // ── 기본 조회/중복체크
    int existsByEmail(@Param("email") String email);
    int existsById(@Param("id") String id);

    User findById(@Param("id") String id);
    User findByEmail(@Param("email") String email);

    // ── 기본/역할 저장
    int insertUser(User user);                         // USERS 기본행
    int insertBuyer(@Param("p") Map<String, Object> p); // BUYER 세부정보
    int insertSeller(@Param("p") Map<String, Object> p); // SELLER 세부정보

    // ── 비밀번호 변경 (email 기준)
    int updatePasswordByEmail(@Param("p") Map<String, Object> p);
    // p: { "email": ..., "password": ... }

    // ── 판매자 정보 업데이트(선택)
    int updateSellerInfo(@Param("p") Map<String, Object> p);

    // ── SNS 관련(선택적으로 사용)
    User findByProvider(@Param("provider") String provider,
                        @Param("providerId") String providerId);

    int existsByProvider(@Param("provider") String provider,
                         @Param("providerId") String providerId);

    int linkProviderByEmail(@Param("email") String email,
                            @Param("provider") String provider,
                            @Param("providerId") String providerId);

    int insertSnsUser(@Param("p") Map<String, Object> p);

    // ── 역할/유저타입 업데이트
    int updateUserType(@Param("id") String id,
                       @Param("userType") String userType);

    // (레거시 호환용: 기존 코드에서 updateRole(id, role) 호출 시)
    int updateRole(@Param("id") String id,
                   @Param("role") String role);
}