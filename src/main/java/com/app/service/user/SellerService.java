package com.app.service.user;

import com.app.dto.seller.SellerSignupPayload;
import com.app.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.DigestUtils;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SellerService {

    private final UserMapper userMapper;

    @Transactional
    public void registerSeller(SellerSignupPayload p, String brnDocPath) {
        Map<String, Object> u = new HashMap<>();
        // ID는 VARCHAR2라서 Java UUID 문자열로 생성
        u.put("id", UUID.randomUUID().toString());
        // 비밀번호: 운영은 BCrypt 권장 (예시는 MD5)
        u.put("pw", DigestUtils.md5DigestAsHex(p.getBasic().getPass().getBytes()));
        u.put("email", p.getBasic().getEmail());
        // 주소는 addr1 + ' ' + addr2 합치기 (nullable 허용)
        String address = (p.getBusiness().getAddr1() == null ? "" : p.getBusiness().getAddr1().trim())
                       + (p.getBusiness().getAddr2() == null ? "" : (" " + p.getBusiness().getAddr2().trim()));
        u.put("address", address.trim());
        // 휴대폰은 선택값이므로 없으면 null
        u.put("tel", null);  // 필요하면 프론트에서 받아서 넣기
        u.put("userName", p.getBasic().getName());
        u.put("brn", p.getBusiness().getBrn()); // 사업자등록번호 -> BUSINESS_NUMBER

        userMapper.insertSeller(u);

        // brnDocPath(사업자등록증 파일경로)는 향후 별도 테이블로 분리 저장 권장
        // (USERS 테이블에는 칼럼이 없어 여기서는 보관하지 않음)
    }
}
