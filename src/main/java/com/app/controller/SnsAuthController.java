package com.app.controller;

import com.app.domain.User;
import com.app.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
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
  // 굳이 빈 주입 안해도 됨. 간단히 필드 생성자로 사용
  private final RestTemplate rest = new RestTemplate();

  // ===== Front routes =====
  @Value("${oauth.front-success}") private String FRONT_SUCCESS;        // 예) http://localhost:3000/
  @Value("${oauth.front-fail}")    private String FRONT_FAIL;           // 예) http://localhost:3000/login?error=1
  @Value("${oauth.front-role-select:http://localhost:3000/oauth/role}") // 기본값을 /oauth/role 로 고정
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
  @Value("${oauth.sns.auto-signup:true}")      private boolean autoSignup;
  @Value("${oauth.sns.auto-link-email:false}") private boolean autoLinkEmail;

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
      return redirect(addQuery(FRONT_FAIL, "reason=state"));
    }

    try {
      // 1) 액세스 토큰 요청 (폼-URL-인코딩 명시)
      MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
      form.add("grant_type", "authorization_code");
      form.add("client_id", KAKAO_ID);
      if (!isBlank(KAKAO_SECRET)) form.add("client_secret", KAKAO_SECRET);
      form.add("redirect_uri", KAKAO_REDIRECT);
      form.add("code", code);

      HttpHeaders tokenHeaders = new HttpHeaders();
      tokenHeaders.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
      HttpEntity<MultiValueMap<String, String>> tokenReq = new HttpEntity<>(form, tokenHeaders);

      @SuppressWarnings("unchecked")
      Map<String, Object> token = rest.postForObject("https://kauth.kakao.com/oauth/token", tokenReq, Map.class);
      String accessToken = token != null ? (String) token.get("access_token") : null;
      if (isBlank(accessToken)) return redirect(addQuery(FRONT_FAIL, "reason=no-token"));

      // 2) 사용자 정보 조회
      HttpHeaders h = new HttpHeaders();
      h.setBearerAuth(accessToken);
      HttpEntity<Void> req = new HttpEntity<>(h);

      @SuppressWarnings("unchecked")
      Map<String, Object> body = rest.exchange(
          "https://kapi.kakao.com/v2/user/me",
          HttpMethod.GET, req, Map.class
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
      if (u == null) return redirect(addQuery(FRONT_FAIL, "reason=no-account"));

      boolean needRole = isBlank(u.getUserType());
      session.setAttribute("NEED_ROLE_SELECT", needRole ? "Y" : "N");

      String to = needRole
          ? addQuery(FRONT_ROLE_SELECT, "needRole=1&provider=" + provider.toLowerCase())
          : FRONT_SUCCESS;

      System.out.println("[OAUTH/KAKAO] redirect -> " + to + ", userType=" + u.getUserType());
      return redirect(to);

    } catch (Exception ex) {
      ex.printStackTrace();
      return redirect(addQuery(FRONT_FAIL, "reason=exception"));
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
      return redirect(addQuery(FRONT_FAIL, "reason=state"));
    }

    try {
      // 1) 토큰 교환 (GET)
      String tokenUrl = "https://nid.naver.com/oauth2.0/token"
          + "?grant_type=authorization_code"
          + "&client_id=" + NAVER_ID
          + "&client_secret=" + NAVER_SECRET
          + "&code=" + URLEncoder.encode(code, StandardCharsets.UTF_8)
          + "&state=" + URLEncoder.encode(state, StandardCharsets.UTF_8);

      @SuppressWarnings("unchecked")
      Map<String, Object> token = rest.getForObject(tokenUrl, Map.class);
      String accessToken = token != null ? (String) token.get("access_token") : null;
      if (isBlank(accessToken)) return redirect(addQuery(FRONT_FAIL, "reason=no-token"));

      // 2) 사용자 정보 조회
      HttpHeaders h = new HttpHeaders();
      h.setBearerAuth(accessToken);
      HttpEntity<Void> req = new HttpEntity<>(h);

      @SuppressWarnings("unchecked")
      Map<String, Object> me = rest.exchange(
          "https://openapi.naver.com/v1/nid/me",
          HttpMethod.GET, req, Map.class
      ).getBody();

      @SuppressWarnings("unchecked")
      Map<String, Object> resp = me != null ? (Map<String, Object>) me.get("response") : null;

      String provider = "NAVER";
      String providerId = resp != null ? (String) resp.get("id") : null;
      String email = resp != null ? (String) resp.get("email") : null;
      String name  = resp != null ? String.valueOf(resp.getOrDefault("name", "네이버사용자")) : "네이버사용자";

      User u = loginOrCreate(provider, providerId, email, name);
      if (u == null) return redirect(addQuery(FRONT_FAIL, "reason=no-account"));

      boolean needRole = isBlank(u.getUserType());
      session.setAttribute("NEED_ROLE_SELECT", needRole ? "Y" : "N");

      String to = needRole
          ? addQuery(FRONT_ROLE_SELECT, "needRole=1&provider=" + provider.toLowerCase())
          : FRONT_SUCCESS;

      System.out.println("[OAUTH/NAVER] redirect -> " + to + ", userType=" + u.getUserType());
      return redirect(to);

    } catch (Exception ex) {
      ex.printStackTrace();
      return redirect(addQuery(FRONT_FAIL, "reason=exception"));
    }
  }

  // =================== Core ===================
  /** SNS 로그인(또는 자동가입) 후 User 반환 */
  private User loginOrCreate(String provider, String providerId, String email, String name) {
    // 0) provider로 기등록 여부
    User u = userMapper.findByProvider(provider, providerId);

    // 1) 같은 이메일 자동 연동 (옵션)
    if (u == null && email != null && autoLinkEmail) {
      User byEmail = userMapper.findByEmail(email);
      if (byEmail != null) {
        userMapper.linkProviderByEmail(email, provider, providerId);
        u = userMapper.findByEmail(email);
        System.out.println("[OAUTH] linked by email: " + email + " -> " + provider + "/" + providerId);
      }
    }

    // 2) 자동가입: USER_TYPE 비워서 역할선택 유도
    if (u == null && autoSignup) {
      Map<String, Object> p = new HashMap<>();
      p.put("id", UUID.randomUUID().toString());
      p.put("email", email);                       // null 허용
      p.put("userName", isBlank(name) ? "" : name);
      p.put("provider", provider);
      p.put("providerId", providerId);
      // ✅ Oracle null 바인딩 이슈 피하기 위해 기본값 지정
      p.put("address", "");
      p.put("tel", "");
      p.put("userType", null);
      p.put("pw", "");                             // SNS계정은 내부 PW 미사용

      userMapper.insertSnsUser(p);
      u = userMapper.findByProvider(provider, providerId);
      System.out.println("[OAUTH] auto-signup created: " + (u != null ? u.getId() : "NULL"));
    }

    // 3) 세션 저장
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
