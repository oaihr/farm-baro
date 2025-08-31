package com.app.controller.quote;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.app.dto.quote.QuoteDTO;
import com.app.service.quote.QuoteService;

@RequestMapping("/quote")
public class QuoteController {

	@Autowired
	QuoteService quoteService;
	
	//날짜 데이터 확인 주소
	@GetMapping("/checkDay")
	@ResponseBody
	public String checkDay(@RequestParam("day") String day) {

		if(day == null) {
			return "redirect:/save";
		} else {
			return "redirect:/quote/day";
		}
		
	}
	
	
	//날짜 데이터 있는 경우 react 표기용
	//day
	@GetMapping() 
	public List<QuoteDTO> day() {
		
		return null;
	}
	
	//month
	
	
	//year
	
}
