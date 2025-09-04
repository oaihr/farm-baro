package com.app.service.user.email;

public interface EmailService {
    void send(String to, String subject, String text);

	void verify(String requestId, String code);
}
