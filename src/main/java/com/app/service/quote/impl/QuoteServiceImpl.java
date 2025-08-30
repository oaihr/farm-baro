package com.app.service.quote.impl;

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
	public int getQuoteInfo() {
		// TODO Auto-generated method stub
		return 0;
	}

	
	
}
