package com.app.controller.api;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.dto.auction.CurrentUser;
import com.app.service.AuctionService;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ApiController {
	
	@Autowired
	AuctionService auctionService;
	
	@GetMapping("/api/auth/current-user")
	public CurrentUser getCurrentUser (HttpSession session) {
		String userId = (String) session.getAttribute("LOGIN_ID");
		
		// 디버깅용 로그
		System.out.println("=== /api/auth/current-user 호출 ===");
		System.out.println("Session ID: " + session.getId());
		System.out.println("User ID from session: " + userId);
		
		if (userId == null) {
			System.out.println("세션이 무효화되었거나 로그인되지 않음");
            return new CurrentUser(null, 0L, 0L);
        }
		
		CurrentUser currentUser = auctionService.findByUserId(userId);
		System.out.println("CurrentUser: " + currentUser);
		
		return currentUser;
	}
	
//	@PostMapping("/api/auth/logout")
//	public void logout(HttpSession session) {
//		session.invalidate();
//	}
}