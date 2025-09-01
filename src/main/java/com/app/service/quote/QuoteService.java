package com.app.service.quote;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.app.dao.quote.QuoteDAO;
import com.app.dto.quote.QuoteDTO;

@Service
public interface QuoteService {
	
	public int saveQuoteInfo(QuoteDTO quoteDTO);
	public QuoteDTO checkDay(String day);
	public List<QuoteDTO> dayList(String day);

	
}
