package com.app.controller.quote;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.app.api.quote.QuoteAPI;
import com.app.dto.quote.QuoteDTO;
import com.app.dto.quote.QuoteDTOM;
import com.app.dto.quote.QuoteDTOY;
import com.app.service.quote.QuoteService;

@RestController
@RequestMapping("/quote")
public class QuoteAPIController {

	@Autowired
	QuoteService quoteService;

	@Autowired
	QuoteAPI quoteAPI;

	// 날짜 데이터 확인 주소 => 일자
	@GetMapping("/checkDay")
	public List<QuoteDTO> checkDay(@RequestParam("day") String day) {

		System.out.println(day);
		QuoteDTO checkDay = quoteService.checkDay(day);
		System.out.println(checkDay);

		String[] dayArr = day.split("");

		if (checkDay == null) {
			String saveQuote = quoteAPI.quoteAPIDay(day);
			System.out.println(saveQuote);

			List<QuoteDTO> dayList = quoteService.dayList(day);
			System.out.println("if : " + dayList);
			
			// db 정보 -> react로 반환
			return dayList;
		} else {
			List<QuoteDTO> dayList = quoteService.dayList(day);
			System.out.println("else : " + dayList);

			return dayList;
		}
	}

	@GetMapping("/checkMonth")
	public List<QuoteDTOM> checkMonth(@RequestParam("day") String day, HttpServletRequest request) {
		System.out.println(day);
		QuoteDTOM checkDay = quoteService.checkDayM(day);
		System.out.println(checkDay);

		String[] dayArr = day.split("");

		if (checkDay == null) {
			String saveQuote = quoteAPI.quoteAPIMonth(day);
			System.out.println(saveQuote);

			int result = quoteService.standYmNullUpdate(day);
			if(result > 0) { //정상적으로 저장 성공
				System.out.println("update 성공");
			} else { //저장 실패
				System.out.println("update 실패");
			}
			
			List<QuoteDTOM> dayList = quoteService.dayListM(day);
			System.out.println("if : " + dayList);

			return dayList;
		} else {
			List<QuoteDTOM> dayList = quoteService.dayListM(day);
			System.out.println("else : " + dayList);

			return dayList;
		}
	}

	@GetMapping("/checkYear")
	public List<QuoteDTOY> checkYear(@RequestParam("day") String day) {
		System.out.println(day);
		QuoteDTOY checkDay = quoteService.checkDayY(day);
		System.out.println(checkDay);

		String[] dayArr = day.split("");

		if (checkDay == null) {
			String saveQuote = quoteAPI.quoteAPIYear(day);
			System.out.println(saveQuote);

			List<QuoteDTOY> dayList = quoteService.dayListY(day);
			System.out.println("if : " + dayList);

			return dayList;
		} else {
			List<QuoteDTOY> dayList = quoteService.dayListY(day);
			System.out.println("else : " + dayList);

			return dayList;
		}

	}

}
