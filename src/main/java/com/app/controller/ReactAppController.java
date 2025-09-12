package com.app.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ReactAppController {
    
    // React 앱의 모든 라우트를 index.html로 포워딩 (API 경로는 제외)
    // API 경로들: /api/**, /home/**, /quote/checkDay, /quote/checkMonth, /quote/checkYear
    @GetMapping(value = {"/", "/frontend", "/frontend/**", "/mypage/**", "/sale/**", "/auctions/**", "/auction/**", "/cs/**"})
    public String forwardToReactApp() {
        return "forward:/index.html";
    }
}
