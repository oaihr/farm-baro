package com.app.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

@Configuration
public class MailConfig {

    @Bean
    public JavaMailSender javaMailSender() {
        JavaMailSenderImpl s = new JavaMailSenderImpl();
        s.setHost("smtp.gmail.com");  // 사용 메일 서버로 교체 가능
        s.setPort(587);
        s.setUsername("YOUR_EMAIL@gmail.com");   // 발신 계정
        s.setPassword("APP_PASSWORD");           // 앱 비밀번호

        Properties p = s.getJavaMailProperties();
        p.put("mail.smtp.auth", "true");
        p.put("mail.smtp.starttls.enable", "true");
        return s;
    }
}
