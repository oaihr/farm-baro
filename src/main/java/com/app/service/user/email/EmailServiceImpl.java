package com.app.service.user.email;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {
  private final JavaMailSender mailSender;
  @Override
  public void send(String to, String subject, String text) {
    SimpleMailMessage msg = new SimpleMailMessage();
    msg.setFrom("gagajooyo@naver.com"); // ★ 네이버는 계정과 동일해야 함
    msg.setTo(to);
    msg.setSubject(subject);
    msg.setText(text);
    mailSender.send(msg);
  }
}
