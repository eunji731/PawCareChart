package com.pawcarechart.backend.config.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.util.Collections;
import java.util.Date;
import java.util.Map;

@Component
public class JwtTokenProvider {

    private final SecretKey key;
    private final long accessTokenExpireSeconds;
    private final long refreshTokenExpireSeconds;

    public JwtTokenProvider(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.access-token-expire-seconds:3600}") long accessTokenExpireSeconds,
            @Value("${jwt.refresh-token-expire-seconds:1209600}") long refreshTokenExpireSeconds
    ) {
        this.key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
        this.accessTokenExpireSeconds = accessTokenExpireSeconds;
        this.refreshTokenExpireSeconds = refreshTokenExpireSeconds;
    }

    public String createAccessToken(Long userId, String email, String role) {
        Instant now = Instant.now();
        Instant expiry = now.plusSeconds(accessTokenExpireSeconds);

        return Jwts.builder()
                .subject(String.valueOf(userId))
                .claims(Map.of("email", email, "role", role))
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiry))
                .signWith(key)
                .compact();
    }

    public String createRefreshToken(Long userId) {
        Instant now = Instant.now();
        Instant expiry = now.plusSeconds(refreshTokenExpireSeconds);

        return Jwts.builder()
                .subject(String.valueOf(userId))
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiry))
                .signWith(key)
                .compact();
    }

    public Claims parse(String token) {
        return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
    }

    public boolean validateToken(String token) {
        try {
            parse(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public Authentication getAuthentication(String token) {
        Claims claims = parse(token);
        String userId = claims.getSubject();
        String role = claims.get("role", String.class);
        
        return new UsernamePasswordAuthenticationToken(
                userId, 
                null, 
                Collections.singletonList(new SimpleGrantedAuthority(role))
        );
    }

    public long refreshTokenExpireSeconds() {
        return refreshTokenExpireSeconds;
    }

    public long accessTokenExpireSeconds() {
        return accessTokenExpireSeconds;
    }
}
