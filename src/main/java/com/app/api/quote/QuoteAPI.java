package com.app.api.quote;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import org.json.JSONArray;
import org.json.JSONObject;

public class QuoteAPI {

    // 여기에 본인 발급 API Key 입력
    private static final String SERVICE_KEY = "YOUR_API_KEY";

    public static void main(String[] args) {
        try {
            // 예시 URL (육계 도매 일일가격조회)
            String urlStr = "https://api.odcloud.kr/api/15073985/v1/uddi:xxx"
                    + "?serviceKey=" + SERVICE_KEY
                    + "&page=1&perPage=10";

            URL url = new URL(urlStr);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");

            BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = br.readLine()) != null) {
                sb.append(line);
            }

            br.close();
            conn.disconnect();

            // JSON 파싱
            JSONObject json = new JSONObject(sb.toString());
            JSONArray dataArray = json.getJSONArray("data");

            for (int i = 0; i < dataArray.length(); i++) {
                JSONObject item = dataArray.getJSONObject(i);

                String date = item.getString("date");   // 날짜
                String itemName = item.getString("item_name"); // 품목명 (소/돼지/닭)
                double price = item.getDouble("avg_price");    // 가격

                System.out.println(date + " / " + itemName + " / " + price);
                // 여기서 DB 저장 로직 호출 가능
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}