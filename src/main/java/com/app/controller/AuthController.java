// com.app.controller.AuthController.java
package com.app.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.mail.MailAuthenticationException;
import org.springframework.mail.MailSendException;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.app.domain.User;
import com.app.dto.auth.LoginRequest;
import com.app.dto.auth.SignupRequest;
import com.app.mapper.UserMapper;
import com.app.service.user.UserService;
import com.app.service.user.email.EmailService;

import javax.servlet.http.HttpSession;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

  private final EmailService emailService;   // 인증메일 발송/검증 (requestId + code 방식)
  private final UserService userService;     // 가입/비번변경 비즈니스 로직
  private final UserMapper userMapper;       // 중복체크, 로그인 조회
  private final PasswordEncoder passwordEncoder;
  private final HttpSession session;

  // ===========================
  // 이메일: 중복 확인
  // ===========================
  @GetMapping("/email/validate")
  public Map<String, Object> validateEmail(@RequestParam String email) {
    boolean ok = userMapper.existsByEmail(email) == 0; // 없으면 true
    return Map.of("ok", ok);
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
      // 이미 가입된 이메일이면 막기 (원하면 제거)
      if (userMapper.existsByEmail(email) > 0) {
          return Map.of("ok", false, "message", "이미 사용 중인 이메일입니다.");
      }

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
    try {
      userService.registerBuyer(req); // 존재 체크 + 비번 Bcrypt + USERS INSERT (서비스에서 처리)
      return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("ok", true));
    } catch (IllegalStateException dup) {
      // 서비스에서 "이미 가입된 이메일" 등으로 던진 경우
      return ResponseEntity.status(HttpStatus.CONFLICT)
          .body(Map.of("ok", false, "message", dup.getMessage()));
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(Map.of("ok", false, "message", "가입 저장 실패"));
    }
  }

  // ===========================
  // 비밀번호 재설정 (이메일 인증 후 새 비번 저장)
  // body: { email, requestId, code, newPass }
  // ===========================
  @PostMapping("/password/reset")
  public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> body) {
    String email    = body.get("email");
    String requestId= body.get("requestId");
    String code     = body.get("code");
    String newPass  = body.get("newPass");

    if (email == null || requestId == null || code == null || newPass == null) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "파라미터 누락");
    }

    // 1) 코드 검증
    emailService.verify(requestId, code);

    // 2) 저장
    try {
      userService.resetPassword(email, newPass);
      return ResponseEntity.noContent().build();
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(Map.of("ok", false, "message", "비밀번호 변경 실패"));
    }
  }

  // ===========================
  // 로그인
  // ===========================
  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody LoginRequest req, HttpSession session) {
    User u = userMapper.findByEmail(req.getEmail());
    if (u == null) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("계정을 찾을 수 없습니다.");
    }
    if (!passwordEncoder.matches(req.getPassword(), u.getPw())) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("비밀번호가 일치하지 않습니다.");
    }
    session.setAttribute("LOGIN_ID", u.getId());
    session.setAttribute("LOGIN_EMAIL", u.getEmail());
    session.setAttribute("LOGIN_NAME", u.getUserName());
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
