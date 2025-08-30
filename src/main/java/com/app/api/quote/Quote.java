//package com.app.api.quote;
//
//
//import java.io.BufferedReader;
//import java.io.ByteArrayInputStream;
//import java.io.IOException;
//import java.io.InputStreamReader;
//import java.net.HttpURLConnection;
//import java.net.URL;
//import java.net.URLEncoder;
//
//import javax.xml.parsers.DocumentBuilder;
//import javax.xml.parsers.DocumentBuilderFactory;
//import javax.xml.parsers.ParserConfigurationException;
//
//import org.springframework.context.ApplicationContext;
//import org.springframework.context.support.ClassPathXmlApplicationContext;
//import org.w3c.dom.Document;
//import org.w3c.dom.Element;
//import org.w3c.dom.Node;
//import org.w3c.dom.NodeList;
//import org.xml.sax.SAXException;
//
//import com.app.dao.quote.QuoteDAO;
//import com.app.dto.quote.QuoteDTO;
//
// @Service와 CommandLineRunner를 제거하고, 일반 Java 클래스로 변경
//public class Quote {
//
//    // 이 클래스 내에서만 사용되는 private static 메서드
//    private static String getTagValue(String tag, Element eElement) {
//        NodeList nlList = eElement.getElementsByTagName(tag);
//        if (nlList != null && nlList.getLength() > 0) {
//            Node nValue = nlList.item(0).getFirstChild();
//            if (nValue != null) {
//                return nValue.getNodeValue();
//            }
//        }
//        return null;
//    }
//    
//    // 이 클래스는 이제 main 메서드를 통해 실행됩니다.
//    public static void main(String[] args) throws IOException, ParserConfigurationException, SAXException {
//        // 1. XML 설정 파일을 기반으로 스프링 ApplicationContext를 수동으로 생성합니다.
//        // 프로젝트 구조에 따라 spring-context.xml 경로를 확인하세요.
//        ApplicationContext context = new ClassPathXmlApplicationContext("spring-context.xml");
//        
//        // 2. ApplicationContext에서 QuoteDAO 빈을 가져옵니다.
//        // QuoteDAO 빈은 spring-context.xml에 정의되어 있어야 합니다.
//        QuoteDAO quoteDAO = context.getBean(QuoteDAO.class);
//        
//        // 3. API 호출 및 XML 데이터 확보
//        StringBuilder urlBuilder = new StringBuilder("http://data.ekape.or.kr/openapi-data/service/user/grade/consumerPriceDaily");
//        urlBuilder.append("?" + URLEncoder.encode("serviceKey","UTF-8") + "=TO90wKscUg6u6rP5F%2BGib6c%2BZB23HOQfDM5pnjbHPlrXWlVNUe8JV0mJbe7JpfeuOQQZtupiIlN7w8AQUoo5lw%3D%3D");
//        urlBuilder.append("&" + URLEncoder.encode("standYmd","UTF-8") + "=" + URLEncoder.encode("20220630", "UTF-8"));
//        urlBuilder.append("&" + URLEncoder.encode("judgeKind","UTF-8") + "=" + URLEncoder.encode("4301", "UTF-8"));
//        urlBuilder.append("&" + URLEncoder.encode("itemCd","UTF-8") + "=" + URLEncoder.encode("21", "UTF-8"));
//
//        URL url = new URL(urlBuilder.toString());
//        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
//        conn.setRequestMethod("GET");
//        conn.setRequestProperty("Content-type", "application/json");
//        
//        BufferedReader rd;
//        if(conn.getResponseCode() >= 200 && conn.getResponseCode() <= 300) {
//            rd = new BufferedReader(new InputStreamReader(conn.getInputStream()));
//        } else {
//            rd = new BufferedReader(new InputStreamReader(conn.getErrorStream()));
//        }
//        
//        StringBuilder sb = new StringBuilder();
//        String line;
//        while ((line = rd.readLine()) != null) {
//            sb.append(line);
//        }
//        rd.close();
//        conn.disconnect();
//        
//        String xmlData = sb.toString();
//        System.out.println("API 응답 XML:\n" + xmlData);
//
//        // 4. XML 데이터 파싱
//        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
//        DocumentBuilder builder = factory.newDocumentBuilder();
//        Document doc = builder.parse(new ByteArrayInputStream(xmlData.getBytes("UTF-8")));
//        doc.getDocumentElement().normalize();
//
//        NodeList nList = doc.getElementsByTagName("item");
//        System.out.println("----------------------------");
//
//        for (int i = 0; i < nList.getLength(); i++) {
//            Node node = nList.item(i);
//            if (node.getNodeType() == Node.ELEMENT_NODE) {
//                Element eElement = (Element) node;
//                QuoteDTO quoteDTO = new QuoteDTO();
//                quoteDTO.setStand_ymd(getTagValue("standYmd", eElement));
//                quoteDTO.setGrade_name(getTagValue("grdNm", eElement));
//                quoteDTO.setJudge_kind_name(getTagValue("judgeKindNm", eElement));
//                quoteDTO.setJudge_kind(getTagValue("judgeKind", eElement));
//                quoteDTO.setItem_name(getTagValue("itemNm", eElement));
//                quoteDTO.setItem_code(getTagValue("itemCd", eElement));
//                quoteDTO.setNet_sale_price(getTagValue("ntslPrc", eElement));
//                quoteDTO.setMax_price(getTagValue("maxPrc", eElement));
//                quoteDTO.setMin_price(getTagValue("minPrc", eElement));
//                quoteDTO.setUnit(getTagValue("unit", eElement));
//                
//                // 데이터베이스 저장 로직
//                quoteDAO.saveQuoteInfo(quoteDTO);
//                
//                System.out.println("데이터 저장 완료: " + quoteDTO.toString());
//                System.out.println("----------------------------");
//            }
//        }
//    }
//}
