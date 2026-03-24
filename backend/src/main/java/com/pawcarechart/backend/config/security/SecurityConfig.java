package com.pawcarechart.backend.config.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration // 설정 클래스
@EnableWebSecurity // 스프링 시큐리티를 활성화한다는 의미, 스프링 시큐리티의 기본 설정을 적용하면서 커스터마이징할 수 있게 해준다.
public class SecurityConfig {

    // 필터 주입 - JwtAuthenticationFilter는 JWT 토큰을 검증하는 역할을 하는 필터로, SecurityConfig에서 빈으로 등록하여 스프링 시큐리티의 필터 체인에 추가한다.
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    // SecurityFilterChain은 스프링 시큐리티의 필터 체인을 구성하는 빈으로, HttpSecurity 객체를 사용하여 보안 설정을 정의한다.
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // CSRF 끄기 - REST API에서는 일반적으로 CSRF 보호가 필요 없으므로 비활성화한다.(브라우저 기반 세션 로그인에서 주로 신경 쓰는 보호 장치)
                .cors(Customizer.withDefaults()) // 프론트와 백엔드 주소가 다를 때 필요한 설정 - CORS(Cross-Origin Resource Sharing) 설정을 기본값으로 활성화한다. 프론트엔드와 백엔드가 다른 도메인에서 동작할 때 CORS 정책에 따라 요청이 차단되는 것을 방지하기 위해 필요하다.
                // 서버가 로그인 상태를 세션으로 기억하지 않겠다는 의미, JWT 토큰을 사용하여 인증 정보를 전달하기 때문에 세션을 사용하지 않도록 설정한다.
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth // 어떤 요청을 허용할지 설정하는 부분
                        .requestMatchers(
                                "/api/auth/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/v3/api-docs/**"
                        ).permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/hello").permitAll()
                        .anyRequest().authenticated() // 위에서 허용한 것 말고 나머지 모든 요청은 로그인된 사용자만 가능
                )
                // 요청이 들어오면 먼저 JWT 토큰부터 검사하도록 필터 체인에 JwtAuthenticationFilter를 UsernamePasswordAuthenticationFilter보다 먼저 추가한다. UsernamePasswordAuthenticationFilter는 폼 로그인에서 사용되는 필터로, JWT 인증이 폼 로그인보다 먼저 처리되도록 설정한다.
                // (스프링 시큐리티가 기본적으로 갖고 있는 로그인 필터가 도는 위치보다 앞에서 jwtAuthenticationFilter를 먼저 실행하도록 설정한다는 의미)
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * 스프링 빈으로 PasswordEncoder를 등록한다. BCryptPasswordEncoder는 비밀번호를 안전하게 해싱하는 데 사용되는 구현체로, 회원가입 시 비밀번호를 해싱하여 저장하고 로그인 시 입력된 비밀번호와 저장된 해시를 비교하는 데 사용된다.
     * @return
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}

