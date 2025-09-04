package com.app.dto.home;

import lombok.Data;

@Data
public class UserHome {
	
	String id;
	String pw;
	String email;
	String address;
	String tel;
	String userName;
	String userType;
	String userStatus;
	String businessNumber;
	Integer totalBalance;
	Integer bidDeposit;
	String provider;
	String providerId;
}
