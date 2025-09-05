package com.app.api.quote;

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
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import com.app.dao.quote.QuoteDAO;
import com.app.dto.quote.QuoteDTO;
import com.app.dto.quote.QuoteDTOM;
import com.app.dto.quote.QuoteDTOY;
import com.app.service.quote.QuoteService;

@Service
public class QuoteAPI {

	@Autowired
	QuoteDAO quoteDAO;

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

	public String quoteAPIDay(String day) {
		String[] itemCdKind = { "4301", "4304" }; // 소, 돼지, 닭

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
						urlBuilder.append(
								"&" + URLEncoder.encode("standYmd", "UTF-8") + "=" + URLEncoder.encode(day, "UTF-8"));
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
								quoteDTO.setStandYmd(getTagValue("standYmd", eElement));
								quoteDTO.setGradeName(getTagValue("grdNm", eElement));
								quoteDTO.setJudgeKindName(getTagValue("judgeKindNm", eElement));
								quoteDTO.setJudgeKind(getTagValue("judgeKind", eElement));
								quoteDTO.setItemName(getTagValue("itemNm", eElement));
								quoteDTO.setItemCode(getTagValue("itemCd", eElement));
								quoteDTO.setNetSalePrice(getTagValue("ntslPrc", eElement));
								quoteDTO.setMaxPrice(getTagValue("maxPrc", eElement));
								quoteDTO.setMinPrice(getTagValue("minPrc", eElement));
								quoteDTO.setUnit(getTagValue("unit", eElement));

								System.out.println(quoteDTO);
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
						urlBuilder.append(
								"&" + URLEncoder.encode("standYmd", "UTF-8") + "=" + URLEncoder.encode(day, "UTF-8"));
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
								quoteDTO.setStandYmd(getTagValue("standYmd", eElement));
								quoteDTO.setGradeName(getTagValue("grdNm", eElement));
								quoteDTO.setJudgeKindName(getTagValue("judgeKindNm", eElement));
								quoteDTO.setJudgeKind(getTagValue("judgeKind", eElement));
								quoteDTO.setItemName(getTagValue("itemNm", eElement));
								quoteDTO.setItemCode(getTagValue("itemCd", eElement));
								quoteDTO.setNetSalePrice(getTagValue("ntslPrc", eElement));
								quoteDTO.setMaxPrice(getTagValue("maxPrc", eElement));
								quoteDTO.setMinPrice(getTagValue("minPrc", eElement));
								quoteDTO.setUnit(getTagValue("unit", eElement));

								System.out.println(quoteDTO);
								quoteDAO.saveQuoteInfo(quoteDTO);
							}
						}
					}
				}
			}

			// API 호출 및 XML 데이터 확보 로직 (Quote.java에서 가져옴)
			StringBuilder urlBuilder = new StringBuilder(
					"http://data.ekape.or.kr/openapi-data/service/user/grade/consumerPriceDaily");
			urlBuilder.append("?" + URLEncoder.encode("serviceKey", "UTF-8")
					+ "=TO90wKscUg6u6rP5F%2BGib6c%2BZB23HOQfDM5pnjbHPlrXWlVNUe8JV0mJbe7JpfeuOQQZtupiIlN7w8AQUoo5lw%3D%3D");
			urlBuilder.append("&" + URLEncoder.encode("standYmd", "UTF-8") + "=" + URLEncoder.encode(day, "UTF-8"));
			urlBuilder.append("&" + URLEncoder.encode("judgeKind", "UTF-8") + "=" + URLEncoder.encode("9901", "UTF-8"));
//			urlBuilder.append("&" + URLEncoder.encode("itemCd", "UTF-8") + "="
//					+ URLEncoder.encode(itemCdC, "UTF-8"));

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
					quoteDTO.setStandYmd(getTagValue("standYmd", eElement));
					quoteDTO.setGradeName(getTagValue("grdNm", eElement));
					quoteDTO.setJudgeKindName(getTagValue("judgeKindNm", eElement));
					quoteDTO.setJudgeKind(getTagValue("judgeKind", eElement));
					quoteDTO.setItemName(getTagValue("itemNm", eElement));
					quoteDTO.setItemCode(getTagValue("itemCd", eElement));
					quoteDTO.setNetSalePrice(getTagValue("ntslPrc", eElement));
					quoteDTO.setMaxPrice(getTagValue("maxPrc", eElement));
					quoteDTO.setMinPrice(getTagValue("minPrc", eElement));
					quoteDTO.setUnit(getTagValue("unit", eElement));

					System.out.println(quoteDTO);
					quoteDAO.saveQuoteInfo(quoteDTO);

				}
			}

			return "API 데이터가 성공적으로 저장되었습니다.";

		} catch (IOException | ParserConfigurationException | SAXException e) {
			e.printStackTrace();
			return "데이터 저장 중 오류가 발생했습니다: " + e.getMessage();
		}
	}
	
	public String quoteAPIMonth(String day) {
		String[] itemCdKind = { "4301", "4304" }; // 소, 돼지, 닭

		try {

			// itemCdArray의 각 품목 코드에 대해 API를 호출하고 데이터를 저장합니다.
			for (String itemCdK : itemCdKind) {

				if (itemCdK.equals("4301")) {
					String[] itemCdCow = { "21", "22", "36", "40", "50" }; // 안심, 등심, 설도, 양지, 갈비

					for (String itemCdC : itemCdCow) {
						// API 호출 및 XML 데이터 확보 로직 (Quote.java에서 가져옴)
						StringBuilder urlBuilder = new StringBuilder(
								"http://data.ekape.or.kr/openapi-data/service/user/grade/consumerPriceMonth");
						urlBuilder.append("?" + URLEncoder.encode("serviceKey", "UTF-8")
								+ "=TO90wKscUg6u6rP5F%2BGib6c%2BZB23HOQfDM5pnjbHPlrXWlVNUe8JV0mJbe7JpfeuOQQZtupiIlN7w8AQUoo5lw%3D%3D");
						urlBuilder.append(
								"&" + URLEncoder.encode("standYm", "UTF-8") + "=" + URLEncoder.encode(day, "UTF-8"));
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
								QuoteDTOM quoteDTO = new QuoteDTOM();
								quoteDTO.setStandYm(getTagValue("standYm", eElement));
								quoteDTO.setGradeName(getTagValue("grdNm", eElement));
								quoteDTO.setJudgeKindName(getTagValue("judgeKindNm", eElement));
								quoteDTO.setJudgeKind(getTagValue("judgeKind", eElement));
								quoteDTO.setItemName(getTagValue("itemNm", eElement));
								quoteDTO.setItemCode(getTagValue("itemCd", eElement));
								quoteDTO.setUnit(getTagValue("unit", eElement));
								quoteDTO.setNetSalePrice(getTagValue("ntslPrc", eElement));
								quoteDTO.setAvgYearPrice(getTagValue("avgYearPrc", eElement));

								System.out.println(quoteDTO);
								quoteDAO.saveQuoteMInfo(quoteDTO);

							}
						}
					}

				}

				if (itemCdK.equals("4304")) {
					String[] itemCdPig = { "25", "27", "28", "68" }; // 앞다리, 삼겹살, 갈비, 목살

					for (String itemCdP : itemCdPig) {
						// API 호출 및 XML 데이터 확보 로직 (Quote.java에서 가져옴)
						StringBuilder urlBuilder = new StringBuilder(
								"http://data.ekape.or.kr/openapi-data/service/user/grade/consumerPriceMonth");
						urlBuilder.append("?" + URLEncoder.encode("serviceKey", "UTF-8")
								+ "=TO90wKscUg6u6rP5F%2BGib6c%2BZB23HOQfDM5pnjbHPlrXWlVNUe8JV0mJbe7JpfeuOQQZtupiIlN7w8AQUoo5lw%3D%3D");
						urlBuilder.append(
								"&" + URLEncoder.encode("standYm", "UTF-8") + "=" + URLEncoder.encode(day, "UTF-8"));
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
								QuoteDTOM quoteDTO = new QuoteDTOM();
								quoteDTO.setStandYm(getTagValue("standYm", eElement));
								quoteDTO.setGradeName(getTagValue("grdNm", eElement));
								quoteDTO.setJudgeKindName(getTagValue("judgeKindNm", eElement));
								quoteDTO.setJudgeKind(getTagValue("judgeKind", eElement));
								quoteDTO.setItemName(getTagValue("itemNm", eElement));
								quoteDTO.setItemCode(getTagValue("itemCd", eElement));
								quoteDTO.setUnit(getTagValue("unit", eElement));
								quoteDTO.setNetSalePrice(getTagValue("ntslPrc", eElement));
								quoteDTO.setAvgYearPrice(getTagValue("avgYearPrc", eElement));

								System.out.println(quoteDTO);
								quoteDAO.saveQuoteMInfo(quoteDTO);
							}
						}
					}
				}
			}

			// API 호출 및 XML 데이터 확보 로직 (Quote.java에서 가져옴)
			StringBuilder urlBuilder = new StringBuilder(
					"http://data.ekape.or.kr/openapi-data/service/user/grade/consumerPriceMonth");
			urlBuilder.append("?" + URLEncoder.encode("serviceKey", "UTF-8")
					+ "=TO90wKscUg6u6rP5F%2BGib6c%2BZB23HOQfDM5pnjbHPlrXWlVNUe8JV0mJbe7JpfeuOQQZtupiIlN7w8AQUoo5lw%3D%3D");
			urlBuilder.append("&" + URLEncoder.encode("standYm", "UTF-8") + "=" + URLEncoder.encode(day, "UTF-8"));
			urlBuilder.append("&" + URLEncoder.encode("judgeKind", "UTF-8") + "=" + URLEncoder.encode("9901", "UTF-8"));


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
					QuoteDTOM quoteDTO = new QuoteDTOM();
					quoteDTO.setStandYm(getTagValue("standYm", eElement));
					quoteDTO.setGradeName(getTagValue("grdNm", eElement));
					quoteDTO.setJudgeKindName(getTagValue("judgeKindNm", eElement));
					quoteDTO.setJudgeKind(getTagValue("judgeKind", eElement));
					quoteDTO.setItemName(getTagValue("itemNm", eElement));
					quoteDTO.setItemCode(getTagValue("itemCd", eElement));
					quoteDTO.setUnit(getTagValue("unit", eElement));
					quoteDTO.setNetSalePrice(getTagValue("ntslPrc", eElement));
					quoteDTO.setAvgYearPrice(getTagValue("avgYearPrc", eElement));

					System.out.println(quoteDTO);
					quoteDAO.saveQuoteMInfo(quoteDTO);

				}
			}

			return "API 데이터가 성공적으로 저장되었습니다.";

		} catch (IOException | ParserConfigurationException | SAXException e) {
			e.printStackTrace();
			return "데이터 저장 중 오류가 발생했습니다: " + e.getMessage();
		}
	}
	
	public String quoteAPIYear(String day) {
		String[] itemCdKind = { "4301", "4304" }; // 소, 돼지, 닭

		try {

			// itemCdArray의 각 품목 코드에 대해 API를 호출하고 데이터를 저장합니다.
			for (String itemCdK : itemCdKind) {

				if (itemCdK.equals("4301")) {
					String[] itemCdCow = { "21", "22", "36", "40", "50" }; // 안심, 등심, 설도, 양지, 갈비

					for (String itemCdC : itemCdCow) {
						// API 호출 및 XML 데이터 확보 로직 (Quote.java에서 가져옴)
						StringBuilder urlBuilder = new StringBuilder(
								"http://data.ekape.or.kr/openapi-data/service/user/grade/consumerPriceYear");
						urlBuilder.append("?" + URLEncoder.encode("serviceKey", "UTF-8")
								+ "=TO90wKscUg6u6rP5F%2BGib6c%2BZB23HOQfDM5pnjbHPlrXWlVNUe8JV0mJbe7JpfeuOQQZtupiIlN7w8AQUoo5lw%3D%3D");
						urlBuilder.append(
								"&" + URLEncoder.encode("standY", "UTF-8") + "=" + URLEncoder.encode(day, "UTF-8"));
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
								QuoteDTOY quoteDTO = new QuoteDTOY();
								quoteDTO.setYear(getTagValue("year", eElement));
								quoteDTO.setGradeName(getTagValue("grdNm", eElement));
								quoteDTO.setJudgeKindName(getTagValue("judgeKindNm", eElement));
								quoteDTO.setJudgeKind(getTagValue("judgeKind", eElement));
								quoteDTO.setItemName(getTagValue("itemNm", eElement));
								quoteDTO.setItemCode(getTagValue("itemCd", eElement));
								quoteDTO.setUnit(getTagValue("unit", eElement));
								quoteDTO.setNetSalePrice(getTagValue("ntslPrc", eElement));
								quoteDTO.setMaxPrice(getTagValue("maxPrc", eElement));
								quoteDTO.setMinPrice(getTagValue("minPrc", eElement));

								System.out.println(quoteDTO);
								quoteDAO.saveQuoteYInfo(quoteDTO);

							}
						}
					}

				}

				if (itemCdK.equals("4304")) {
					String[] itemCdPig = { "25", "27", "28", "68" }; // 앞다리, 삼겹살, 갈비, 목살

					for (String itemCdP : itemCdPig) {
						// API 호출 및 XML 데이터 확보 로직 (Quote.java에서 가져옴)
						StringBuilder urlBuilder = new StringBuilder(
								"http://data.ekape.or.kr/openapi-data/service/user/grade/consumerPriceYear");
						urlBuilder.append("?" + URLEncoder.encode("serviceKey", "UTF-8")
								+ "=TO90wKscUg6u6rP5F%2BGib6c%2BZB23HOQfDM5pnjbHPlrXWlVNUe8JV0mJbe7JpfeuOQQZtupiIlN7w8AQUoo5lw%3D%3D");
						urlBuilder.append(
								"&" + URLEncoder.encode("standY", "UTF-8") + "=" + URLEncoder.encode(day, "UTF-8"));
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
								QuoteDTOY quoteDTO = new QuoteDTOY();
								quoteDTO.setYear(getTagValue("year", eElement));
								quoteDTO.setGradeName(getTagValue("grdNm", eElement));
								quoteDTO.setJudgeKindName(getTagValue("judgeKindNm", eElement));
								quoteDTO.setJudgeKind(getTagValue("judgeKind", eElement));
								quoteDTO.setItemName(getTagValue("itemNm", eElement));
								quoteDTO.setItemCode(getTagValue("itemCd", eElement));
								quoteDTO.setUnit(getTagValue("unit", eElement));
								quoteDTO.setNetSalePrice(getTagValue("ntslPrc", eElement));
								quoteDTO.setMaxPrice(getTagValue("maxPrc", eElement));
								quoteDTO.setMinPrice(getTagValue("minPrc", eElement));

								System.out.println(quoteDTO);
								quoteDAO.saveQuoteYInfo(quoteDTO);
							}
						}
					}
				}
			}

			// API 호출 및 XML 데이터 확보 로직 (Quote.java에서 가져옴)
			StringBuilder urlBuilder = new StringBuilder(
					"http://data.ekape.or.kr/openapi-data/service/user/grade/consumerPriceYear");
			urlBuilder.append("?" + URLEncoder.encode("serviceKey", "UTF-8")
					+ "=TO90wKscUg6u6rP5F%2BGib6c%2BZB23HOQfDM5pnjbHPlrXWlVNUe8JV0mJbe7JpfeuOQQZtupiIlN7w8AQUoo5lw%3D%3D");
			urlBuilder.append("&" + URLEncoder.encode("standY", "UTF-8") + "=" + URLEncoder.encode(day, "UTF-8"));
			urlBuilder.append("&" + URLEncoder.encode("judgeKind", "UTF-8") + "=" + URLEncoder.encode("9901", "UTF-8"));

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
					QuoteDTOY quoteDTO = new QuoteDTOY();
					quoteDTO.setYear(getTagValue("year", eElement));
					quoteDTO.setGradeName(getTagValue("grdNm", eElement));
					quoteDTO.setJudgeKindName(getTagValue("judgeKindNm", eElement));
					quoteDTO.setJudgeKind(getTagValue("judgeKind", eElement));
					quoteDTO.setItemName(getTagValue("itemNm", eElement));
					quoteDTO.setItemCode(getTagValue("itemCd", eElement));
					quoteDTO.setUnit(getTagValue("unit", eElement));
					quoteDTO.setNetSalePrice(getTagValue("ntslPrc", eElement));
					quoteDTO.setMaxPrice(getTagValue("maxPrc", eElement));
					quoteDTO.setMinPrice(getTagValue("minPrc", eElement));
					

					System.out.println(quoteDTO);
					quoteDAO.saveQuoteYInfo(quoteDTO);

				}
			}

			return "API 데이터가 성공적으로 저장되었습니다.";

		} catch (IOException | ParserConfigurationException | SAXException e) {
			e.printStackTrace();
			return "데이터 저장 중 오류가 발생했습니다: " + e.getMessage();
		}
	}
}
