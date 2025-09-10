package com.app.controller;

import com.app.domain.User;
import com.app.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import javax.servlet.http.HttpSession;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

@RestController
@RequestMapping("/api/auth/oauth")
@RequiredArgsConstructor
public class SnsAuthController {

  private final UserMapper userMapper;
  private final HttpSession session;
  private final RestTemplate rest = new RestTemplate();

  // ===== Front routes =====
  @Value("${oauth.front-success}") private String FRONT_SUCCESS; // 예) http://localhost:3000/
  @Value("${oauth.front-fail}")    private String FRONT_FAIL;    // 예) http://localhost:3000/login?error=1
  // 👉 실제 프론트 경로를 꼭 프로젝트에 맞게 지정하세요 (예: /signup/select)
  @Value("${oauth.front-role-select:http://localhost:3000/role-select}")
  private String FRONT_ROLE_SELECT;

  // ===== Kakao =====
  @Value("${oauth.kakao.client-id}")       private String KAKAO_ID;
  @Value("${oauth.kakao.client-secret:}")  private String KAKAO_SECRET;
  @Value("${oauth.kakao.redirect-uri}")    private String KAKAO_REDIRECT;

  // ===== Naver =====
  @Value("${oauth.naver.client-id}")       private String NAVER_ID;
  @Value("${oauth.naver.client-secret}")   private String NAVER_SECRET;
  @Value("${oauth.naver.redirect-uri}")    private String NAVER_REDIRECT;

  // ===== Behavior flags =====
  @Value("${oauth.sns.auto-signup:true}")     private boolean autoSignup;
  @Value("${oauth.sns.auto-link-email:false}")private boolean autoLinkEmail;

  private void clearLoginSession(HttpSession s) {
    s.removeAttribute("LOGIN_ID");
    s.removeAttribute("LOGIN_EMAIL");
    s.removeAttribute("LOGIN_NAME");
    s.removeAttribute("LOGIN_USER_TYPE");
    s.removeAttribute("LOGIN_PROVIDER");
    s.removeAttribute("NEED_ROLE_SELECT");
  }

  private ResponseEntity<Void> redirect(String to) {
    return ResponseEntity.status(302).header(HttpHeaders.LOCATION, to).build();
  }

  private static boolean isBlank(String v) {
    return v == null || v.trim().isEmpty();
  }

  private String addQuery(String base, String q) {
    return base + (base.contains("?") ? "&" : "?") + q;
  }

  // =================== Kakao ===================
  @GetMapping("/kakao")
  public ResponseEntity<Void> kakaoStart() {
    clearLoginSession(session);

    String state = UUID.randomUUID().toString();
    session.setAttribute("OAUTH_STATE:KAKAO", state);

    String url = "https://kauth.kakao.com/oauth/authorize"
        + "?response_type=code"
        + "&client_id=" + KAKAO_ID
        + "&redirect_uri=" + URLEncoder.encode(KAKAO_REDIRECT, StandardCharsets.UTF_8)
        + "&state=" + state;

    System.out.println("[KAKAO AUTH] id=" + KAKAO_ID + ", redirect=" + KAKAO_REDIRECT);
    return redirect(url);
  }

  @GetMapping("/kakao/callback")
  public ResponseEntity<Void> kakaoCallback(@RequestParam String code,
                                            @RequestParam(required = false) String state) {
    String savedState = (String) session.getAttribute("OAUTH_STATE:KAKAO");
    if (savedState == null || !Objects.equals(savedState, state)) {
      return redirect(FRONT_FAIL + "&reason=state");
    }

    try {
      MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
      form.add("grant_type", "authorization_code");
      form.add("client_id", KAKAO_ID);
      if (!isBlank(KAKAO_SECRET)) form.add("client_secret", KAKAO_SECRET);
      form.add("redirect_uri", KAKAO_REDIRECT);
      form.add("code", code);

      @SuppressWarnings("unchecked")
      Map<String, Object> token = rest.postForObject("https://kauth.kakao.com/oauth/token", form, Map.class);
      String accessToken = (String) token.get("access_token");

      HttpHeaders h = new HttpHeaders();
      h.setBearerAuth(accessToken);
      HttpEntity<Void> req = new HttpEntity<>(h);

      @SuppressWarnings("unchecked")
      Map<String, Object> body = rest.exchange(
          "https://kapi.kakao.com/v2/user/me",
          org.springframework.http.HttpMethod.GET, req, Map.class
      ).getBody();

      String provider = "KAKAO";
      String providerId = String.valueOf(body.get("id"));

      @SuppressWarnings("unchecked")
      Map<String, Object> kakaoAccount = (Map<String, Object>) body.get("kakao_account");
      String email = kakaoAccount != null ? (String) kakaoAccount.get("email") : null;

      @SuppressWarnings("unchecked")
      Map<String, Object> profile = kakaoAccount != null ? (Map<String, Object>) kakaoAccount.get("profile") : null;
      String name = profile != null ? String.valueOf(profile.getOrDefault("nickname", "카카오사용자")) : "카카오사용자";

      User u = loginOrCreate(provider, providerId, email, name);
      if (u == null) return redirect(FRONT_FAIL + "&reason=no-account");

      boolean needRole = isBlank(u.getUserType());
      session.setAttribute("NEED_ROLE_SELECT", needRole ? "Y" : "N");

      String to = needRole
          ? addQuery(FRONT_ROLE_SELECT, "needRole=1&provider=" + provider.toLowerCase())
          : FRONT_SUCCESS;

      System.out.println("[OAUTH/KAKAO] redirect -> " + to + ", userType=" + u.getUserType());
      return redirect(to);

    } catch (Exception ex) {
      ex.printStackTrace();
      return redirect(FRONT_FAIL + "&reason=exception");
    }
  }

  // =================== Naver ===================
  @GetMapping("/naver")
  public ResponseEntity<Void> naverStart() {
    clearLoginSession(session);

    String state = UUID.randomUUID().toString();
    session.setAttribute("OAUTH_STATE:NAVER", state);

    String url = "https://nid.naver.com/oauth2.0/authorize"
        + "?response_type=code"
        + "&client_id=" + NAVER_ID
        + "&redirect_uri=" + URLEncoder.encode(NAVER_REDIRECT, StandardCharsets.UTF_8)
        + "&state=" + state;

    return redirect(url);
  }

  @GetMapping("/naver/callback")
  public ResponseEntity<Void> naverCallback(@RequestParam String code,
                                            @RequestParam String state) {
    String savedState = (String) session.getAttribute("OAUTH_STATE:NAVER");
    if (savedState == null || !Objects.equals(savedState, state)) {
      return redirect(FRONT_FAIL + "&reason=state");
    }

    try {
      String tokenUrl = "https://nid.naver.com/oauth2.0/token"
          + "?grant_type=authorization_code"
          + "&client_id=" + NAVER_ID
          + "&client_secret=" + NAVER_SECRET
          + "&code=" + URLEncoder.encode(code, StandardCharsets.UTF_8)
          + "&state=" + URLEncoder.encode(state, StandardCharsets.UTF_8);

      @SuppressWarnings("unchecked")
      Map<String, Object> token = rest.getForObject(tokenUrl, Map.class);
      String accessToken = (String) token.get("access_token");

      HttpHeaders h = new HttpHeaders();
      h.setBearerAuth(accessToken);
      HttpEntity<Void> req = new HttpEntity<>(h);

      @SuppressWarnings("unchecked")
      Map<String, Object> me = rest.exchange(
          "https://openapi.naver.com/v1/nid/me",
          org.springframework.http.HttpMethod.GET, req, Map.class
      ).getBody();

      @SuppressWarnings("unchecked")
      Map<String, Object> resp = me != null ? (Map<String, Object>) me.get("response") : null;

      String provider = "NAVER";
      String providerId = resp != null ? (String) resp.get("id") : null;
      String email = resp != null ? (String) resp.get("email") : null;
      String name  = resp != null ? String.valueOf(resp.getOrDefault("name", "네이버사용자")) : "네이버사용자";

      User u = loginOrCreate(provider, providerId, email, name);
      if (u == null) return redirect(FRONT_FAIL + "&reason=no-account");

      boolean needRole = isBlank(u.getUserType());
      session.setAttribute("NEED_ROLE_SELECT", needRole ? "Y" : "N");

      String to = needRole
          ? addQuery(FRONT_ROLE_SELECT, "needRole=1&provider=" + provider.toLowerCase())
          : FRONT_SUCCESS;

      System.out.println("[OAUTH/NAVER] redirect -> " + to + ", userType=" + u.getUserType());
      return redirect(to);

    } catch (Exception ex) {
      ex.printStackTrace();
      return redirect(FRONT_FAIL + "&reason=exception");
    }
  }

  // =================== Core ===================
  /** SNS 로그인(또는 자동가입) 후 User 반환 */
  private User loginOrCreate(String provider, String providerId, String email, String name) {
    // 0) provider로 기등록 여부
    User u = userMapper.findByProvider(provider, providerId);

    // 1) 같은 이메일 계정 자동 연동 (옵션)
    if (u == null && email != null && autoLinkEmail) {
      User byEmail = userMapper.findByEmail(email);
      if (byEmail != null) {
        userMapper.linkProviderByEmail(email, provider, providerId);
        u = userMapper.findByEmail(email);
        System.out.println("[OAUTH] linked by email: " + email + " -> " + provider + "/" + providerId);
      }
    }

    // 2) 자동가입 (USER_TYPE 비워서 역할선택 유도)
    if (u == null && autoSignup) {
      Map<String, Object> p = new HashMap<>();
      p.put("id", UUID.randomUUID().toString());
      p.put("email", email);                     // null 허용
      p.put("pw", UUID.randomUUID().toString()); // 사용 안 함(임시)
      p.put("userName", name);
      p.put("provider", provider);
      p.put("providerId", providerId);
      userMapper.insertSnsUser(p);              // USER_TYPE은 넣지 않음 → NULL
      u = userMapper.findByProvider(provider, providerId);
      System.out.println("[OAUTH] auto-signup created: " + (u != null ? u.getId() : "NULL"));
    }

    // 3) 세션 저장 (+ 필요 시 역할선택 플래그)
    if (u != null) {
      session.setAttribute("LOGIN_ID", u.getId());
      session.setAttribute("LOGIN_EMAIL", u.getEmail());
      session.setAttribute("LOGIN_NAME", u.getUserName());
      session.setAttribute("LOGIN_USER_TYPE", u.getUserType()); // NULL일 수 있음
      session.setAttribute("LOGIN_PROVIDER", u.getProvider());
      session.setAttribute("NEED_ROLE_SELECT", isBlank(u.getUserType()) ? "Y" : "N");
    }
    return u;
  }
}
