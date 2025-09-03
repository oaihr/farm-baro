package com.app.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.app.dto.home.AuctionItem;
import com.app.dto.home.SalesItem;
import com.app.dto.home.SearchResult;
import com.app.service.home.HomeService;

import lombok.Data;

@RestController
@RequestMapping("/home")
@CrossOrigin(origins = "http://localhost:3000")
public class HomeController {

	@Autowired
	HomeService homeService;

	@GetMapping("/homeAuctionTime")
	public List<AuctionItem> homeAuctionTime() {

		List<AuctionItem> autionList = homeService.autionOnList();
		System.out.println(autionList);

		return autionList;
	}

	@GetMapping("/homeSalesInfo")
	public List<SalesItem> homeSalesInfo() {

		List<SalesItem> salesList = homeService.getSalesPage();
		System.out.println(salesList);

		return salesList;
	}

	@GetMapping("/search")
    public ResponseEntity<SearchResult> search(@RequestParam(name = "keyword") String keyword) {

        // 서비스 메서드를 호출하여 경매 및 판매 데이터를 모두 가져옵니다.
        List<AuctionItem> auctionList = homeService.searchAuctions(keyword);
        List<SalesItem> salesList = homeService.searchSales(keyword);

        // 두 목록을 SearchResult DTO에 담아 반환
        SearchResult result = new SearchResult();
        result.setAuctions(auctionList);
        result.setSales(salesList);

        return ResponseEntity.ok(result);
    }

}
