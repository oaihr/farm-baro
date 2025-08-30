package com.app.dao.quote;

import java.util.List;

import com.app.dto.quote.QuoteDTO;

public interface QuoteDAO {

	public int saveQuoteInfo(QuoteDTO quoteDTO);
	public String checkDay(QuoteDTO quoteDTO);
}
