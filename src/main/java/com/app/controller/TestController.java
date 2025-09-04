package com.app.controller;

import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"}, allowCredentials = "true")
public class TestController {

    @GetMapping("/ping")
    public Map<String, Object> ping() {
        return Map.of("message", "pong", "timestamp", System.currentTimeMillis());
    }

    @PostMapping("/echo")
    public Map<String, Object> echo(@RequestBody Map<String, Object> body) {
        return Map.of("echo", body, "timestamp", System.currentTimeMillis());
    }
}
