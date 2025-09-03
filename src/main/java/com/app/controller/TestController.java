package com.app.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller  
public class TestController {

	
	@GetMapping("/main")
	public String main() {
		
		return "test";
	}
	
	@GetMapping("/test")
	@ResponseBody
	public String test() {
		return "Hello World!";
	}
}
