package com.app.dto.auth;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import lombok.Data;

/**
 * 로그인 요청 DTO
 * - email & password만 받음
 */
@Data
public class LoginRequest {

	@NotBlank(message = "이메일을 입력하세요.")
	@Email(message = "이메일 형식이 아닙니다.")
    @Size(max = 255)
    private String email;

	@NotBlank(message = "비밀번호를 입력하세요.")
    @Size(min = 8, max = 64)
    private String password; // 평문 입력 → 서비스에서 bcrypt 매칭

    public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public LoginRequest() {}

    public LoginRequest(String email, String password) {
        this.email = email;
        this.password = password;
    }

	

   
}
