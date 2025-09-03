package com.app.dao.quote.impl;

import java.util.List;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.app.dao.quote.QuoteDAO;
import com.app.dto.quote.QuoteDTO;
import com.app.dto.quote.QuoteDTOM;
import com.app.dto.quote.QuoteDTOY;

@Repository
public class QuoteDAOImpl implements QuoteDAO{

	@Autowired
	SqlSessionTemplate sqlSessionTemplate;

	@Override
	public int saveQuoteInfo(QuoteDTO quoteDTO) {
		int result = sqlSessionTemplate.insert("quote_mapper.saveQuoteInfo", quoteDTO);
		return result;
	}
	
	@Override
	public int saveQuoteMInfo(QuoteDTOM quoteDTO) {
		int result = sqlSessionTemplate.insert("quote_mapper.saveQuoteMInfo", quoteDTO);
		return result;
	}

	@Override
	public int saveQuoteYInfo(QuoteDTOY quoteDTO) {
		int result = sqlSessionTemplate.insert("quote_mapper.saveQuoteYInfo", quoteDTO);
		return result;
	}

	//존재여부 확인
	@Override
	public QuoteDTO checkDay(String day) {
		QuoteDTO dayList = sqlSessionTemplate.selectOne("quote_mapper.checkDay", day);
		return dayList;
	}
	
	@Override
	public QuoteDTOM checkDayM(String day) {
		QuoteDTOM dayList = sqlSessionTemplate.selectOne("quote_mapper.checkDayM", day);
		return dayList;
	}

	@Override
	public QuoteDTOY checkDayY(String day) {
		QuoteDTOY dayList = sqlSessionTemplate.selectOne("quote_mapper.checkDayY", day);
		return dayList;
	}
	
	
	//list 담기
	@Override
	public List<QuoteDTO> dayList(String day) {
		List<QuoteDTO> dayList = sqlSessionTemplate.selectList("quote_mapper.dayList", day);
		return dayList;
	}

	@Override
	public List<QuoteDTOM> dayListM(String day) {
		List<QuoteDTOM> dayList = sqlSessionTemplate.selectList("quote_mapper.dayListM", day);
		return dayList;
	}

	@Override
	public List<QuoteDTOY> dayListY(String day) {
		List<QuoteDTOY> dayList = sqlSessionTemplate.selectList("quote_mapper.dayListY", day);
		return dayList;
	}

	@Override
	public int standYmNullUpdate(String day) {
		int result = sqlSessionTemplate.update("quote_mapper.standYmNullUpdate", day);
		return result;
	}


	
}
