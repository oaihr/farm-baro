package com.app.service.user.impl;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
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
    @Autowired private PasswordEncoder passwordEncoder;

    @Override
    public void signup(User u) {
        if (u.getId() == null) u.setId(UUID.randomUUID().toString());
        u.setPw(passwordEncoder.encode(u.getPw()));
        userMapper.insertUser(u);
    }

    @Override
    public User signupLocal(String email, String pw, String name, String tel) {
        User existed = userMapper.findByEmail(email);
        if (existed != null) return existed;

        User u = new User();
        u.setId(UUID.randomUUID().toString());
        u.setEmail(email);
        u.setPw(passwordEncoder.encode(pw));
        u.setUserName(name);
        u.setTel(tel);
        userMapper.insertUser(u);
        return u;
    }

    // ===================== 구매자 가입 =====================
    @Override
    @Transactional
    public void registerBuyer(SignupRequest req) {
        if (userMapper.existsByEmail(req.getEmail()) > 0) {
            throw new IllegalStateException("이미 가입된 이메일입니다.");
        }

        // user_mapper.xml 의 <insert id="insertBuyer">가 기대하는 키 이름과 맞춥니다.
        Map<String, Object> p = new HashMap<>();
        p.put("id", UUID.randomUUID().toString());
        p.put("pw", passwordEncoder.encode(req.getPassword())); // ← passwordEncoder 사용
        p.put("email", req.getEmail());
        p.put("name", req.getUserName());                       // XML에서 USER_NAME 으로 들어감
        p.put("address", req.getAddress());                     // addr1/addr2 아님!
        p.put("tel", req.getTel());

        userMapper.insertBuyer(p);
    }

    // 옛 코드 대비 호환 (있어도 되고 없어도 됨)
    public void signupBuyer(SignupRequest req) { registerBuyer(req); }

    // ===================== 로그인 =====================
    @Override
    public User login(String email, String rawPw) {
        User found = userMapper.findByEmail(email);
        if (found == null) return null;
        return passwordEncoder.matches(rawPw, found.getPw()) ? found : null;
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

        // 임시 MD5 → 운영에서는 반드시 BCrypt 등으로 바꾸세요. 완료.
        String encPw = passwordEncoder.encode(b.getPass()); // BCrypt로 통일

        String address = ((bs.getAddr1() == null ? "" : bs.getAddr1().trim()) + " " +
                          (bs.getAddr2() == null ? "" : bs.getAddr2().trim())).trim();

        Map<String, Object> u = new HashMap<>();
        u.put("id", UUID.randomUUID().toString());
        u.put("pw", encPw);
        u.put("email", b.getEmail());
        u.put("address", address);
        u.put("tel", null);
        u.put("userName", b.getName());	// ← XML에서 #{userName} 사용하도록 맞추기
        u.put("brn", bs.getBrn());

        userMapper.insertSeller(u);
        // brnDocPath 저장은 별도 테이블 설계 후 추가
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








