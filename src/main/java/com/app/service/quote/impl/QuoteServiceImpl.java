package com.app.service.quote.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.app.dao.quote.QuoteDAO;
import com.app.dto.quote.QuoteDTO;
import com.app.service.quote.QuoteService;

@Service
public class QuoteServiceImpl implements QuoteService{

	@Autowired
	QuoteDAO quoteDAO;
	
	@Override
	public int saveQuoteInfo(QuoteDTO quoteDTO) {
		int result = quoteDAO.saveQuoteInfo(quoteDTO);
		return result;
	}

	@Override
	public QuoteDTO checkDay(String day) {
		QuoteDTO dayList = quoteDAO.checkDay(day);
		return dayList;
	}

	@Override
	public List<QuoteDTO> dayList(String day) {
		List<QuoteDTO> dayList = quoteDAO.dayList(day);
		return dayList;
	}








	
	
}
