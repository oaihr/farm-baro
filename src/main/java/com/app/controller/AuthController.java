// com.app.controller.AuthController.java
package com.app.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.mail.MailAuthenticationException;
import org.springframework.mail.MailSendException;
import org.springframework.util.DigestUtils;

import com.app.domain.User;
import com.app.dto.auth.LoginRequest;
import com.app.dto.auth.SignupRequest;
// import com.app.mapper.UserMapper; // 임시로 주석 처리
// import com.app.service.user.UserService; // 임시로 주석 처리
import com.app.service.user.email.EmailService;

import javax.servlet.http.HttpSession;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"}, allowCredentials = "true")
@RequiredArgsConstructor
public class AuthController {

  private final EmailService emailService;   // 인증메일 발송/검증 (requestId + code 방식)
  // private final UserService userService;     // 가입/비번변경 비즈니스 로직 - 임시로 주석 처리
  // private final UserMapper userMapper;       // 중복체크, 로그인 조회 - 임시로 주석 처리
  private final HttpSession session;

  // 간단한 해시 함수 (개발용 - 실제 운영에서는 BCrypt 사용 권장)
  private String hashPassword(String rawPassword) {
    return DigestUtils.md5DigestAsHex(rawPassword.getBytes(StandardCharsets.UTF_8));
  }

  // ===========================
  // 이메일: 중복 확인
  // ===========================
  @GetMapping("/email/validate")
  public Map<String, Object> validateEmail(@RequestParam String email) {
    // 임시로 항상 true 반환 (개발용)
    return Map.of("ok", true);
  }

  // ===========================
  // 이메일: 인증메일 발송 (requestId 반환)
  // ===========================
  @PostMapping("/email/send")
  public Map<String, Object> sendBuyerEmail(@RequestBody Map<String, String> req) {
      String email = req.get("email");
      if (email == null || !email.matches("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$")) {
          throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "이메일 형식 오류");
      }
      
      // 임시로 항상 성공 반환 (개발용)
      // if (userMapper.existsByEmail(email) > 0) {
      //     return Map.of("ok", false, "message", "이미 사용 중인 이메일입니다.");
      // }

      // 6자리 코드 생성 + 세션에 저장(3분 유효)
      String code = String.format("%06d", new java.util.Random().nextInt(1_000_000));
      session.setAttribute("EMAIL_OTP:" + email, code);
      session.setAttribute("EMAIL_OTP_TS:" + email, System.currentTimeMillis());

      try {
          emailService.send(
              email,
              "[목장바로] 이메일 인증코드",
              "인증코드: " + code + "\n유효시간: 3분"
          );
          return Map.of("ok", true);
      } catch (Exception e) {
          e.printStackTrace();
          throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "메일 발송 중 오류: " + e.getMessage());
      }
  }

  // ===========================
  // 이메일: 인증코드 검증 (204)
  // ===========================
  @PostMapping("/email/verify")
  public Map<String, Object> verifyBuyerEmail(@RequestBody Map<String, String> req) {
      String email = req.get("email");
      String code  = req.get("code");

      String saved = (String) session.getAttribute("EMAIL_OTP:" + email);
      Long ts      = (Long) session.getAttribute("EMAIL_OTP_TS:" + email);

      boolean ok = saved != null && saved.equals(code)
                 && ts != null && (System.currentTimeMillis() - ts) < 180_000;

      return Map.of("ok", ok);
  }

  // ===========================
  // 구매자 회원가입 (DB 저장)
  // ===========================
  @PostMapping("/signup/buyer")
  public ResponseEntity<?> signupBuyer(@RequestBody SignupRequest req) {
    // 임시로 성공 반환 (개발용)
    return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("ok", true));
  }

  // ===========================
  // 비밀번호 재설정 (이메일 인증 후 새 비번 저장)
  // body: { email, requestId, code, newPass }
  // ===========================
  @PostMapping("/password/reset")
  public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> body) {
    // 임시로 성공 반환 (개발용)
    return ResponseEntity.noContent().build();
  }

  // ===========================
  // 로그인
  // ===========================
  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody LoginRequest req, HttpSession session) {
    // 임시로 성공 반환 (개발용)
    session.setAttribute("LOGIN_ID", "temp_user_id");
    session.setAttribute("LOGIN_EMAIL", req.getEmail());
    session.setAttribute("LOGIN_NAME", "임시 사용자");
    return ResponseEntity.ok().build();
  }

  // ===========================
  // 로그아웃
  // ===========================
  @PostMapping("/logout")
  public ResponseEntity<Void> logout(HttpSession session) {
    session.invalidate();
    return ResponseEntity.noContent().build();
  }

  // ===========================
  // 내 정보 확인 (세션)
  // ===========================
  @GetMapping("/me")
  public ResponseEntity<?> me(HttpSession session) {
    Object id = session.getAttribute("LOGIN_ID");
    if (id == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    return ResponseEntity.ok(
        Map.of(
            "id", id,
            "email", session.getAttribute("LOGIN_EMAIL"),
            "name", session.getAttribute("LOGIN_NAME")
        )
    );
  }
}
