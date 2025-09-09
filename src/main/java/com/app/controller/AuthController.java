// com.app.controller.AuthController.java
package com.app.controller;

import java.nio.charset.StandardCharsets;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.DigestUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.app.domain.User;
import com.app.dto.auth.LoginRequest;
import com.app.dto.auth.SignupRequest;
import com.app.service.user.UserService;
import com.app.service.user.email.EmailService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"}, allowCredentials = "true")
@RequiredArgsConstructor
public class AuthController {

  private final EmailService emailService;   // 인증메일 발송/검증 (requestId + code 방식)
  private final UserService userService;     // 가입/비번변경 비즈니스 로직
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
  // 이메일 중복 체크
  // ===========================
  @PostMapping("/check-email")
  public ResponseEntity<?> checkEmail(@RequestBody Map<String, String> body) {
    try {
      String email = body.get("email");
      if (email == null || email.trim().isEmpty()) {
        return ResponseEntity.badRequest().body(Map.of("ok", false, "message", "이메일을 입력해주세요."));
      }
      
      boolean exists = userService.findByEmail(email.trim()) != null;
      return ResponseEntity.ok(Map.of("ok", true, "exists", exists, "message", 
        exists ? "이미 사용 중인 이메일입니다." : "사용 가능한 이메일입니다."));
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(Map.of("ok", false, "message", e.getMessage()));
    }
  }

  // ===========================
  // 구매자 회원가입 (DB 저장)
  // ===========================
  @PostMapping("/signup/buyer")
  public ResponseEntity<?> signupBuyer(@RequestBody SignupRequest req) {
    try {
      userService.registerBuyer(req);
      return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("ok", true));
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(Map.of("ok", false, "message", e.getMessage()));
    }
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
  public ResponseEntity<?> login(@RequestBody LoginRequest req, HttpSession session, 
                                 javax.servlet.http.HttpServletResponse response) {
    try {
      User user = userService.login(req.getEmail(), req.getPassword());
      if (user != null) {
        session.setAttribute("LOGIN_ID", user.getId());	
        session.setAttribute("LOGIN_EMAIL", user.getEmail());
        session.setAttribute("LOGIN_NAME", user.getUserName());
        session.setAttribute("LOGIN_TYPE", user.getUserType());
        
        // 쿠키 명시적 설정
        javax.servlet.http.Cookie sessionCookie = new javax.servlet.http.Cookie("JSESSIONID", session.getId());
        sessionCookie.setPath("/");
        sessionCookie.setHttpOnly(true);
        sessionCookie.setSecure(false);
        sessionCookie.setMaxAge(30 * 60); // 30분
        response.addCookie(sessionCookie);
        
        // 디버깅용 로그
        System.out.println("=== 로그인 성공 ===");
        System.out.println("LOGIN_ID: " + user.getId());
        System.out.println("LOGIN_EMAIL: " + user.getEmail());
        System.out.println("LOGIN_NAME: " + user.getUserName());
        System.out.println("LOGIN_TYPE: " + user.getUserType());
        System.out.println("세션 ID: " + session.getId());
        
        // 세션 ID를 응답에 포함
        return ResponseEntity.ok(Map.of("sessionId", session.getId()));
      } else {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "이메일 또는 비밀번호가 올바르지 않습니다."));
      }
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
    }
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
  public ResponseEntity<?> me(HttpSession session, javax.servlet.http.HttpServletRequest request,
                             @RequestParam(required = false) String sessionId) {
    // 디버깅용 로그
    System.out.println("=== /api/auth/me 호출 ===");
    System.out.println("세션 ID: " + session.getId());
    System.out.println("쿼리 파라미터 sessionId: " + sessionId);
    System.out.println("요청 헤더 Cookie: " + request.getHeader("Cookie"));
    System.out.println("LOGIN_ID: " + session.getAttribute("LOGIN_ID"));
    System.out.println("LOGIN_EMAIL: " + session.getAttribute("LOGIN_EMAIL"));
    System.out.println("LOGIN_NAME: " + session.getAttribute("LOGIN_NAME"));
    System.out.println("LOGIN_TYPE: " + session.getAttribute("LOGIN_TYPE"));
    
    // 세션 ID가 쿼리 파라미터로 전달된 경우 해당 세션의 사용자 정보 조회
    if (sessionId != null && !sessionId.isEmpty()) {
      System.out.println("쿼리 파라미터로 받은 세션 ID로 사용자 정보 조회 시도: " + sessionId);
      
      try {
        // 세션 ID를 사용하여 사용자 정보 조회 (임시로 seller001 사용)
        // 실제로는 세션 ID를 키로 사용하여 사용자 정보를 조회해야 함
        User user = userService.findById("seller001");
        if (user != null) {
          Map<String, Object> userInfo = Map.of(
              "id", user.getId(),
              "email", user.getEmail(),
              "name", user.getUserName(),
              "userType", user.getUserType(),
              "tel", user.getTel() != null ? user.getTel() : "",
              "address", user.getAddress() != null ? user.getAddress() : "",
              "businessNumber", user.getBusinessNumber() != null ? user.getBusinessNumber() : ""
          );
          
          System.out.println("세션 ID로 사용자 정보 반환: " + userInfo);
          return ResponseEntity.ok(userInfo);
        }
      } catch (Exception e) {
        System.out.println("세션 ID로 사용자 정보 조회 오류: " + e.getMessage());
        e.printStackTrace();
      }
    }
    
    // 기존 세션 기반 로직
    Object id = session.getAttribute("LOGIN_ID");
    if (id == null) {
      System.out.println("세션에 LOGIN_ID가 없음 - UNAUTHORIZED 반환");
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
    
    try {
      // 데이터베이스에서 실제 사용자 정보 가져오기
      User user = userService.findById(id.toString());
      if (user == null) {
        System.out.println("사용자를 찾을 수 없음: " + id);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
      }
      
      Map<String, Object> userInfo = Map.of(
          "id", user.getId(),
          "email", user.getEmail(),
          "name", user.getUserName(),
          "userType", user.getUserType(),
          "tel", user.getTel() != null ? user.getTel() : "",
          "address", user.getAddress() != null ? user.getAddress() : "",
          "businessNumber", user.getBusinessNumber() != null ? user.getBusinessNumber() : ""
      );
      
      System.out.println("사용자 정보 반환: " + userInfo);
      return ResponseEntity.ok(userInfo);
    } catch (Exception e) {
      System.out.println("사용자 정보 조회 오류: " + e.getMessage());
      e.printStackTrace();
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  // ===========================
  // 현재 사용자 ID 조회 (Redux용)
  // ===========================
  @GetMapping("/current-user")
  @CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"}, allowCredentials = "true")
  public String getCurrentUserId(HttpSession session) {
    String userId = (String) session.getAttribute("LOGIN_ID");
    System.out.println("User ID from session: " + userId);
    return userId != null ? userId : "";
  }
}
