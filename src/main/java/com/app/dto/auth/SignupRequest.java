package com.app.dto.auth;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import com.app.domain.User;

import lombok.Data;

/**
 * 회원가입 요청 DTO - 비밀번호는 '평문'으로 들어오며, 서비스 계층에서 반드시 bcrypt 해시 후 저장한다. - 프런트와 JSON
 * 필드명이 1:1로 매칭되도록 간단한 프로퍼티 이름 사용.
 */
@Data
public class SignupRequest {

	@NotBlank(message = "이메일은 입력하세요.")
	@Email(message = "올바른 이메일 형식이 아닙니다.")
	// 이메일은 DB 컬럼보다 좁혀도 무방. (너무 큰 값 차단용)
	@Size(max = 255)
	private String email;

	@NotBlank(message = "비밀번호를 입력하세요.")
	@Size(min = 8, max = 64, message = "비밀번호는 8자 이상 입력하세요.") // 길이 정책은 서비스/보안 정책에 맞춰 조정
	@Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d).+$",
    message = "비밀번호는 영문과 숫자를 최소 1자 이상 포함해야 합니다.")
	private String password; // 평문 → 서비스에서 bcrypt

	@NotBlank(message = "이름은 입력하세요.")
	@Size(min = 2, max = 20, message = "이름은 2~20자여야 합니다.")
	private String userName;

	
	@NotBlank(message = "연락처를 입력하세요.")
    @Pattern(
      regexp = "^01[0-9]-?\\d{3,4}-?\\d{4}$",
      message = "휴대폰 번호 형식이 올바르지 않습니다.")
    private String tel;

	@Size(max = 1000, message = "주소를 입력하세요.") // DB가 1000바이트로 잡혀있으니 넉넉히
	private String address;

	// 선택 필드(판매자만)
	 
	  private String businessNumber;
	  private String provider;
	
	
	
	public SignupRequest() {
	}

	public SignupRequest(String email, String password, String userName, String tel, String address) {
		this.email = email;
		this.password = password;
		this.userName = userName;
		this.tel = tel;
		this.address = address;
	}

	/** 서비스에서 해시 전에 도메인으로 변환할 때 편의용 */

	public User toEntity() {
		User u = new User();
		u.setEmail(this.email);
		u.setPw(this.password); // ★ 아직 평문. 해시는 서비스에서!
		u.setUserName(this.userName);
		u.setTel(this.tel);
		u.setAddress(this.address);
		return u;
	}
	


}
