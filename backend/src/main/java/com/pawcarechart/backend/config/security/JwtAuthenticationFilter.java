package com.pawcarechart.backend.config.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Cookie;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;

    public JwtAuthenticationFilter(JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        // 먼저 요청에 들어온 쿠키들 중에서 accessToken을 찾아서 토큰을 꺼냄
        String token = resolveTokenFromCookie(request);

        if (token != null) {
            try {
                // JWT를 해석해서 안에 들어 있는 값들을 꺼냄(검증 과정 포함)
                Claims claims = jwtTokenProvider.parse(token);
                String role = claims.get("role", String.class);

                // 이 요청은 누구로 인증되었는가를 스프링 시큐리티가 이해할 수 있는 객체로 만드는 것
                var authentication = new UsernamePasswordAuthenticationToken(
                        claims.getSubject(), // 사용자 ID 또는 이메일
                        null,
                        role == null ? List.of() : List.of(new SimpleGrantedAuthority(role)) // 권한
                );

                // 이 요청은 로그인된 사용자 요청이다라고 스프링 시큐리티에게 알려주는 과정
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } catch (JwtException | IllegalArgumentException ignored) {
                // 토큰 만료, 위조, 이상할 경우 로그인 안 된 상태로 처리
                SecurityContextHolder.clearContext();
            }
        }
        filterChain.doFilter(request, response);
    }

    /**
     * 요청에 포함된 모든 쿠키를 가져온 뒤, 이름이 "accessToken"인 쿠키를 찾아서 그 값을 반환하는 메서드
     * @param request
     * @return
     */
    private String resolveTokenFromCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("accessToken".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
}
// [헤더에 저장 방식에서 쿠키 HttpOnly로 방식 변경]
// 이전 : Authorization: Bearer xxx 을 확인하고 값을 꺼냄 (프론트가 토큰을 알고 있고 프론트가 직접 매 요청마다 붙임)
// 이후 : Cookie: accessToken=xxx 을 확인하고 값을 꺼냄(브라우저가 토큰 들고있고 브라우저가 자동으로 보내며 백엔드는 쿠키에서 토큰을 읽음)




// [정상 진행 과정]
// 특정 url 요청이 옴 -> SecurityConfig의 url 확인 -> 해당 url이 인증 필요 여부 확인 -> 인증 필요 -> JwtAuthenticationFilter 실행
// -> Authorization 헤더에서 토큰 꺼냄 -> jwtTokenProvider.parse(token)으로 검증 -> 정상이면 subject(userId), role 꺼냄-> Authentication 객체 만들어 SecurityContext에 저장
// -> 스프링 시큐리티 확인 : 인증객체유무 확인, 로그인 사용자 인정 유무 -> 컨트롤러까지 통과

// [토큰 없거나 이상]
// (토큰 없음) : 필터에서 인증 객체 안넣음 -> anyRequest().authenticated()에 걸림(SecurityConfig) -> 접근 거부
// (토큰 이상) : pares중 예외 -> clearContext -> 인증 제거 -> anyRequest().authenticated()에 걸림 -> 접근 거부

// 인증(Authentication)
// JWT 토큰으로 인증(이 사람이 누구인지를 확인하는 것)

// 인가(Authorization)
// 이 사람이 이 기능을 해도 되냐를 확인하는 것

// 필터(Filter)
// 컨트롤러 가기 전 요청을 가로채 검사하는 중간 처리기(JWT 토큰 검증, CORS 설정 등)

// SecurityContext
// 현재 요청의 로그인 사용자 정보를 담아두는 공간(여기에 authentication 넣어야 스프링 시큐리티가 로그인 상태로 인식)

// Authentication 객체
// 현재 사용자는 누구고, 어떤 권한을 가졌는지 담는 객체

// [현재 코드 기준 각 클래스 역할 정리]
// (SecurityConfig)
// /api/auth/**는 누구나 허용, 나머지는 로그인 필요,  세션 안 쓰고 JWT 방식 사용,  JWT 필터를 먼저 실행

// (JwtAuthenticationFilter)
// Authorization 헤더에서 Bearer 토큰 꺼냄, 토큰 검증, userId/role 추출, 인증 객체 생성, SecurityContext에 등록