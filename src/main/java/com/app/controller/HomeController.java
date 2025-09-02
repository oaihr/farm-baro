package com.app.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.dto.home.AuctionItem;
import com.app.service.home.HomeService;

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
	
}
