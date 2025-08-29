package com.app.dao.quote;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.app.dto.quote.QuoteDTO;

@Repository
public class QuoteDAO {
	String DB_URL = "jdbc:oracle:thin:@192.168.0.8:1521:XE";
	String DB_USER = "your_user";
	String DB_PASS = "your_password";

	public List<QuoteDTO> getPricesByItem(String itemName) {
		List<QuoteDTO> list = new ArrayList<>();

		try {
			Class.forName("oracle.jdbc.driver.OracleDriver");
			Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASS);

			// 최근 7일 데이터만 가져오도록 조건 추가
			String sql = "SELECT trade_date, item_name, avg_price " + "FROM livestock_price " + "WHERE item_name = ? "
					+ "ORDER BY trade_date DESC FETCH FIRST 7 ROWS ONLY";

			PreparedStatement pstmt = conn.prepareStatement(sql);
			pstmt.setString(1, itemName);
			ResultSet rs = pstmt.executeQuery();

			while (rs.next()) {
				String date = rs.getString("trade_date");
				String item = rs.getString("item_name");
				double price = rs.getDouble("avg_price");

				list.add(new QuoteDTO(date, item, price));
			}

			rs.close();
			pstmt.close();
			conn.close();

		} catch (Exception e) {
			e.printStackTrace();
		}

		return list;
	}
}