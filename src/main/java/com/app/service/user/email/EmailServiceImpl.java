package com.app.service.user.email;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.nio.charset.StandardCharsets;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

  private final JavaMailSender mailSender;

  private String getFromAddress() {
    if (mailSender instanceof JavaMailSenderImpl) {
      return ((JavaMailSenderImpl) mailSender).getUsername(); // root-context.xml의 username 값
    }
    // fallback
    return "no-reply@example.com";
  }

  @Override
  public void send(String to, String subject, String text) {
    try {
      MimeMessage mime = mailSender.createMimeMessage();
      MimeMessageHelper helper = new MimeMessageHelper(mime, false, StandardCharsets.UTF_8.name());
      helper.setFrom(new InternetAddress(getFromAddress(), "목장바로", StandardCharsets.UTF_8.name()));
      helper.setTo(to);
      helper.setSubject(subject);
      helper.setText(text, false); // 평문. HTML이면 true
      mailSender.send(mime);
    } catch (Exception e) {
      throw new IllegalStateException("메일 발송 실패: " + e.getMessage(), e);
    }
  }

  @Override
  public void verify(String requestId, String code) {
    // 필요 없으면 비워두셔도 됩니다(인터페이스 유지용).
  }
}
