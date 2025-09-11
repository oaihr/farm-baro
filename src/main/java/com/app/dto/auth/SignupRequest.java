package com.app.dto.auth;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import com.app.domain.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

/**
 * 회원가입 요청 DTO (로컬/소셜 공용)
 * - 프론트에서 address 하나만 보내도 되고, zip/addr1/addr2로 쪼개서 보내도 됩니다.
 *   mergedAddress()가 알아서 합쳐줍니다.
 */
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class SignupRequest {

    // id는 비워 올 수 있으므로 NotBlank 제거 (서비스에서 자동 생성)
    private String id;

    @NotBlank(message = "이메일을 입력하세요.")
    @Email(message = "올바른 이메일 형식이 아닙니다.")
    @Size(max = 255)
    private String email;

    @NotBlank(message = "비밀번호를 입력하세요.")
    @Size(min = 8, max = 64, message = "비밀번호는 8자 이상 입력하세요.")
    @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d).+$",
            message = "비밀번호는 영문과 숫자를 최소 1자 이상 포함해야 합니다.")
    private String password;

    @NotBlank(message = "이름을 입력하세요.")
    @Size(min = 2, max = 20, message = "이름은 2~20자여야 합니다.")
    private String userName;

    @NotBlank(message = "연락처를 입력하세요.")
    @Pattern(regexp = "^01[0-9]-?\\d{3,4}-?\\d{4}$", message = "휴대폰 번호 형식이 올바르지 않습니다.")
    private String tel;

    // 단일 주소(옵션). 비어오면 zip/addr1/addr2로 합쳐 사용
    @Size(max = 1000, message = "주소가 너무 깁니다.")
    private String address;

    // 3분할 주소(옵션)
    @Size(max = 10)   private String zip;
    @Size(max = 500)  private String addr1;
    @Size(max = 500)  private String addr2;

    // 선택 필드
    private String businessNumber;
    private String provider;

    public SignupRequest() {}

    public SignupRequest(String email, String password, String userName, String tel, String address) {
        this.email = email;
        this.password = password;
        this.userName = userName;
        this.tel = tel;
        this.address = address;
    }

    /** address가 비어 있으면 zip/addr1/addr2를 합쳐 반환 */
    @JsonIgnore
    public String mergedAddress() {
        String a = safe(address);
        if (!a.isEmpty()) return a;

        String m = String.join(" ",
                safe(zip),
                safe(addr1),
                safe(addr2)
        ).replaceAll("\\s+", " ").trim();

        return m;
    }

    private static String safe(String s) { return s == null ? "" : s.trim(); }

    /** 편의 변환 (address 비어있으면 mergedAddress() 사용) */
    public User toEntity() {
        User u = new User();
        u.setEmail(this.email);
        u.setPw(this.password);     // 평문 저장 정책 (서비스 단계에서 정책에 맞게 처리)
        u.setUserName(this.userName);
        u.setTel(this.tel);
        u.setAddress(this.mergedAddress());
        return u;
    }
}
