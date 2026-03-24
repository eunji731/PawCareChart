package com.pawcarechart.backend.config.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.util.Date;
import java.util.Map;

@Component
// 로그인 성공한 사용자 정보를 토큰으로 만들고, 토큰을 검증해서 사용자 정보를 꺼내는 역할을 하는 클래스.
public class JwtTokenProvider {

    private final SecretKey key;
    private final long accessTokenExpireSeconds;
    private final long refreshTokenExpireSeconds;

    /**
     * 생성자 주입  - application.properties에서 JWT 관련 설정값을 주입받아 SecretKey 객체와 토큰 만료 시간을 초기화.
     * 설정파일에서 secret과 만료시간 읽어옴, secret으로 JWT 서명용 key 생성
     * @param secret
     * @param accessTokenExpireSeconds
     * @param refreshTokenExpireSeconds
     */
    public JwtTokenProvider(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.access-token-expire-seconds:3600}") long accessTokenExpireSeconds,
            @Value("${jwt.refresh-token-expire-seconds:1209600}") long refreshTokenExpireSeconds
    ) {
        this.key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
        this.accessTokenExpireSeconds = accessTokenExpireSeconds;
        this.refreshTokenExpireSeconds = refreshTokenExpireSeconds;
    }

    /**
     * AccessToken 생성.
     * userId, email, role 넣고 만료시간 넣고 서명해서 accessToken 생성.
     * @param userId
     * @param email
     * @param role
     * @return
     */
    public String createAccessToken(Long userId, String email, String role) {
        Instant now = Instant.now();                                // 현재시간
        Instant expiry = now.plusSeconds(accessTokenExpireSeconds); // 만료시간 계산

        return Jwts.builder()
                .subject(String.valueOf(userId))                        // JWT 대표 식별값(subject)
                .claims(Map.of("email", email, "role", role))   // 추가정보(email, role)
                .issuedAt(Date.from(now))                               // 발급시간
                .expiration(Date.from(expiry))                          // 만료시간
                .signWith(key)                                          // 서명키로 JWT 서명
                .compact();                                             // JWT 문자열로 직렬화 반환
    }

    /**
     * RefreshToken 생성.
     * userId 넣고 만료시간 넣고 서명해서 refreshToken 생성.
     * @param userId
     * @return
     */
    public String createRefreshToken(Long userId) {
        Instant now = Instant.now();                                 // 현재시간
        Instant expiry = now.plusSeconds(refreshTokenExpireSeconds); // 만료시간 계산

        // claims 없음 (refreshToken은 실제 권한 검사 용도가 아니라 새 accessToken 재발급용이라서 더 단순하게 진행)
        return Jwts.builder()
                .subject(String.valueOf(userId))
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiry))
                .signWith(key)
                .compact();
    }

    /**
     * 토근 해석.
     * 받은 토큰이 진짜인지 key로 검증, 안에 들어있는 정보 꺼냄.
     * @param token
     * @return
     */
    public Claims parse(String token) {
        // Jwts.parser().verifyWith(key).build() : JWT 파서 객체 생성, 서명 검증을 위해 SecretKey 설정
        // parseSignedClaims(token) : JWT 문자열을 파싱하여 서명된 클레임(Claims) 객체로 반환, 이 과정에서 서명 검증도 함께 수행
        return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
    }

    /**
     * 리프레시 토큰 만료 시간 값 알기 위해 getter 와 동일한 기능.
     * @return
     */
    public long refreshTokenExpireSeconds() {
        return refreshTokenExpireSeconds;
    }

    /**
     * 엑세스 토큰 만료 시간 값 알기 위해 getter 와 동일한 기능.
     * @return
     */
    public long accessTokenExpireSeconds() {
        return accessTokenExpireSeconds;
    }
}

