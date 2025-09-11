package com.app.web;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Set;

public class CorsFilter implements Filter {

  // 허용 Origin 화이트리스트 (필요시 추가)
  private static final Set<String> ALLOWED_ORIGINS = Set.of(
      "http://localhost:3000",
      "http://127.0.0.1:3000"
      // "http://YOUR-PROD-DOMAIN", "https://YOUR-PROD-DOMAIN"
  );

  @Override
  public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
      throws IOException, ServletException {

    HttpServletRequest request  = (HttpServletRequest) req;
    HttpServletResponse response = (HttpServletResponse) res;

    String origin = request.getHeader("Origin");
    if (origin != null && ALLOWED_ORIGINS.contains(origin)) {
      // credentials 사용 중이므로, 반드시 특정 Origin으로 에코해야 함
      response.setHeader("Access-Control-Allow-Origin", origin);
      response.setHeader("Vary", "Origin"); // 캐시 분리
      response.setHeader("Access-Control-Allow-Credentials", "true");
      response.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
      response.setHeader("Access-Control-Allow-Headers",
          "Origin,Content-Type,Accept,Authorization,X-Requested-With");
      response.setHeader("Access-Control-Max-Age", "3600");
      // 필요한 경우 노출 헤더
      response.setHeader("Access-Control-Expose-Headers", "Location");
    }

    // Preflight(OPTIONS) 요청은 바로 204로 응답
    if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
      response.setStatus(HttpServletResponse.SC_NO_CONTENT);
      return;
    }

    chain.doFilter(req, res);
  }
}
