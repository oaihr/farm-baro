package com.app.dto.home;

import java.util.List;


import lombok.Data;

//두 가지 결과를 모두 담을 수 있는 DTO
@Data
public class SearchResult {
 private List<AuctionItem> auctions;
 private List<SalesItem> sales;
}
