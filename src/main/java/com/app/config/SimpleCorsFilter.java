package com.app.config;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class SimpleCorsFilter implements Filter {

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException {
        HttpServletResponse response = (HttpServletResponse) res;
        HttpServletRequest request = (HttpServletRequest) req;
        
        // 특정 origin 허용 (credentials와 함께 사용하기 위해)
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
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
