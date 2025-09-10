package com.app.service.user.impl;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.app.domain.User;
import com.app.dto.auth.SignupRequest;
import com.app.dto.seller.SellerSignupPayload;
import com.app.mapper.UserMapper;
import com.app.service.user.UserService;

@Service("userService")
public class UserServiceImpl implements UserService {

    @Autowired private UserMapper userMapper;
    // @Autowired private PasswordEncoder passwordEncoder; // 임시로 주석 처리

    // 간단한 해시 함수 (개발용 - 실제 운영에서는 BCrypt 사용 권장)
    private String hashPassword(String rawPassword) {
        return DigestUtils.md5DigestAsHex(rawPassword.getBytes(StandardCharsets.UTF_8));
    }
    
    private boolean matchesPassword(String rawPassword, String storedPassword) {
        // 원본 비밀번호 저장 시: 단순 문자열 비교
        return rawPassword.equals(storedPassword);
        
        // 해시화된 비밀번호 저장 시: 아래 주석 해제
        // return BCrypt.checkpw(rawPassword, storedPassword);
    }

    @Override
    public void signup(User u) {
        if (u.getId() == null) u.setId(UUID.randomUUID().toString());
        // u.setPw(hashPassword(u.getPw())); // 원본 비밀번호 그대로 사용
        userMapper.insertUser(u);
    }

    @Override
    public User signupLocal(String email, String pw, String name, String tel) {
        User existed = userMapper.findByEmail(email);
        if (existed != null) return existed;

        User u = new User();
        u.setId(UUID.randomUUID().toString());
        u.setEmail(email);
        u.setPw(pw); // 원본 비밀번호 그대로 사용
        u.setUserName(name);
        u.setTel(tel);
        userMapper.insertUser(u);
        return u;
    }

    // ===================== 구매자 가입 =====================
    @Override
    @Transactional
    public void registerBuyer(SignupRequest req) {
        if (userMapper.existsById(req.getId()) > 0) {
            throw new IllegalStateException("이미 사용 중인 아이디입니다.");
        }
        if (userMapper.existsByEmail(req.getEmail()) > 0) {
            throw new IllegalStateException("이미 가입된 이메일입니다.");
        }

        // user_mapper.xml 의 <insert id="insertBuyer">가 기대하는 키 이름과 맞춥니다.
        Map<String, Object> p = new HashMap<>();
        p.put("id", req.getId());                               // 사용자가 입력한 ID
        p.put("pw", req.getPassword()); // 사용자가 입력한 원본 비밀번호
        p.put("email", req.getEmail());
        p.put("name", req.getUserName());                       // XML에서 USER_NAME 으로 들어감
        p.put("address", req.getAddress());                     // addr1/addr2 아님!
        p.put("tel", req.getTel());                             // 전화번호 추가

        userMapper.insertBuyer(p);
    }

    // 옛 코드 대비 호환 (있어도 되고 없어도 됨)
    @Override
    public void signupBuyer(SignupRequest req) { registerBuyer(req); }

    // ===================== 로그인 =====================
    @Override
    public User login(String email, String rawPw) {
        // 이메일로만 로그인 (ID는 닉네임 개념)
        User found = userMapper.findByEmail(email);
        if (found == null) return null;
        return matchesPassword(rawPw, found.getPw()) ? found : null;
    }

    @Override
    public User findByEmail(String email) { return userMapper.findByEmail(email); }

    @Override
    public User findById(String id) { return userMapper.findById(id); }

    // ===================== 판매자 가입(검수요청) =====================
    @Override
    public void registerSeller(SellerSignupPayload p, String brnDocPath) {
        SellerSignupPayload.Basic b = Objects.requireNonNull(p.getBasic(), "basic is null");
        SellerSignupPayload.Business bs = Objects.requireNonNull(p.getBusiness(), "business is null");

        // 원본 비밀번호 그대로 사용
        String encPw = b.getPass();

        String address = ((bs.getAddr1() == null ? "" : bs.getAddr1().trim()) + " " +
                          (bs.getAddr2() == null ? "" : bs.getAddr2().trim())).trim();

        Map<String, Object> u = new HashMap<>();
        u.put("id", UUID.randomUUID().toString());
        u.put("pw", encPw);
        u.put("email", b.getEmail());
        u.put("address", address);
        u.put("tel", b.getTel());  // 전화번호 추가
        u.put("userName", b.getName());
        u.put("brn", bs.getBrn()); // 사업자번호 (선택사항)

        userMapper.insertSeller(u);
        // 사업자등록증 파일 저장은 별도 테이블 설계 후 추가
    }

    // ===================== 비밀번호 재설정 =====================
    @Override
    @Transactional
    public void resetPassword(String email, String rawPass) {
    	 int updated = userMapper.updatePasswordByEmail(
    	            Map.of("email", email, "pw", passwordEncoder.encode(rawPass))
    	        );
    	        if (updated != 1) throw new IllegalStateException("계정이 없거나 비밀번호 변경 실패");
    	    }
}








