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

    /* 원문 비밀번호 정책(그대로 저장) */
    private boolean matchesPassword(String rawPassword, String storedPassword) {
        return rawPassword != null && rawPassword.equals(storedPassword);
    }

    /* ===== 주소 정규화 유틸 ===== */
    private static String normalize(String s) {
        if (s == null) return "";
        return s
            .replace('\u00A0',' ')                       // nbsp
            .replaceAll("[\\u200B-\\u200D\\uFEFF]", "")  // zero-width
            .replace('|', ' ')                           // 파이프/세로획
            .replace('ㅣ', ' ')
            .trim()
            .replaceAll("\\s+", " ");
    }

    private static String normalizeZip(String zip) {
        return normalize(zip).replaceAll("\\D", "");
    }

    /** (zip, addr1, addr2) → 정규화하여 하나로 합치기 */
    private static String joinAddress(String zip, String addr1, String addr2) {
        String z  = normalizeZip(zip);
        String a1 = normalize(addr1);
        String a2 = normalize(addr2);

        StringBuilder sb = new StringBuilder();
        if (!z.isEmpty())  sb.append(z).append(' ');
        if (!a1.isEmpty()) sb.append(a1).append(' ');
        if (!a2.isEmpty()) sb.append(a2).append(' ');

        return sb.toString().trim().replaceAll("\\s+", " ");
    }

    /* ================= 기본 가입/로그인 ================= */

    @Override
    public void signup(User u) {
        if (u.getId() == null) u.setId(UUID.randomUUID().toString());
        userMapper.insertUser(u);
    }

    @Override
    public User signupLocal(String email, String pw, String name, String tel) {
        User existed = userMapper.findByEmail(email);
        if (existed != null) return existed;

        User u = new User();
        u.setId(UUID.randomUUID().toString());
        u.setEmail(email);
        u.setPw(pw);
        u.setUserName(name);
        u.setTel(tel);
        userMapper.insertUser(u);
        return u;
    }

    /* ================= 구매자 가입 ================= */

    @Override
    @Transactional
    public void registerBuyer(SignupRequest req) {

        // 기본 검증
        if (req.getEmail() == null || req.getEmail().isBlank())
            throw new IllegalArgumentException("이메일이 필요합니다.");
        if (req.getPassword() == null || req.getPassword().isBlank())
            throw new IllegalArgumentException("비밀번호가 필요합니다.");
        if (userMapper.existsByEmail(req.getEmail()) > 0)
            throw new IllegalStateException("이미 가입된 이메일입니다.");

        // ★ id 자동 생성 (NOT NULL)
        String id = (req.getId() == null || req.getId().isBlank())
                  ? UUID.randomUUID().toString()
                  : req.getId().trim();

        // ★ address: DTO에서 합친 값 → 정규화해서 저장
        String address = normalize(req.mergedAddress());

        Map<String, Object> p = new HashMap<>();
        p.put("id", id);                            // ← 반드시 지역변수 id 사용
        p.put("pw", req.getPassword());             // 원문 저장
        p.put("email", req.getEmail());
        p.put("name", req.getUserName());           // USER_NAME 컬럼으로 매핑됨
        p.put("address", address);
        p.put("tel", req.getTel());

        userMapper.insertBuyer(p);
    }

    @Override
    public void signupBuyer(SignupRequest req) { registerBuyer(req); }

    @Override
    public User login(String email, String rawPw) {
        User found = userMapper.findByEmail(email);
        if (found == null) return null;
        return matchesPassword(rawPw, found.getPw()) ? found : null;
    }

    @Override public User findByEmail(String email) { return userMapper.findByEmail(email); }
    @Override public User findById(String id) { return userMapper.findById(id); }

    /* ================= 판매자 가입(검수요청) ================= */

    @Override
    public void registerSeller(SellerSignupPayload p, String brnDocPath) {
        SellerSignupPayload.Basic b = Objects.requireNonNull(p.getBasic(), "basic is null");
        SellerSignupPayload.Business bs = Objects.requireNonNull(p.getBusiness(), "business is null");

        // zip/addr1/addr2를 정규화하여 하나로
        String address = joinAddress(bs.getZip(), bs.getAddr1(), bs.getAddr2());

        Map<String, Object> u = new HashMap<>();
        u.put("id", UUID.randomUUID().toString());
        u.put("pw", b.getPass());                // 원문 저장
        u.put("email", b.getEmail());
        u.put("address", address);
        u.put("tel", b.getTel());
        u.put("userName", b.getName());
        u.put("brn", bs.getBrn());

        userMapper.insertSeller(u);
        // brnDocPath 저장은 별도 테이블 설계 후 처리
    }

    /* ================= 비밀번호 재설정 ================= */

    @Override
    @Transactional
    public void resetPassword(String email, String rawNewPassword) {
        Map<String, Object> params = new HashMap<>();
        params.put("email", email);
        params.put("pw", rawNewPassword);

        int updated = userMapper.updatePasswordByEmail(params);
        if (updated != 1) {
            throw new IllegalStateException("계정을 찾을 수 없거나 비밀번호 변경에 실패했습니다.");
        }
    }
}
