package com.app.controller.quote;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import com.app.dao.quote.QuoteDAO;
import com.app.dto.quote.QuoteDTO;

@Controller
@RequestMapping("/quote")
public class QuoteAPIController {

	// QuoteDAO 빈을 자동으로 주입받습니다.
	@Autowired
	private QuoteDAO quoteDAO;

	// XML 태그 값을 읽어오는 헬퍼 메서드
	private String getTagValue(String tag, Element eElement) {
		NodeList nlList = eElement.getElementsByTagName(tag);
		if (nlList != null && nlList.getLength() > 0) {
			Node nValue = nlList.item(0).getFirstChild();
			if (nValue != null) {
				return nValue.getNodeValue();
			}
		}
		return null;
	}

	// 서버 URL: /quote/save 로 GET 요청이 오면 이 메서드가 실행됩니다.
	@GetMapping("/save")
	@ResponseBody // 메서드 반환 값을 HTTP 응답 본문으로 직접 전송합니다.
	public String saveQuoteData() {

		String[] itemCdKind = { "4301", "4304", "9901" }; // 소, 돼지, 닭

		try {

			// itemCdArray의 각 품목 코드에 대해 API를 호출하고 데이터를 저장합니다.
			for (String itemCdK : itemCdKind) {

				if (itemCdK.equals("4301")) {
					String[] itemCdCow = { "21", "22", "36", "40", "50" }; // 안심, 등심, 설도, 양지, 갈비

					for (String itemCdC : itemCdCow) {
						// API 호출 및 XML 데이터 확보 로직 (Quote.java에서 가져옴)
						StringBuilder urlBuilder = new StringBuilder(
								"http://data.ekape.or.kr/openapi-data/service/user/grade/consumerPriceDaily");
						urlBuilder.append("?" + URLEncoder.encode("serviceKey", "UTF-8")
								+ "=TO90wKscUg6u6rP5F%2BGib6c%2BZB23HOQfDM5pnjbHPlrXWlVNUe8JV0mJbe7JpfeuOQQZtupiIlN7w8AQUoo5lw%3D%3D");
						urlBuilder.append("&" + URLEncoder.encode("standYmd", "UTF-8") + "="
								+ URLEncoder.encode("20250829", "UTF-8"));
						urlBuilder.append("&" + URLEncoder.encode("judgeKind", "UTF-8") + "="
								+ URLEncoder.encode(itemCdK, "UTF-8"));
						urlBuilder.append(
								"&" + URLEncoder.encode("itemCd", "UTF-8") + "=" + URLEncoder.encode(itemCdC, "UTF-8"));

						URL url = new URL(urlBuilder.toString());
						HttpURLConnection conn = (HttpURLConnection) url.openConnection();
						conn.setRequestMethod("GET");
						conn.setRequestProperty("Content-type", "application/json");

						BufferedReader rd;
						if (conn.getResponseCode() >= 200 && conn.getResponseCode() <= 300) {
							rd = new BufferedReader(new InputStreamReader(conn.getInputStream()));
						} else {
							rd = new BufferedReader(new InputStreamReader(conn.getErrorStream()));
						}

						StringBuilder sb = new StringBuilder();
						String line;
						while ((line = rd.readLine()) != null) {
							sb.append(line);
						}
						rd.close();
						conn.disconnect();

						String xmlData = sb.toString();

						// XML 데이터 파싱 및 DB 저장
						DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
						DocumentBuilder builder = factory.newDocumentBuilder();
						Document doc = builder.parse(new ByteArrayInputStream(xmlData.getBytes("UTF-8")));
						doc.getDocumentElement().normalize();

						NodeList nList = doc.getElementsByTagName("item");

						for (int i = 0; i < nList.getLength(); i++) {
							Node node = nList.item(i);
							if (node.getNodeType() == Node.ELEMENT_NODE) {
								Element eElement = (Element) node;
								QuoteDTO quoteDTO = new QuoteDTO();
								quoteDTO.setStand_ymd(getTagValue("standYmd", eElement));
								quoteDTO.setGrade_name(getTagValue("grdNm", eElement));
								quoteDTO.setJudge_kind_name(getTagValue("judgeKindNm", eElement));
								quoteDTO.setJudge_kind(getTagValue("judgeKind", eElement));
								quoteDTO.setItem_name(getTagValue("itemNm", eElement));
								quoteDTO.setItem_code(getTagValue("itemCd", eElement));
								quoteDTO.setNet_sale_price(getTagValue("ntslPrc", eElement));
								quoteDTO.setMax_price(getTagValue("maxPrc", eElement));
								quoteDTO.setMin_price(getTagValue("minPrc", eElement));
								quoteDTO.setUnit(getTagValue("unit", eElement));

								quoteDAO.saveQuoteInfo(quoteDTO);
							}
						}
					}

				}

				if (itemCdK.equals("4304")) {
					String[] itemCdPig = { "25", "27", "28", "68" }; // 앞다리, 삼겹살, 갈비, 목살

					for (String itemCdP : itemCdPig) {
						// API 호출 및 XML 데이터 확보 로직 (Quote.java에서 가져옴)
						StringBuilder urlBuilder = new StringBuilder(
								"http://data.ekape.or.kr/openapi-data/service/user/grade/consumerPriceDaily");
						urlBuilder.append("?" + URLEncoder.encode("serviceKey", "UTF-8")
								+ "=TO90wKscUg6u6rP5F%2BGib6c%2BZB23HOQfDM5pnjbHPlrXWlVNUe8JV0mJbe7JpfeuOQQZtupiIlN7w8AQUoo5lw%3D%3D");
						urlBuilder.append("&" + URLEncoder.encode("standYmd", "UTF-8") + "="
								+ URLEncoder.encode("20250829", "UTF-8"));
						urlBuilder.append("&" + URLEncoder.encode("judgeKind", "UTF-8") + "="
								+ URLEncoder.encode(itemCdK, "UTF-8"));
						urlBuilder.append(
								"&" + URLEncoder.encode("itemCd", "UTF-8") + "=" + URLEncoder.encode(itemCdP, "UTF-8"));

						URL url = new URL(urlBuilder.toString());
						HttpURLConnection conn = (HttpURLConnection) url.openConnection();
						conn.setRequestMethod("GET");
						conn.setRequestProperty("Content-type", "application/json");

						BufferedReader rd;
						if (conn.getResponseCode() >= 200 && conn.getResponseCode() <= 300) {
							rd = new BufferedReader(new InputStreamReader(conn.getInputStream()));
						} else {
							rd = new BufferedReader(new InputStreamReader(conn.getErrorStream()));
						}

						StringBuilder sb = new StringBuilder();
						String line;
						while ((line = rd.readLine()) != null) {
							sb.append(line);
						}
						rd.close();
						conn.disconnect();

						String xmlData = sb.toString();

						// XML 데이터 파싱 및 DB 저장
						DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
						DocumentBuilder builder = factory.newDocumentBuilder();
						Document doc = builder.parse(new ByteArrayInputStream(xmlData.getBytes("UTF-8")));
						doc.getDocumentElement().normalize();

						NodeList nList = doc.getElementsByTagName("item");

						for (int i = 0; i < nList.getLength(); i++) {
							Node node = nList.item(i);
							if (node.getNodeType() == Node.ELEMENT_NODE) {
								Element eElement = (Element) node;
								QuoteDTO quoteDTO = new QuoteDTO();
								quoteDTO.setStand_ymd(getTagValue("standYmd", eElement));
								quoteDTO.setGrade_name(getTagValue("grdNm", eElement));
								quoteDTO.setJudge_kind_name(getTagValue("judgeKindNm", eElement));
								quoteDTO.setJudge_kind(getTagValue("judgeKind", eElement));
								quoteDTO.setItem_name(getTagValue("itemNm", eElement));
								quoteDTO.setItem_code(getTagValue("itemCd", eElement));
								quoteDTO.setNet_sale_price(getTagValue("ntslPrc", eElement));
								quoteDTO.setMax_price(getTagValue("maxPrc", eElement));
								quoteDTO.setMin_price(getTagValue("minPrc", eElement));
								quoteDTO.setUnit(getTagValue("unit", eElement));

								quoteDAO.saveQuoteInfo(quoteDTO);
							}
						}
					}
				}
			}

			return "API 데이터가 성공적으로 저장되었습니다.";

		} catch (IOException | ParserConfigurationException | SAXException e) {
			e.printStackTrace();
			return "데이터 저장 중 오류가 발생했습니다: " + e.getMessage();
		}
	}
}
