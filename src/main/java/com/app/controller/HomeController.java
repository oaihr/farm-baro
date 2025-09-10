package com.app.controller;

import java.util.List;

import javax.management.Notification;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.app.dto.home.AuctionItemHome;
import com.app.dto.home.SalesItemHome;
import com.app.dto.home.SearchResult;
import com.app.service.home.HomeService;
import com.app.service.noti.NotificationService;

import lombok.Data;

@RestController
@RequestMapping("/home")
@CrossOrigin(origins = "http://localhost:3000")
public class HomeController {

	@Autowired
	HomeService homeService;

    @Autowired
    NotificationService notificationService;
	
	
	@GetMapping("/homeAuctionTime")
	public List<AuctionItemHome> homeAuctionTime() {

		List<AuctionItemHome> autionList = homeService.getAuctionPage();
		System.out.println("경매 : " + autionList);

		return autionList;
	}

	@GetMapping("/homeSalesInfo")
	public List<SalesItemHome> homeSalesInfo() {

		List<SalesItemHome> salesList = homeService.getSalesPage();
		System.out.println(salesList);

		return salesList;
	}

	@GetMapping("/search")
    public ResponseEntity<SearchResult> search(@RequestParam(name = "keyword") String keyword) {

        // 서비스 메서드를 호출하여 경매 및 판매 데이터를 모두 가져옵니다.
        List<AuctionItemHome> auctionList = homeService.searchAuctions(keyword);
        List<SalesItemHome> salesList = homeService.searchSales(keyword);

        // 두 목록을 SearchResult DTO에 담아 반환
        SearchResult result = new SearchResult();
        result.setAuctions(auctionList);
        result.setSales(salesList);

        return ResponseEntity.ok(result);
    }
	
    @GetMapping("/notifications")
    public List<Notification> getNotificationsByUserId(@RequestParam("userId") String userId) {
        return notificationService.userNotiList(userId);
    }
	

}
