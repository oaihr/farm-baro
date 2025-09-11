package com.app.controller;

import java.util.Map;
import java.util.Random;
import javax.servlet.http.HttpSession;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.app.domain.User;
import com.app.dto.auth.LoginRequest;
import com.app.dto.auth.SignupRequest;
import com.app.mapper.UserMapper;
import com.app.service.user.UserService;
import com.app.service.user.email.EmailService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(
  origins = {"http://localhost:3000", "http://localhost:3001"},
  allowCredentials = "true"
)
public class AuthController {

  private final EmailService emailService;
  private final UserService userService;
  private final UserMapper userMapper;
  private final HttpSession session;

  public AuthController(EmailService emailService,
                        UserService userService,
                        UserMapper userMapper,
                        HttpSession session) {
    this.emailService = emailService;
    this.userService = userService;
    this.userMapper = userMapper;
    this.session = session;
  }

  // 이메일: 중복 확인(개발용 OK)
  @GetMapping("/email/validate")
  public Map<String, Object> validateEmail(@RequestParam String email) {
    return Map.of("ok", true);
  }

  // 이메일: 인증메일 발송
  @PostMapping("/email/send")
  public Map<String, Object> sendBuyerEmail(@RequestBody Map<String, String> req) {
    String email = req.get("email");
    if (!isEmail(email)) {
      return Map.of("ok", false, "message", "이메일 형식 오류");
    }
    String code = String.format("%06d", new Random().nextInt(1_000_000));
    session.setAttribute("EMAIL_OTP:" + email, code);
    session.setAttribute("EMAIL_OTP_TS:" + email, System.currentTimeMillis());

    try {
      emailService.send(email, "[목장바로] 이메일 인증코드",
          "인증코드: " + code + "\n유효시간: 3분");
      return Map.of("ok", true);
    } catch (Exception e) {
      e.printStackTrace();
      return Map.of("ok", false, "message", "메일 발송 중 오류: " + e.getMessage());
    }
  }

  // 이메일: 인증코드 검증
  @PostMapping("/email/verify")
  public Map<String, Object> verifyBuyerEmail(@RequestBody Map<String, String> req) {
    String email = req.get("email");
    String code  = req.get("code");

    String saved = (String) session.getAttribute("EMAIL_OTP:" + email);
    Long ts      = (Long)   session.getAttribute("EMAIL_OTP_TS:" + email);

    boolean ok = saved != null && saved.equals(code)
              && ts != null && (System.currentTimeMillis() - ts) < 180_000;

    return Map.of("ok", ok);
  }

  // 이메일 중복 체크
  @PostMapping("/check-email")
  public ResponseEntity<?> checkEmail(@RequestBody Map<String, String> body) {
    String email = body.get("email");
    if (email == null || email.trim().isEmpty()) {
      return ResponseEntity.badRequest()
          .body(Map.of("ok", false, "message", "이메일을 입력해주세요."));
    }
    boolean exists = userService.findByEmail(email.trim()) != null;
    return ResponseEntity.ok(
        Map.of("ok", true, "exists", exists,
               "message", exists ? "이미 사용 중인 이메일입니다." : "사용 가능한 이메일입니다."));
  }

  // 구매자 회원가입
  @PostMapping("/signup/buyer")
  public ResponseEntity<?> signupBuyer(@RequestBody SignupRequest req) {
    try {
      userService.registerBuyer(req);
      return ResponseEntity.ok(Map.of("ok", true));
    } catch (Exception e) {
      return ResponseEntity.badRequest()
          .body(Map.of("ok", false, "message", e.getMessage()));
    }
  }

  // 비밀번호 찾기: 인증코드 발송
  @PostMapping("/password/forgot")
  public Map<String, Object> sendResetCode(@RequestBody Map<String, String> req) {
    String email = req.get("email");
    if (!isEmail(email)) {
      return Map.of("ok", false, "message", "이메일 형식 오류");
    }

    if (userService.findByEmail(email) == null) {
      return Map.of("ok", true, "requestId", "", "message", "가입된 이메일이 아닙니다.");
    }

    String requestId = java.util.UUID.randomUUID().toString();
    String code = String.format("%06d", new Random().nextInt(1_000_000));
    long now = System.currentTimeMillis();

    session.setAttribute("RESET_EMAIL:" + requestId, email);
    session.setAttribute("RESET_CODE:" + requestId, code);
    session.setAttribute("RESET_TS:" + requestId, now);

    try {
      emailService.send(email, "[목장바로] 비밀번호 재설정 인증코드",
          "인증코드: " + code + "\n유효시간: 10분");
      return Map.of("ok", true, "requestId", requestId);
    } catch (Exception e) {
      e.printStackTrace();
      return Map.of("ok", false, "message", "메일 발송 중 오류: " + e.getMessage());
    }
  }

  // 비밀번호 재설정
  @PostMapping("/password/reset")
  public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> body) {
    String requestId = body.get("requestId");
    String code      = body.get("code");
    String newPass   = body.get("newPass");

    if (requestId == null || code == null || newPass == null) {
      return ResponseEntity.badRequest()
          .body(Map.of("ok", false, "message", "파라미터 누락"));
    }

    String email = (String) session.getAttribute("RESET_EMAIL:" + requestId);
    String saved = (String) session.getAttribute("RESET_CODE:" + requestId);
    Long ts      = (Long)   session.getAttribute("RESET_TS:" + requestId);

    boolean valid = email != null && saved != null && ts != null
        && saved.equals(code)
        && (System.currentTimeMillis() - ts) < 10 * 60 * 1000;

    if (!valid) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST)
          .body(Map.of("ok", false, "message", "인증이 만료되었거나 코드가 올바르지 않습니다."));
    }

    try {
      userService.resetPassword(email, newPass);
      session.removeAttribute("RESET_EMAIL:" + requestId);
      session.removeAttribute("RESET_CODE:" + requestId);
      session.removeAttribute("RESET_TS:" + requestId);
      return ResponseEntity.noContent().build();
    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(Map.of("ok", false, "message", "비밀번호 변경 실패"));
    }
  }

  // 로그인
  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody LoginRequest req, HttpSession httpSession) {
    try {
      User user = userService.login(req.getEmail(), req.getPassword());
      if (user == null) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(Map.of("message", "이메일 또는 비밀번호가 올바르지 않습니다."));
      }
      httpSession.setAttribute("LOGIN_ID", user.getId());
      httpSession.setAttribute("LOGIN_EMAIL", user.getEmail());
      httpSession.setAttribute("LOGIN_NAME", user.getUserName());
      httpSession.setAttribute("LOGIN_USER_TYPE", user.getUserType());
      httpSession.setAttribute("LOGIN_TYPE", user.getUserType()); // 호환
      httpSession.setAttribute("LOGIN_PROVIDER", user.getProvider());
      return ResponseEntity.ok().build();
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
    }
  }

  // 로그아웃
  @PostMapping("/logout")
  public ResponseEntity<Void> logout(HttpSession s) {
    s.invalidate();
    return ResponseEntity.noContent().build();
  }

  // 내 정보(세션)
  @GetMapping("/me")
  public ResponseEntity<?> me(HttpSession s) {
    Object idObj = s.getAttribute("LOGIN_ID");
    if (idObj == null) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
    String id = String.valueOf(idObj);
    try {
      User u = userService.findById(id);
      if (u == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
      Map<String, Object> res = Map.of(
          "id", u.getId(),
          "email", u.getEmail(),
          "name", u.getUserName(),
          "userType", u.getUserType(),
          "provider", u.getProvider() == null ? "LOCAL" : u.getProvider(),
          "role", u.getUserType() // 호환용
      );
      return ResponseEntity.ok(res);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  // SNS 최초 로그인: 역할 저장
  @PostMapping("/me/user-type")
  public ResponseEntity<Map<String, Object>> saveUserType(@RequestBody Map<String, String> body) {
    String id = (String) session.getAttribute("LOGIN_ID");
    if (id == null) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
          .body(Map.of("ok", false, "message", "NOT_LOGIN"));
    }
    String userType = (body.getOrDefault("userType", "")).trim().toUpperCase();
    if (!"BUYER".equals(userType) && !"SELLER".equals(userType)) {
      return ResponseEntity.badRequest()
          .body(Map.of("ok", false, "message", "INVALID_USER_TYPE"));
    }
    int n = userMapper.updateRole(id, userType); // XML에서 SELLER면 PENDING, 그 외 ACTIVE
    session.setAttribute("LOGIN_USER_TYPE", userType);
    session.setAttribute("NEED_ROLE_SELECT", "N");
    return ResponseEntity.ok(Map.of("ok", n > 0));
  }

  private boolean isEmail(String s) {
    return s != null && s.matches("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$");
  }
}
