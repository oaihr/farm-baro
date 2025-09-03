package com.app.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ReactAppController {
    
    // React 앱의 모든 라우트를 index.html로 포워딩
    @GetMapping(value = {"/", "/frontend", "/frontend/**", "/mypage/**", "/sale/**"})
    public String forwardToReactApp() {
        return "forward:/index.html";
    }
}
