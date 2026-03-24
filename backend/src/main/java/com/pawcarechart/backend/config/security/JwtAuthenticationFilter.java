package com.pawcarechart.backend.config.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component // 스프링이 관리하는 객체로 등록, 스프링 시큐리티의 필터 체인에서 JWT 토큰을 검증하는 역할을 하는 필터 클래스
// OncePerRequestFilter : 요청당 한 번만 실행되는 필터, 여러 필터가 체인으로 연결되어 있을 때 중복 실행을 방지하기 위해 사용한다. (예: 인증 필터가 여러 번 실행되는 것을 방지)
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    // 토큰 해석하려면 JwtTokenProvider가 필요하니까 받아옴, JwtTokenProvider는 JWT 토큰을 생성하고 검증하는 역할을 하는 클래스이다. JwtAuthenticationFilter는 JwtTokenProvider를 사용하여 요청에서 JWT 토큰을 추출하고 검증한 후, 인증 정보를 SecurityContext에 저장한다.
    private final JwtTokenProvider jwtTokenProvider;

    public JwtAuthenticationFilter(JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        // 요청 헤더에서 Authorization 값을 읽어온다. 일반적으로 JWT 토큰은 "Authorization" 헤더에 "Bearer " 접두사와 함께 전달된다.
        String authorization = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (authorization != null && authorization.startsWith("Bearer ")) { // 헤더가 존재하고 "Bearer "로 시작하면 토큰 존재한다고 판단
            String token = authorization.substring(7); // Bearer 접두사 제거하여 실제 토큰 추출

            try {
                Claims claims = jwtTokenProvider.parse(token);  // 토큰을 파싱하여 클레임(토큰에 담긴 정보)을 추출한다. 이 과정에서 토큰이 유효한지 검증도 함께 수행된다. 만약 토큰이 유효하지 않거나 파싱에 실패하면 예외가 발생한다.
                String role = claims.get("role", String.class); // claims 중 "role"을 반환

                // 토큰이 정상이고, 이 사용자는 이런 권한을 가진 로그인 사용자입니다 라는 인증 객체를 만드는 것
                var authentication = new UsernamePasswordAuthenticationToken(
                        claims.getSubject(),
                        null, // 보통 credentials 자리인데, 이미 토큰으로 인증한 상태라 비밀번호 같은 건 안 넣음
                        role == null ? List.of() : List.of(new SimpleGrantedAuthority(role)) // 권한목록
                );

                // SecurityContext에 등록
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } catch (JwtException | IllegalArgumentException ignored) {
                // 토큰이 이상하면 인증 제거
                SecurityContextHolder.clearContext();
            }
        }
        // 다음 필터/컨트롤러로 넘김, JwtAuthenticationFilter는 요청에서 JWT 토큰을 검증한 후, 인증 정보를 SecurityContext에 저장하고 다음 필터나 컨트롤러로 요청을 전달한다. 만약 토큰이 유효하지 않으면 SecurityContext를 초기화하여 인증 정보를 제거한다.
        filterChain.doFilter(request, response);
    }
}
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