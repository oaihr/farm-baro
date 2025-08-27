package com.app.controller.quote;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class QuoteController {

	@GetMapping("/api/prices{}")
	public String prices() {
		
		return "";
	}
}
