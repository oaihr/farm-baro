package com.app.api;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.io.BufferedReader;
import java.io.IOException;


public class Quote {
	 public static void main(String[] args) throws IOException {
	        StringBuilder urlBuilder = new StringBuilder("http://data.ekape.or.kr/openapi-data/service/user/grade/poultry/chickenSanji"); /*URL*/
	        urlBuilder.append("?" + URLEncoder.encode("serviceKey","UTF-8") + "TO90wKscUg6u6rP5F%2BGib6c%2BZB23HOQfDM5pnjbHPlrXWlVNUe8JV0mJbe7JpfeuOQQZtupiIlN7w8AQUoo5lw%3D%3D"); /*Service Key*/
	        urlBuilder.append("&" + URLEncoder.encode("startYmd","UTF-8") + "=" + URLEncoder.encode("20200103", "UTF-8")); /*시작일*/
	        urlBuilder.append("&" + URLEncoder.encode("endYmd","UTF-8") + "=" + URLEncoder.encode("20200131", "UTF-8")); /*종료일*/
	        urlBuilder.append("&" + URLEncoder.encode("type","UTF-8") + "=" + URLEncoder.encode("1", "UTF-8")); /*1 생체, 2 위탁생체 ※ 기본값(1)*/
	        urlBuilder.append("&" + URLEncoder.encode("numOfRows","UTF-8") + "=" + URLEncoder.encode("10", "UTF-8")); /*한 페이지 결과 수*/
	        urlBuilder.append("&" + URLEncoder.encode("pageNo","UTF-8") + "=" + URLEncoder.encode("1", "UTF-8")); /*페이지 번호*/
	        URL url = new URL(urlBuilder.toString());
	        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
	        conn.setRequestMethod("GET");
	        conn.setRequestProperty("Content-type", "application/json");
	        System.out.println("Response code: " + conn.getResponseCode());
	        BufferedReader rd;
	        if(conn.getResponseCode() >= 200 && conn.getResponseCode() <= 300) {
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
	        System.out.println(sb.toString());
	    }
}
