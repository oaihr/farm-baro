package com.app.service.user;

import com.app.domain.User;
import com.app.dto.auth.SignupRequest;
import com.app.dto.seller.SellerSignupPayload;

public interface UserService {
    void signup(User u);
    User login(String email, String rawPw);
    User findByEmail(String email);
    User findById(String id);
    User signupLocal(String email, String pw, String name, String tel);

    // ↓ 컨트롤러에서 사용하는 메소드
    void registerBuyer(SignupRequest req);
    void registerSeller(SellerSignupPayload payload, String brnDocPath);
    void resetPassword(String email, String rawPass);

    // (선택) 예전에 호출하던 곳이 있으면 안전하게 유지
    default void signupBuyer(SignupRequest req) { registerBuyer(req); }
}
