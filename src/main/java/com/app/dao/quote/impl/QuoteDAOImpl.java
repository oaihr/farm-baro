package com.app.dao.quote.impl;

import java.util.List;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.app.dao.quote.QuoteDAO;
import com.app.dto.quote.QuoteDTO;

@Repository
public class QuoteDAOImpl implements QuoteDAO{

	@Autowired
	SqlSessionTemplate sqlSessionTemplate;

	@Override
	public int saveQuoteInfo(QuoteDTO quoteDTO) {
		int result = sqlSessionTemplate.insert("quote_mapper.saveQuoteInfo", quoteDTO);
		return result;
	}

	//존재여부 확인
	@Override
	public QuoteDTO checkDay(String day) {
		QuoteDTO dayList = sqlSessionTemplate.selectOne("quote_mapper.checkDay", day);
		return dayList;
	}

	@Override
	public List<QuoteDTO> dayList(String day) {
		List<QuoteDTO> dayList = sqlSessionTemplate.selectList("quote_mapper.dayList", day);
		return dayList;
	}







	
}
