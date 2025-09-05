package com.app.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000", "http://localhost:3001")  // 특정 origin 허용
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")         // 허용할 HTTP 메서드
                .allowedHeaders("*")         // 모든 헤더 허용
                .allowCredentials(true)      // 쿠키/인증 허용
                .maxAge(3600);              // preflight 캐시 시간
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.addAllowedOrigin("http://localhost:3000");  // React 개발 서버
        configuration.addAllowedOrigin("http://localhost:3001");  // 추가 React 서버
        configuration.addAllowedMethod("GET");         // GET 메서드 허용
        configuration.addAllowedMethod("POST");        // POST 메서드 허용
        configuration.addAllowedMethod("PUT");         // PUT 메서드 허용
        configuration.addAllowedMethod("DELETE");      // DELETE 메서드 허용
        configuration.addAllowedMethod("OPTIONS");     // OPTIONS 메서드 허용 (preflight)
        configuration.addAllowedHeader("*");           // 모든 헤더 허용
        configuration.setAllowCredentials(true);       // 쿠키/인증 허용
        configuration.setMaxAge(3600L);                // preflight 캐시 시간
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
