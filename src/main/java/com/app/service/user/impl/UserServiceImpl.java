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

    @Autowired
    private UserMapper userMapper;
    // 비밀번호 인코더는 사용하지 않습니다(원문 저장 정책).
    // @Autowired private PasswordEncoder passwordEncoder;

    /* 원문 저장 정책: 단순 문자열 비교 */
    private boolean matchesPassword(String rawPassword, String storedPassword) {
        return rawPassword != null && rawPassword.equals(storedPassword);
    }

    @Override
    public void signup(User u) {
        if (u.getId() == null) u.setId(UUID.randomUUID().toString());
        // u.setPw(passwordEncoder.encode(u.getPw())); // 해시를 쓰지 않습니다.
        userMapper.insertUser(u);
    }

    @Override
    public User signupLocal(String email, String pw, String name, String tel) {
        User existed = userMapper.findByEmail(email);
        if (existed != null) return existed;

        User u = new User();
        u.setId(UUID.randomUUID().toString());
        u.setEmail(email);
        u.setPw(pw);                 // 원문 저장
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

        // UserMapper.xml 의 키 이름과 일치해야 합니다.
        Map<String, Object> p = new HashMap<>();
        p.put("id", req.getId());
        p.put("pw", req.getPassword());   // 원문 저장
        p.put("email", req.getEmail());
        p.put("name", req.getUserName());
        p.put("address", req.getAddress());
        p.put("tel", req.getTel());

        userMapper.insertBuyer(p);
    }

    // (레거시 호환)
    @Override
    public void signupBuyer(SignupRequest req) { registerBuyer(req); }

    // ===================== 로그인 =====================
    @Override
    public User login(String email, String rawPw) {
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

        String encPw = b.getPass(); // 원문 저장

        String address = ((bs.getAddr1() == null ? "" : bs.getAddr1().trim()) + " " +
                          (bs.getAddr2() == null ? "" : bs.getAddr2().trim())).trim();

        Map<String, Object> u = new HashMap<>();
        u.put("id", UUID.randomUUID().toString());
        u.put("pw", encPw);
        u.put("email", b.getEmail());
        u.put("address", address);
        u.put("tel", b.getTel());
        u.put("userName", b.getName());
        u.put("brn", bs.getBrn());

        userMapper.insertSeller(u);
        // 사업자등록증 파일 저장은 별도 테이블에서 처리
    }

    // ===================== 비밀번호 재설정 =====================
    @Override
    @Transactional
    public void resetPassword(String email, String rawNewPassword) {
        // 원문 저장 정책에 맞춰 그대로 저장
        Map<String, Object> params = new HashMap<>();
        params.put("email", email);
        params.put("pw", rawNewPassword);

        int updated = userMapper.updatePasswordByEmail(params);
        if (updated != 1) {
            throw new IllegalStateException("계정을 찾을 수 없거나 비밀번호 변경에 실패했습니다.");
        }
    }
}
