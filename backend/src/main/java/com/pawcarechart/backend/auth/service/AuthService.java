package com.pawcarechart.backend.auth.service;

import com.pawcarechart.backend.auth.dto.AuthResponse;
import com.pawcarechart.backend.auth.dto.LoginRequest;
import com.pawcarechart.backend.auth.dto.RefreshRequest;
import com.pawcarechart.backend.auth.dto.SignupRequest;
import com.pawcarechart.backend.auth.entity.RefreshToken;
import com.pawcarechart.backend.auth.repository.RefreshTokenRepository;
import com.pawcarechart.backend.code.entity.CommonCode;
import com.pawcarechart.backend.config.security.JwtTokenProvider;
import com.pawcarechart.backend.user.entity.User;
import com.pawcarechart.backend.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

import com.pawcarechart.backend.user.dto.UserResponse;

@RequiredArgsConstructor
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final com.pawcarechart.backend.code.repository.CommonCodeRepository commonCodeRepository;

    @Transactional
    public UserResponse getUserInfo(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다."));

        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .roleId(user.getRole().getId())
                .roleName(user.getRole().getCodeName())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }

    @Transactional
    public AuthResponse signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 사용 중인 이메일입니다.");
        }

        Long defaultRoleId = getCodeId("USER_ROLE", "ROLE_USER");
        CommonCode defaultRole = commonCodeRepository.findById(defaultRoleId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "기본 권한 코드를 찾을 수 없습니다."));

        User user = userRepository.save(User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .role(defaultRole)
                .build());

        return issueTokens(user);
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "이메일 또는 비밀번호가 올바르지 않습니다."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "이메일 또는 비밀번호가 올바르지 않습니다.");
        }

        return issueTokens(user);
    }

    @Transactional
    public AuthResponse refresh(String refreshToken) {
        RefreshToken savedToken = refreshTokenRepository.findByToken(refreshToken)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "유효하지 않은 리프레시 토큰입니다."));

        if (savedToken.isExpired(LocalDateTime.now())) {
            refreshTokenRepository.delete(savedToken);
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "만료된 리프레시 토큰입니다.");
        }

        Long userIdFromToken;
        try {
            userIdFromToken = Long.valueOf(jwtTokenProvider.parse(refreshToken).getSubject());
        } catch (Exception e) {
            refreshTokenRepository.delete(savedToken);
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "유효하지 않은 리프레시 토큰입니다.");
        }

        if (!savedToken.getUser().getId().equals(userIdFromToken)) {
            refreshTokenRepository.delete(savedToken);
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "리프레시 토큰 사용자 정보가 일치하지 않습니다.");
        }

        return issueTokens(savedToken.getUser());
    }

    @Transactional
    public void logoutByUserId(Long userId) {
        refreshTokenRepository.deleteByUser_Id(userId);
    }

    @Transactional
    public void logout(String refreshToken) {
        if (refreshToken != null && !refreshToken.isBlank()) {
            refreshTokenRepository.findByToken(refreshToken)
                    .ifPresent(refreshTokenRepository::delete);
        }
    }

    private AuthResponse issueTokens(User user) {
        refreshTokenRepository.deleteByUser_Id(user.getId());

        String roleCode = user.getRole().getCode();
        String accessToken = jwtTokenProvider.createAccessToken(user.getId(), user.getEmail(), roleCode);
        String refreshToken = jwtTokenProvider.createRefreshToken(user.getId());

        refreshTokenRepository.save(RefreshToken.builder()
                .user(user)
                .token(refreshToken)
                .expiryDate(LocalDateTime.now().plusSeconds(jwtTokenProvider.refreshTokenExpireSeconds()))
                .build());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtTokenProvider.accessTokenExpireSeconds())
                .userId(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .build();
    }

    private String getCodeValue(Long id) {
        return commonCodeRepository.findById(id)
                .map(CommonCode::getCode)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "잘못된 코드 ID입니다."));
    }

    private Long getCodeId(String groupCode, String code) {
        return commonCodeRepository.findAllByGroupCodeAndUseYnOrderBySortOrderAsc(groupCode, "Y")
                .stream()
                .filter(c -> c.getCode().equals(code))
                .findFirst()
                .map(CommonCode::getId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "필요한 공통 코드가 정의되지 않았습니다: " + code));
    }
}
