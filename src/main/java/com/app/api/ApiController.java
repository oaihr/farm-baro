package com.app.api;

import javax.servlet.http.HttpSession;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ApiController {
	@GetMapping("/api/auth/current-user")
	public String getCurrentUserId (HttpSession session) {
		String userId = (String) session.getAttribute("LOGIN_ID");
		System.out.println("User ID from session: " + userId);
		return userId;
	}
	
	
	
}
