package com.app.service.quote;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.app.dao.quote.QuoteDAO;
import com.app.dto.quote.QuoteDTO;
import com.app.dto.quote.QuoteDTOM;
import com.app.dto.quote.QuoteDTOY;

@Service
public interface QuoteService {
	
	public int saveQuoteInfo(QuoteDTO quoteDTO);
	public int saveQuoteMInfo(QuoteDTOM quoteDTO);
	public int saveQuoteYInfo(QuoteDTOY quoteDTO);
	public QuoteDTO checkDay(String day);
	public QuoteDTOM checkDayM(String day);
	public QuoteDTOY checkDayY(String day);
	public List<QuoteDTO> dayList(String day);
	public List<QuoteDTOM> dayListM(String day);
	public List<QuoteDTOY> dayListY(String day);

	public int standYmNullUpdate(String day);
}
