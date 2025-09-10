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

import java.util.List;
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
  // 비밀번호 찾기: 인증코드 발송 (requestId 반환)
  // body: { email }
  // ===========================
  @PostMapping("/password/forgot")
  public Map<String, Object> sendResetCode(@RequestBody Map<String, String> req) {
    String email = req.get("email");
    if (email == null || !email.matches("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$")) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "이메일 형식 오류");
    }
    // 가입된 계정만 진행
    if (userMapper.findByEmail(email) == null) {
      // 보안상 200 처리 가능하지만, 프런트에서 UX 위해 메시지도 반환
      return Map.of("ok", true, "requestId", "", "message", "가입된 이메일이 아닙니다.");
    }

    // requestId + 6자리 코드 생성 (10분 유효)
    String requestId = java.util.UUID.randomUUID().toString();
    String code = String.format("%06d", new java.util.Random().nextInt(1_000_000));
    long now = System.currentTimeMillis();

    session.setAttribute("RESET_EMAIL:" + requestId, email);
    session.setAttribute("RESET_CODE:" + requestId, code);
    session.setAttribute("RESET_TS:" + requestId, now);

    try {
      emailService.send(
          email,
          "[목장바로] 비밀번호 재설정 인증코드",
          "인증코드: " + code + "\n유효시간: 10분"
      );
      return Map.of("ok", true, "requestId", requestId);
    } catch (Exception e) {
      e.printStackTrace();
      throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "메일 발송 중 오류: " + e.getMessage());
    }
  }

  // ===========================
  // 비밀번호 재설정
  // body: { requestId, code, newPass }
  // ===========================
  @PostMapping("/password/reset")
  public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> body) {
    String requestId = body.get("requestId");
    String code      = body.get("code");
    String newPass   = body.get("newPass");

    if (requestId == null || code == null || newPass == null) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "파라미터 누락");
    }

    String email = (String) session.getAttribute("RESET_EMAIL:" + requestId);
    String saved = (String) session.getAttribute("RESET_CODE:" + requestId);
    Long ts      = (Long)   session.getAttribute("RESET_TS:" + requestId);

    boolean valid = email != null && saved != null && ts != null
        && saved.equals(code)
        && (System.currentTimeMillis() - ts) < 10 * 60 * 1000; // 10분

    if (!valid) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST)
          .body(Map.of("ok", false, "message", "인증이 만료되었거나 코드가 올바르지 않습니다."));
    }

    try {
      userService.resetPassword(email, newPass); // 해시 후 저장
      // 일회성 사용: 세션 토큰 제거
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
	//===========================
	//내 정보 확인 (세션)
	//===========================
	@GetMapping("/me")
	public ResponseEntity<?> me(HttpSession session) {
	   Object idObj = session.getAttribute("LOGIN_ID");
	   if (idObj == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
	
	   String id       = String.valueOf(idObj);
	   String email    = (String) session.getAttribute("LOGIN_EMAIL");
	   String name     = (String) session.getAttribute("LOGIN_NAME");
	   String userType = (String) session.getAttribute("LOGIN_USER_TYPE"); // 첫 SNS 가입 직후엔 null일 수 있음
	   String provider = (String) session.getAttribute("LOGIN_PROVIDER");   // 로컬이면 null일 수 있음
	
	   // 세션에 누락된 값만 DB로 보완
	   if (email == null || name == null || userType == null || provider == null) {
	       User u = userMapper.findById(id);
	       if (u != null) {
	           if (email == null)    { email = u.getEmail();       session.setAttribute("LOGIN_EMAIL", email); }
	           if (name == null)     { name = u.getUserName();     session.setAttribute("LOGIN_NAME", name); }
	           if (userType == null) { userType = u.getUserType(); session.setAttribute("LOGIN_USER_TYPE", userType); }
	           if (provider == null) { provider = u.getProvider(); session.setAttribute("LOGIN_PROVIDER", provider); }
	       }
	   }
	
	   Map<String, Object> res = new java.util.LinkedHashMap<>();
	   res.put("id", id);
	   res.put("email", email);
	   res.put("name", name);
	   res.put("userType", userType);   // 프런트 분기 기준
	   res.put("provider", provider);
	   res.put("role", userType);       // (호환용) 기존 코드가 role을 참조하면 유지
	
	   return ResponseEntity.ok(res);
	}
	
	
	@PostMapping("/me/user-type")
	public ResponseEntity<?> setUserType(@RequestBody Map<String,String> b, HttpSession s) {
	  Object idObj = s.getAttribute("LOGIN_ID");
	  if (idObj == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
	  String role = b.get("userType");
	  if (!List.of("BUYER","SELLER").contains(role)) {
	    return ResponseEntity.badRequest().body(Map.of("ok", false, "message", "invalid role"));
	  }
	  userMapper.updateRole(idObj.toString(), role); // 매퍼: updateRole(id, role)
	  s.setAttribute("LOGIN_USER_TYPE", role);
	  return ResponseEntity.noContent().build();
	}

	

}
