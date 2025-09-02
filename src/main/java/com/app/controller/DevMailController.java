package com.app.controller;

import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/dev-mail")
@RequiredArgsConstructor
public class DevMailController {
  private final JavaMailSenderImpl mailSender;

  @GetMapping("/ping")
  public Map<String, Object> ping() {
    Map<String, Object> r = new LinkedHashMap<>();
    r.put("host", mailSender.getHost());
    r.put("port", mailSender.getPort());
    r.put("user", mailSender.getUsername());
    try {
      mailSender.testConnection(); // SMTP 서버 접속/로그인 테스트
      r.put("ok", true);
    } catch (Exception e) {
      r.put("ok", false);
      r.put("error", e.getClass().getName());
      r.put("message", e.getMessage());
    }
    return r;
  }
}
