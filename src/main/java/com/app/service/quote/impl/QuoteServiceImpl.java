package com.app.service.quote.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.app.dao.quote.QuoteDAO;
import com.app.dto.quote.QuoteDTO;
import com.app.dto.quote.QuoteDTOM;
import com.app.dto.quote.QuoteDTOY;
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
	public int saveQuoteMInfo(QuoteDTOM quoteDTO) {
		int result = quoteDAO.saveQuoteMInfo(quoteDTO);
		return result;
	}

	@Override
	public int saveQuoteYInfo(QuoteDTOY quoteDTO) {
		int result = quoteDAO.saveQuoteYInfo(quoteDTO);
		return result;
	}

	@Override
	public QuoteDTO checkDay(String day) {
		QuoteDTO dayList = quoteDAO.checkDay(day);
		return dayList;
	}
	
	@Override
	public QuoteDTOM checkDayM(String day) {
		QuoteDTOM dayList = quoteDAO.checkDayM(day);
		return dayList;
	}

	@Override
	public QuoteDTOY checkDayY(String day) {
		QuoteDTOY dayList = quoteDAO.checkDayY(day);
		return dayList;
	}

	@Override
	public List<QuoteDTO> dayList(String day) {
		List<QuoteDTO> dayList = quoteDAO.dayList(day);
		return dayList;
	}

	@Override
	public List<QuoteDTOM> dayListM(String day) {
		List<QuoteDTOM> dayList = quoteDAO.dayListM(day);
		return dayList;
	}

	@Override
	public List<QuoteDTOY> dayListY(String day) {
		List<QuoteDTOY> dayList = quoteDAO.dayListY(day);
		return dayList;
	}

	@Override
	public int standYmNullUpdate(String day) {
		int result = quoteDAO.standYmNullUpdate(day);
		return result;
	}


}
