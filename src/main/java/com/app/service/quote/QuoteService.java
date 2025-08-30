package com.app.service.quote;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.app.dao.quote.QuoteDAO;
import com.app.dto.quote.QuoteDTO;

@Service
public interface QuoteService {
	
	public String checkDay(QuoteDTO quoteDTO);
}
