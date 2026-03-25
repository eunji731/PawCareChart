package com.pawcarechart.backend.auth.controller;

import com.pawcarechart.backend.auth.dto.AuthResponse;
import com.pawcarechart.backend.auth.dto.LoginRequest;
import com.pawcarechart.backend.auth.dto.RefreshRequest;
import com.pawcarechart.backend.auth.dto.SignupRequest;
import com.pawcarechart.backend.auth.service.AuthService;
import com.pawcarechart.backend.common.dto.ApiResult;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;

import com.pawcarechart.backend.user.dto.UserResponse;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/auth")
@Tag(name = "인증", description = "회원가입, 로그인, 로그아웃 및 토큰 재발급을 처리하는 API")
public class AuthController {

    private final AuthService authService;
    private final Environment env; // 환경별 Secure 쿠키 설정을 위한 주입

    @PostMapping("/signup")
    @Operation(summary = "회원가입", description = "새로운 사용자를 등록하고 쿠키를 통해 토큰을 발급합니다.")
    public ResponseEntity<ApiResult<Void>> signup(@Parameter(description = "회원가입 요청 정보") @Valid @RequestBody SignupRequest request) {
        AuthResponse response = authService.signup(request);
        return createAuthResponse(response, "회원가입이 완료되었습니다.");
    }

    @PostMapping("/login")
    @Operation(summary = "로그인", description = "이메일과 비밀번호를 검증한 뒤 쿠키를 통해 액세스/리프레시 토큰을 발급합니다.")
    public ResponseEntity<ApiResult<Void>> login(@Parameter(description = "로그인 요청 정보") @Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return createAuthResponse(response, "로그인되었습니다.");
    }

    @GetMapping("/me")
    @Operation(summary = "내 정보 조회", description = "쿠키를 통해 현재 로그인된 사용자의 상세 정보를 가져옵니다.")
    public ResponseEntity<ApiResult<UserResponse>> getCurrentUser(@AuthenticationPrincipal String userId) {
        // 1. 서비스에서 DTO를 가져옴
        UserResponse userResponse = authService.getUserInfo(Long.valueOf(userId));

        // 2. ResponseEntity에 담아서 명시적으로 반환
        return ResponseEntity.ok(ApiResult.ok(userResponse));
    }

    @PostMapping("/refresh")
    @Operation(summary = "토큰 재발급", description = "쿠키의 리프레시 토큰을 사용해 새로운 인증 토큰 세트를 쿠키로 재발급합니다.")
    public ResponseEntity<ApiResult<Void>> refresh(@CookieValue(value = "refreshToken", required = false) String refreshToken) {
        if (refreshToken == null || refreshToken.isBlank()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResult.error("리프레시 토큰이 없습니다."));
        }
        AuthResponse response = authService.refresh(refreshToken);
        return createAuthResponse(response, "토큰이 재발급되었습니다.");
    }

    @PostMapping("/logout")
    @Operation(summary = "로그아웃", description = "인증 쿠키를 모두 만료시켜 로그아웃을 처리합니다.")
    public ResponseEntity<ApiResult<Void>> logout(
            @AuthenticationPrincipal String userId,
            @CookieValue(value = "refreshToken", required = false) String refreshToken) {

        // 1. 인증된 사용자 정보가 있다면 ID로 삭제 (가장 확실)
        if (userId != null) {
            authService.logoutByUserId(Long.valueOf(userId));
        }
        // 2. 토큰이 만료되었거나 비인증 상태지만 리프레시 토큰이 쿠키에 있다면 토큰으로 삭제
        else if (refreshToken != null && !refreshToken.isBlank()) {
            authService.logout(refreshToken);
        }

        boolean isSecure = Arrays.asList(env.getActiveProfiles()).contains("prod");

        // 3. 브라우저의 쿠키 무효화
        ResponseCookie accessCookie = ResponseCookie.from("accessToken", "")
                .httpOnly(true).secure(isSecure).path("/").maxAge(0).sameSite("Lax").build();

        // 리프레시 토큰 경로를 /api/auth로 설정하여 삭제 보장
        ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true).secure(isSecure).path("/api/auth").maxAge(0).sameSite("Lax").build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, accessCookie.toString())
                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                .body(ApiResult.message("로그아웃되었습니다."));
    }

    /**
     * accessToken과 refreshToken을 각각 알맞은 옵션으로 쿠키로 구워주는 공통 메서드
     */
    private ResponseEntity<ApiResult<Void>> createAuthResponse(AuthResponse response, String message) {
        boolean isSecure = Arrays.asList(env.getActiveProfiles()).contains("prod");

        ResponseCookie accessCookie = ResponseCookie.from("accessToken", response.accessToken())
                .httpOnly(true)
                .secure(isSecure)
                .path("/")
                .maxAge(3600) // 1시간
                .sameSite("Lax")
                .build();

        ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", response.refreshToken())
                .httpOnly(true)
                .secure(isSecure)
                .path("/api/auth") // 리프레시와 로그아웃에서 모두 접근 가능하도록 경로 조정
                .maxAge(7 * 24 * 3600) // 7일
                .sameSite("Lax")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, accessCookie.toString())
                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                .body(ApiResult.message(message)); // body에는 토큰을 일절 담지 않음 (ApiResult<Void>)
    }
}