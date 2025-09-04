package com.app.controller;

import com.app.dto.auth.LoginRequest;
import com.app.dto.auth.SignupRequest;
import com.app.dto.auth.UserResponse;
import com.app.domain.User;
import com.app.service.user.UserService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import javax.validation.Valid;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dev-auth") // 개발/테스트용
@RequiredArgsConstructor
public class ApiAuthController {

    public static final String LOGIN_SESSION_KEY = "LOGIN_USER_ID";

    private final UserService userService; // @Autowired 대신 final + RequiredArgsConstructor

    // 헬스체크
    @GetMapping({"/ping", "/ping/"})
    public String ping() { return "pong"; }

    // 회원가입
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody SignupRequest req, HttpSession s) {
        // ★ 1) 이메일 정규화(공백 제거 + 소문자화)
        String email = req.getEmail().trim().toLowerCase();

        // ★ 2) 중복 이메일 응답 포맷을 프론트 친화적으로(JSON)
        User existed = userService.findByEmail(email);
        if (existed != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(error("이미 사용 중인 이메일입니다.")
                          .field("email", "이미 사용 중인 이메일입니다."));
        }

        // 서비스에서 저장(네가 쓰는 방식 유지)
        User saved = userService.signupLocal(
                email,
                req.getPassword(),
                req.getUserName(),
                req.getTel()
                // 필요하면 address/role/businessNumber 나중에 파라미터 추가
        );

        // 자동 로그인(선택사항 그대로 유지)
        s.setAttribute(LOGIN_SESSION_KEY, saved.getId());

        // 생성 완료 응답
        return ResponseEntity.status(HttpStatus.CREATED).body(UserResponse.from(saved));
    }

    // 로그인
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req, HttpSession s) {
        User u = userService.login(req.getEmail(), req.getPassword());
        if (u == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(error("이메일 또는 비밀번호가 올바르지 않습니다.")
                          .field("email", "자격 증명이 올바르지 않습니다.")
                          .field("password", "자격 증명이 올바르지 않습니다."));
        }
        s.setAttribute(LOGIN_SESSION_KEY, u.getId());
        return ResponseEntity.ok(UserResponse.from(u));
    }

    // 내 정보
    @GetMapping("/me")
    public ResponseEntity<?> me(HttpSession s) {
        Object userId = s.getAttribute(LOGIN_SESSION_KEY);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("NOT_LOGIN");
        }
        User u = userService.findById(userId.toString());
        return ResponseEntity.ok(UserResponse.from(u));
    }

    // 로그아웃
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession s) {
        s.invalidate();
        return ResponseEntity.ok("OK");
    }

    // ---------- 응답 도우미 ----------
    private static ErrorResponse error(String message) { return new ErrorResponse(message); }

    static class ErrorResponse {
        public String message;
        public Map<String, String> errors = new LinkedHashMap<>();
        ErrorResponse(String msg) { this.message = msg; }
        ErrorResponse field(String name, String msg) { this.errors.put(name, msg); return this; }
    }
}
