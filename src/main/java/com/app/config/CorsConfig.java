//package com.app.config;
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.web.cors.CorsConfiguration;
//import org.springframework.web.cors.CorsConfigurationSource;
//import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
//import org.springframework.web.servlet.config.annotation.CorsRegistry;
//import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
//
//@Configuration
//public class CorsConfig implements WebMvcConfigurer {
//
//	@Override
//    public void addCorsMappings(CorsRegistry registry) {
//        registry.addMapping("/**") // 모든 경로에 대해 CORS 허용
//                .allowedOrigins("http://localhost:3000", "http://localhost:3001") // 프론트엔드 URL로 명시적으로 지정
//                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS") // 허용할 HTTP 메소드
//                .allowedHeaders("*") // 모든 헤더 허용
//                .allowCredentials(true) // 자격 증명(세션 쿠키 등)을 허용하도록 설정
//                .maxAge(3600); // preflight 요청 캐시 시간 설정
//    }
//}
