package com.app.config;

import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class SimpleCorsFilter implements Filter {

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException {
        HttpServletResponse response = (HttpServletResponse) res;
        HttpServletRequest request = (HttpServletRequest) req;
        
        // 모든 origin 허용
        response.setHeader("Access-Control-Allow-Origin", "*");
        // 모든 헤더 허용
        response.setHeader("Access-Control-Allow-Headers", "*");
        // 모든 HTTP 메서드 허용
        response.setHeader("Access-Control-Allow-Methods", "*");
        // 쿠키/인증 허용
        response.setHeader("Access-Control-Allow-Credentials", "true");
        // preflight 캐시 시간
        response.setHeader("Access-Control-Max-Age", "3600");
        
        // OPTIONS 요청 처리
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            response.setStatus(HttpServletResponse.SC_OK);
        } else {
            chain.doFilter(req, res);
        }
    }

    @Override
    public void init(FilterConfig filterConfig) {
        // 초기화 로직이 필요하지 않음
    }

    @Override
    public void destroy() {
        // 정리 로직이 필요하지 않음
    }
}
