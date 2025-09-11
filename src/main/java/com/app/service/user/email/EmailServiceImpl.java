package com.app.service.user.email;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {
  // private final JavaMailSender mailSender; // 임시로 주석 처리
  
  @Override
  public void send(String to, String subject, String text) {
    // 임시로 로그만 출력
    System.out.println("=== 이메일 발송 시뮬레이션 ===");
    System.out.println("To: " + to);
    System.out.println("Subject: " + subject);
    System.out.println("Text: " + text);
    System.out.println("===============================");
    
    // 실제 메일 발송은 나중에 구현
    // SimpleMailMessage msg = new SimpleMailMessage();
    // msg.setFrom("gagajooyo@naver.com"); // ★ 네이버는 계정과 동일해야 함
    // msg.setTo(to);
    // msg.setSubject(subject);
    // msg.setText(text);
    // mailSender.send(msg);
  }
  
  @Override
  public void verify(String requestId, String code) {
    // 임시로 로그만 출력
    System.out.println("=== 이메일 인증 시뮬레이션 ===");
    System.out.println("RequestId: " + requestId);
    System.out.println("Code: " + code);
    System.out.println("===============================");
    
    // 실제 인증 로직은 나중에 구현
  }
}
