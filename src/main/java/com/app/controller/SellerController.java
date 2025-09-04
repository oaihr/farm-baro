package com.app.controller;

import com.app.dto.seller.EmailReq;
import com.app.dto.seller.EmailVerifyReq;
import com.app.dto.seller.SellerSignupPayload;
import com.app.mapper.UserMapper;
import com.app.service.user.email.EmailService;
import com.fasterxml.jackson.databind.ObjectMapper;

import javax.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.*;
import java.util.*;

@RestController
@RequestMapping("/api/sellers")
@RequiredArgsConstructor
@Slf4j
public class SellerController {

	private final UserMapper userMapper; // 이메일 중복 체크에 사용(이미 있으면 재사용)
	private final EmailService emailService; // 이미 프로젝트에 존재(패키지 스샷 기준)
	private final HttpSession session;
	private final com.app.service.user.UserService userService;

	@GetMapping("/validate-email")
	public Map<String, Object> validateEmail(@RequestParam String email) {
		boolean ok = userMapper.existsByEmail(email) == 0; // 없으면 0
		return Map.of("ok", ok);
	}

	@PostMapping("/email/send")
	public Map<String, Object> sendEmailCode(@RequestBody EmailReq req, HttpSession session) {
		boolean available = userMapper.existsByEmail(req.getEmail()) == 0;
		if (!available)
			return Map.of("ok", false, "message", "이미 사용 중인 이메일입니다.");

		String code = String.format("%06d", new java.util.Random().nextInt(1_000_000));
		session.setAttribute("EMAIL_OTP:" + req.getEmail(), code);
		session.setAttribute("EMAIL_OTP_TS:" + req.getEmail(), System.currentTimeMillis());

		emailService.send(req.getEmail(), "[목장바로] 이메일 인증코드", "인증코드: " + code + "\n유효시간: 3분");
		return Map.of("ok", true);
	}

	@PostMapping("/email/verify")
	public Map<String, Object> verifyEmailCode(@RequestBody EmailVerifyReq req) {
		String key = "EMAIL_OTP:" + req.getEmail();
		String saved = (String) session.getAttribute(key);
		Long ts = (Long) session.getAttribute("EMAIL_OTP_TS:" + req.getEmail());
		boolean ok = saved != null && saved.equals(req.getCode()) && ts != null
				&& (System.currentTimeMillis() - ts) < 180_000;
		return Map.of("ok", ok);
	}

	@GetMapping("/check-brn")
	public Map<String, Object> checkBrn(@RequestParam String brn) {
		// TODO: 국세청/중복 검증. 현재는 프론트 흐름 테스트용으로 true
		return Map.of("ok", true);
	}

	@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Map<String, Object>> create(@RequestPart("payload") String payloadJson,
			@RequestPart(value = "brnFile", required = false) MultipartFile brnFile) {

		try {
			// 1) JSON 파싱
			SellerSignupPayload payload = new ObjectMapper().readValue(payloadJson, SellerSignupPayload.class);

			// 2) (선택) 파일 저장
			String savedPath = null;
			if (brnFile != null && !brnFile.isEmpty()) {
				Path dir = Paths.get("C:/farmbaro/upload/seller");
				Files.createDirectories(dir);
				Path dest = dir.resolve(System.currentTimeMillis() + "_" + brnFile.getOriginalFilename());
				brnFile.transferTo(dest.toFile());
				savedPath = dest.toString();
			}

			// 3) DB 저장 (PENDING)
			userService.registerSeller(payload, savedPath);

			return ResponseEntity.ok(Map.of("ok", true));
		} catch (Exception e) {
			// ★ 어떤 단계에서 터졌는지 바로 보이게 로그 + 응답
			log.error("[/api/sellers] submit failed, payloadJson={}", payloadJson, e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("ok", false, "message",
					e.getClass().getSimpleName(), "detail", String.valueOf(e.getMessage())));

		}
	}

	// ★ 디버그용: 프론트-서버 핸드셰이크 확인 (원인 좁히기)
	@PostMapping(path = "/debug/parse", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public Map<String, Object> debugParse(@RequestPart("payload") String payloadJson,
			@RequestPart(value = "brnFile", required = false) MultipartFile file) throws Exception {
		SellerSignupPayload p = new ObjectMapper().readValue(payloadJson, SellerSignupPayload.class);
		return Map.of("email", p.getBasic().getEmail(), "brn", p.getBusiness().getBrn(), "hasFile", file != null,
				"fileName", file != null ? file.getOriginalFilename() : null);
	}
}
