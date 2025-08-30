package com.app.controller.quote;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.app.dto.quote.QuoteDTO;
import com.app.service.quote.QuoteService;

@RequestMapping("/quote")
public class QuoteController {

	@Autowired
	QuoteService quoteService;
	
	@GetMapping("/nodata")
	public String nodata() {
		return "redirect:/save";
	}
	
	@GetMapping("/check")
	public String check(QuoteDTO quoteDTO) {
		
		//react에서 넘어온 날짜
		
		
		String day = quoteService.checkDay(quoteDTO); //
		
		if() { //조회 정보가 없는 경우
			
		} else { //조회 정보가 있는 경우
			
		}
		
		return "";
	}
	
	
	
}
