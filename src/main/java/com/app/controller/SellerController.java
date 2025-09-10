package com.app.controller;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;

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

  @GetMapping("/validate-email")
  public Map<String, Object> validateEmail(@RequestParam String email) {
    boolean ok = userMapper.existsByEmail(email) == 0; // 사용 가능하면 true
    return Map.of("ok", ok);
  }

  @PostMapping(value = "/email/send", consumes = MediaType.APPLICATION_JSON_VALUE)
  public Map<String, Object> sendEmailCode(@RequestBody EmailReq req) {
    boolean available = userMapper.existsByEmail(req.getEmail()) == 0;
    if (!available) return Map.of("ok", false, "message", "이미 사용 중인 이메일입니다.");

    String code = String.format("%06d", new java.util.Random().nextInt(1_000_000));
    session.setAttribute("EMAIL_OTP:" + req.getEmail(), code);
    session.setAttribute("EMAIL_OTP_TS:" + req.getEmail(), System.currentTimeMillis());

    emailService.send(req.getEmail(), "[목장바로] 이메일 인증코드", "인증코드: " + code + "\n유효시간: 3분");
    return Map.of("ok", true);
  }

  @PostMapping(value = "/email/verify", consumes = MediaType.APPLICATION_JSON_VALUE)
  public Map<String, Object> verifyEmailCode(@RequestBody EmailVerifyReq req) {
    String key = "EMAIL_OTP:" + req.getEmail();
    String saved = (String) session.getAttribute(key);
    Long ts = (Long) session.getAttribute("EMAIL_OTP_TS:" + req.getEmail());
    boolean ok = saved != null && saved.equals(req.getCode())
        && ts != null && (System.currentTimeMillis() - ts) < 180_000;
    return Map.of("ok", ok);
  }

  @GetMapping("/check-brn")
  public Map<String, Object> checkBrn(@RequestParam String brn) {
    // TODO: 실제 중복/유효성 체크 로직
    return Map.of("ok", true);
  }

  /** 프론트는 반드시 FormData로 전송(멀티파트)해야 하며, payload는 JSON 문자열 */
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
}
