package com.app.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controlle   
public class TestController {

	
	@GetMapping("/main")
	public String main() {
		
		return "test";
	}
}
