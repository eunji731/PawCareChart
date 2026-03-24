# 로그인 / JWT / Spring Security 흐름 정리

## 1. 전체 흐름

```text
로그인 요청
→ AuthController
→ AuthService
→ 사용자 조회 + 비밀번호 검증
→ JwtTokenProvider가 토큰 생성
→ AuthResponse 반환
→ 프론트가 토큰 저장
→ 이후 요청 시 Authorization 헤더에 accessToken 첨부
→ JwtAuthenticationFilter가 토큰 검사
→ SecurityContext에 인증 정보 등록
→ SecurityConfig가 인증 여부 확인 후 통과
```

## 2. 클래스별 역할
### AuthController
/api/auth/login, /signup, /refresh, /logout 요청을 받는 입구
실제 처리는 AuthService에 위임

### AuthService
회원가입: 이메일 중복 검사, 비밀번호 암호화, 사용자 저장
로그인: 사용자 조회, 비밀번호 검증
토큰 발급: issueTokens(user) 호출
refreshToken 저장 / 삭제 / 재발급 처리

### JwtTokenProvider
accessToken 생성
refreshToken 생성
토큰 parse(해석/검증)

### JwtAuthenticationFilter
요청 헤더의 Authorization: Bearer ... 확인
토큰 parse
userId, role 추출
인증 객체 생성 후 SecurityContext에 등록

### SecurityConfig
어떤 URL을 허용할지 설정
어떤 URL에 인증이 필요한지 설정
세션 대신 JWT 방식 사용
JWT 필터를 보안 흐름에 연결

## 3. 로그인 처리 흐름
#### 1) 요청

프론트가 로그인 요청 전송
```text
{
  "email": "test@test.com",
  "password": "1234"
}
```
#### 2) 컨트롤러
AuthController.login()이 요청을 받음
authService.login(request) 호출

#### 3) 서비스
이메일로 사용자 조회
없으면 로그인 실패
비밀번호 비교
틀리면 로그인 실패
맞으면 issueTokens(user) 호출

#### 4) 토큰 발급
accessToken 생성
refreshToken 생성
refreshToken DB 저장
AuthResponse 반환

## 4. 로그인 이후 요청 흐름

#### 프론트가 보호된 API 호출 시:
```text
Authorization: Bearer accessToken값
```
#### 서버 내부 흐름:

1. SecurityConfig가 인증이 필요한 URL인지 확인
2. JwtAuthenticationFilter가 헤더 확인
3. 토큰 추출
4. jwtTokenProvider.parse(token) 수행
5. userId, role 꺼냄
6. 인증 객체 생성
7. SecurityContext에 등록
8. 인증된 요청이면 컨트롤러까지 통과

## 5. JWT 핵심 개념
#### accessToken
실제 API 인증에 사용
userId, email, role 포함
수명이 짧음
#### refreshToken
accessToken 재발급용
userId 정도만 포함
수명이 더 김
DB에 저장해서 관리
#### subject
토큰 주인 식별값
현재 코드에서는 userId
#### claims
토큰 안에 넣는 추가 정보
현재 코드에서는 email, role
#### signWith(key)
토큰 위조 방지용 서명

## 6. SecurityConfig 핵심
#### permitAll()

로그인 없이 허용:

/api/auth/**
Swagger 관련 URL
GET /api/hello

#### authenticated()
위를 제외한 나머지 요청은 로그인 필요

#### STATELESS
세션 안 씀
서버가 로그인 상태를 기억하지 않음
클라이언트가 토큰을 들고 다님

## 7. JwtAuthenticationFilter 핵심
#### 하는 일
Authorization 헤더 확인
Bearer 제거 후 토큰 추출
토큰 검증
유효하면 인증 객체 생성
SecurityContext에 등록
#### 실패 시
토큰이 없거나 이상하면 인증 정보 없이 진행
인증 필요한 API에서는 접근 거부됨

## 8. 비밀번호 검증 핵심

회원가입 시:

passwordEncoder.encode()로 암호화 저장

로그인 시:

passwordEncoder.matches(입력값, 저장값)으로 비교

즉, DB 비밀번호와 문자열 그대로 비교하는 구조가 아님

## 9. 핵심 요약
1. AuthController는 요청을 받는 입구
2. AuthService가 로그인/회원가입 실제 처리 담당
3. JwtTokenProvider가 토큰 생성/해석 담당
4. JwtAuthenticationFilter가 요청마다 토큰 검사
5. SecurityConfig가 인증이 필요한 URL을 통제

## 10. 한 줄 정리

로그인할 때는 AuthService가 사용자를 검증하고 토큰을 발급하며,
로그인 이후에는 JwtAuthenticationFilter가 토큰을 읽어 인증 정보를 등록하고,
SecurityConfig가 인증된 요청만 보호된 API에 통과시킨다.