package com.app.controller;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.Random;

import javax.servlet.http.HttpSession;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.app.dto.seller.EmailReq;
import com.app.dto.seller.EmailVerifyReq;
import com.app.dto.seller.SellerSignupPayload;
import com.app.mapper.UserMapper;
import com.app.service.user.email.EmailService;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/sellers")
@RequiredArgsConstructor
@Slf4j
public class SellerController {

  private final UserMapper userMapper;
  private final EmailService emailService;
  private final HttpSession session;
  private final com.app.service.user.UserService userService;

  private static final String OTP_KEY  = "EMAIL_OTP:";
  private static final String OTP_TS   = "EMAIL_OTP_TS:";
  private static final long   OTP_TTL  = 180_000L; // 3분

  /** 이메일 중복확인: 공백 제거 + 소문자 통일로 일관 비교 */
  @GetMapping("/validate-email")
  public Map<String, Object> validateEmail(@RequestParam String email) {
    final String e = normEmail(email);
    int cnt = userMapper.existsByEmail(e);
    log.info("[validate-email] email='{}' (norm='{}') -> count={}", email, e, cnt);
    boolean ok = cnt == 0;
    return Map.of("ok", ok);
  }

  /** 인증 코드 발송: 사용 가능 이메일만 발송 */
  @PostMapping(value = "/email/send", consumes = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<Map<String, Object>> sendEmailCode(@RequestBody EmailReq req) {
    final String e = normEmail(req.getEmail());
    int cnt = userMapper.existsByEmail(e);
    log.info("[email/send] request='{}' (norm='{}') -> count={}", req.getEmail(), e, cnt);
    if (cnt > 0) {
      return ResponseEntity.status(HttpStatus.CONFLICT)
          .body(Map.of("ok", false, "message", "이미 사용 중인 이메일입니다."));
    }

    String code = String.format("%06d", new Random().nextInt(1_000_000));
    session.setAttribute(OTP_KEY + e, code);
    session.setAttribute(OTP_TS + e, System.currentTimeMillis());

    emailService.send(e, "[목장바로] 이메일 인증코드", "인증코드: " + code + "\n유효시간: 3분");
    return ResponseEntity.ok(Map.of("ok", true));
  }

  /** 인증 코드 검증 */
  @PostMapping(value = "/email/verify", consumes = MediaType.APPLICATION_JSON_VALUE)
  public Map<String, Object> verifyEmailCode(@RequestBody EmailVerifyReq req) {
    final String e = normEmail(req.getEmail());
    String saved = (String) session.getAttribute(OTP_KEY + e);
    Long ts      = (Long)   session.getAttribute(OTP_TS + e);

    boolean ok = saved != null
        && saved.equals(req.getCode())
        && ts != null
        && (System.currentTimeMillis() - ts) < OTP_TTL;

    log.info("[email/verify] email='{}' (norm='{}') saved={}, ok={}", req.getEmail(), e, mask(saved), ok);
    return Map.of("ok", ok);
  }

  /** 사업자등록번호 간단 체크 (실제 검증은 추후 연동) */
  @GetMapping("/check-brn")
  public Map<String, Object> checkBrn(@RequestParam String brn) {
    return Map.of("ok", true);
  }

  /** 판매자 가입(검수요청) — 프론트는 반드시 멀티파트(FormData)로 전송 */
  @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
               produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<Map<String, Object>> create(
      @RequestPart("payload") String payloadJson,
      @RequestPart(value = "brnFile", required = false) MultipartFile brnFile) {

    try {
      // 1) JSON 파싱
      SellerSignupPayload payload = new ObjectMapper().readValue(payloadJson, SellerSignupPayload.class);

      // 2) 파일 저장(선택)
      String savedPath = null;
      if (brnFile != null && !brnFile.isEmpty()) {
        Path dir = Paths.get("C:/farmbaro/upload/seller");
        Files.createDirectories(dir);
        Path dest = dir.resolve(System.currentTimeMillis() + "_" + brnFile.getOriginalFilename());
        brnFile.transferTo(dest.toFile());
        savedPath = dest.toString();
      }

      // 3) DB 저장 (상태 PENDING)
      userService.registerSeller(payload, savedPath);
      return ResponseEntity.ok(Map.of("ok", true));

    } catch (Exception e) {
      log.error("[/api/sellers] submit failed, payloadJson={}", payloadJson, e);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(Map.of("ok", false,
                       "message", e.getClass().getSimpleName(),
                       "detail", String.valueOf(e.getMessage())));
    }
  }

  /** 이메일 비교 표준화: null 안전 + trim + lower-case */
  private String normEmail(String email) {
    return email == null ? "" : email.trim().toLowerCase();
  }

  private String mask(String s) {
    if (s == null || s.length() < 2) return "null";
    return s.charAt(0) + "****" + s.charAt(s.length()-1);
  }
}
