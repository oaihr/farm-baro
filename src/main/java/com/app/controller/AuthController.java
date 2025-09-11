// com.app.controller.AuthController.java
package com.app.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.app.domain.User;
import com.app.dto.auction.CurrentUser;
import com.app.dto.auth.LoginRequest;
import com.app.dto.auth.SignupRequest;
import com.app.service.AuctionService;
import com.app.service.user.UserService;
import com.app.service.user.email.EmailService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(
  origins = {"http://localhost:3000", "http://localhost:3001"},
  allowCredentials = "true"
)
public class AuthController {

  private final EmailService emailService;   // 인증메일 발송/검증 (requestId + code 방식)
  private final UserService userService;     // 가입/비번변경 비즈니스 로직
  private final HttpSession session;
  @Autowired
  AuctionService auctionService;

  // Lombok 제거하고 명시적 생성자 사용
  public AuthController(EmailService emailService, UserService userService, HttpSession session) {
    this.emailService = emailService;
    this.userService = userService;
    this.session = session;
  }

  // ===========================
  // 이메일: 중복 확인 (GET, 개발용 OK)
  // ===========================
  @GetMapping("/email/validate")
  public Map<String, Object> validateEmail(@RequestParam String email) {
    // 필요하면 실제 검증 로직으로 교체
    return Map.of("ok", true);
  }

  // ===========================
  // 이메일: 인증메일 발송
  // body: { email }
  // ===========================
  @PostMapping("/email/send")
  public Map<String, Object> sendBuyerEmail(@RequestBody Map<String, String> req) {
    String email = req.get("email");
    if (email == null || !email.matches("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$")) {
      return Map.of("ok", false, "message", "이메일 형식 오류");
    }

    // 6자리 코드 생성 + 세션 저장(3분 유효)
    String code = String.format("%06d", new Random().nextInt(1_000_000));
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
      return Map.of("ok", false, "message", "메일 발송 중 오류: " + e.getMessage());
    }
  }

  // ===========================
  // 이메일: 인증코드 검증
  // body: { email, code }
  // ===========================
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

  // ===========================
  // 이메일 중복 체크 (POST)
  // body: { email }
  // ===========================
  @PostMapping("/check-email")
  public ResponseEntity<?> checkEmail(@RequestBody Map<String, String> body) {
    String email = body.get("email");
    if (email == null || email.trim().isEmpty()) {
      return ResponseEntity.badRequest().body(Map.of("ok", false, "message", "이메일을 입력해주세요."));
    }
    boolean exists = userService.findByEmail(email.trim()) != null;
    return ResponseEntity.ok(
      Map.of("ok", true, "exists", exists, "message", exists ? "이미 사용 중인 이메일입니다." : "사용 가능한 이메일입니다.")
    );
  }

  // ===========================
  // 구매자 회원가입
  // ===========================
  @PostMapping("/signup/buyer")
  public ResponseEntity<?> signupBuyer(@RequestBody SignupRequest req) {
    try {
      userService.registerBuyer(req);
      return ResponseEntity.ok(Map.of("ok", true));
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(Map.of("ok", false, "message", e.getMessage()));
    }
  }

  // ===========================
  // 비밀번호 찾기: 인증코드 발송
  // body: { email }
  // ===========================
  @PostMapping("/password/forgot")
  public Map<String, Object> sendResetCode(@RequestBody Map<String, String> req) {
    String email = req.get("email");
    if (email == null || !email.matches("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$")) {
      return Map.of("ok", false, "message", "이메일 형식 오류");
    }

    if (userService.findByEmail(email) == null) {
      // 보안상 바로 ok 처리
      return Map.of("ok", true, "requestId", "", "message", "가입된 이메일이 아닙니다.");
    }

    String requestId = java.util.UUID.randomUUID().toString();
    String code = String.format("%06d", new Random().nextInt(1_000_000));
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
      return Map.of("ok", false, "message", "메일 발송 중 오류: " + e.getMessage());
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
      return ResponseEntity.badRequest().body(Map.of("ok", false, "message", "파라미터 누락"));
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
      // 일회성 토큰 제거
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
      // 키 이름 혼재 방지: 둘 다 세팅
      httpSession.setAttribute("LOGIN_USER_TYPE", user.getUserType());
      httpSession.setAttribute("LOGIN_TYPE", user.getUserType());
      httpSession.setAttribute("LOGIN_PROVIDER", user.getProvider());

      return ResponseEntity.ok().build();
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
    }
  }

  // ===========================
  // 로그아웃
  // ===========================
  @PostMapping("/logout")
  public ResponseEntity<Void> logout(HttpSession s) {
    s.invalidate();
    return ResponseEntity.noContent().build();
  }

  // ===========================
  // 내 정보 확인 (세션)
  // ===========================
  @GetMapping("/me")
  public ResponseEntity<?> me(
	        HttpSession session, 
	        HttpServletRequest request,
	        @RequestParam(required = false) String sessionId) {
	        
	        // --- 디버깅용 로그 ---
	        System.out.println("=== /api/auth/me 호출 ===");
	        System.out.println("세션 ID: " + session.getId());
	        System.out.println("요청 헤더 Cookie: " + request.getHeader("Cookie"));
	        System.out.println("LOGIN_ID: " + session.getAttribute("LOGIN_ID"));

	        // 1. 세션에서 로그인 ID를 가져옵니다.
	        Object idObject = session.getAttribute("LOGIN_ID");
	        String userId = null;

	        if (idObject instanceof String) {
	            userId = (String) idObject;
	        }

	        // 2. 로그인 ID가 세션에 없는 경우, 인증 실패로 처리합니다.
	        if (userId == null || userId.isEmpty()) {
	            System.out.println("세션에 LOGIN_ID가 없음 - UNAUTHORIZED 반환");
	            // 세션 ID가 쿼리 파라미터로 전달된 경우, 해당 로직을 처리할 수 있습니다.
	            // 여기서는 기존 세션 기반 인증에 집중합니다.
	            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
	        }
	        
	        try {
	            // 3. userService를 통해 사용자의 일반 정보를 가져옵니다.
	            User user = userService.findById(userId);

	            // 4. auctionService를 통해 사용자의 재정 정보를 가져옵니다.
	            CurrentUser currentUserDetails = auctionService.findByUserId(userId);
	            
	            // 5. 사용자를 찾을 수 없거나 재정 정보가 없는 경우, 예외 처리합니다.
	            if (user == null || currentUserDetails == null) {
	                System.out.println("사용자 또는 재정 정보를 찾을 수 없음: " + userId);
	                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
	            }

	            // 6. 두 서비스에서 가져온 정보를 하나의 Map에 통합합니다.
	            Map<String, Object> userInfo = new HashMap<>();
	            userInfo.put("id", user.getId());
	            userInfo.put("email", user.getEmail());
	            userInfo.put("name", user.getUserName());
	            userInfo.put("userType", user.getUserType());
	            userInfo.put("tel", user.getTel() != null ? user.getTel() : "");
	            userInfo.put("address", user.getAddress() != null ? user.getAddress() : "");
	            userInfo.put("businessNumber", user.getBusinessNumber() != null ? user.getBusinessNumber() : "");
	            
	            // 재정 정보 추가
	            userInfo.put("totalBalance", currentUserDetails.getTotalBalance());
	            userInfo.put("bidDeposit", currentUserDetails.getBidDeposit());

	            System.out.println("통합 사용자 정보 반환: " + userInfo);
	            return ResponseEntity.ok(userInfo);

	        } catch (Exception e) {
	            System.out.println("사용자 정보 조회 중 오류 발생: " + e.getMessage());
	            e.printStackTrace();
	            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
	        }
	    }

  // 필요 시 역할 저장 API는 UserService에 메서드가 있을 때만 추가하세요.
  // @PostMapping("/me/user-type") ...
}
