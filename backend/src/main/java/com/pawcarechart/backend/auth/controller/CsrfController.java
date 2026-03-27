package com.pawcarechart.backend.auth.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Auth", description = "인증 및 보안 API")
@RestController
@RequestMapping("/api")
public class CsrfController {

    @Operation(summary = "CSRF 토큰 갱신", description = "XSRF-TOKEN 쿠키를 새로 발급받거나 갱신합니다. SPA 초기화 시 호출 권장.")
    @GetMapping("/csrf")
    public void refreshCsrf() {
        // CsrfCookieFilter가 자동으로 request attribute에서 토큰을 꺼내 쿠키에 구워주므로 별도 로직 불요
    }
}
