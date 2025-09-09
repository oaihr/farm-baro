package com.app.controller.api;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.service.AuctionService;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ApiController {
	
	@Autowired
	AuctionService auctionService;
	
	
	@GetMapping("/api/auth/logout")
	public void logout(HttpSession session) {
		session.invalidate();
	}
}