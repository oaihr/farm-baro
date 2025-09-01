package com.app.controller.quote;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.app.api.quote.QuoteAPI;
import com.app.dto.quote.QuoteDTO;
import com.app.service.quote.QuoteService;

@RestController
@RequestMapping("/quote")
public class QuoteAPIController {
	
	@Autowired
	QuoteService quoteService;
	
	@Autowired
	QuoteAPI quoteAPI;

	
	//날짜 데이터 확인 주소 => 일자
	@GetMapping("/checkDay")
	public List<QuoteDTO> checkDay(@RequestParam("day") String day) {

		System.out.println(day);
		QuoteDTO checkDay = quoteService.checkDay(day);
		System.out.println(checkDay);
		
		if(checkDay == null) {
			String saveQuote = quoteAPI.quoteAPI(day);
			System.out.println(saveQuote);
			
			List<QuoteDTO> dayList = quoteService.dayList(day);
			System.out.println("if : " + dayList);
			
			//db 정보 -> react로 반환
			return dayList;
		} else {
			List<QuoteDTO> dayList = quoteService.dayList(day);
			System.out.println("else : " + dayList);
			return dayList;
		}
		
	}
	
	
	//날짜 데이터 확인 주소 => 달
	@GetMapping("/checkMonth")
	@ResponseBody
	public String checkMonth(@RequestParam("month") String day) {

		if(day == null) {
			return "redirect:/save";
		} else {
			return "redirect:/quote/month";
		}
		
	}
	
	
	//날짜 데이터 확인 주소 => 년도
	@GetMapping("/checkYear")
	@ResponseBody
	public String checkYear(@RequestParam("year") String day) {

		if(day == null) {
			return "redirect:/save";
		} else {
			return "redirect:/quote/year";
		}
		
	}
}
