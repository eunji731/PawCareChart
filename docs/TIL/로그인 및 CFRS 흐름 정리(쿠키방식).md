# JWT 쿠키 방식 인증 정리 (CSRF 포함)

## 1. 개요
JWT 쿠키 방식 인증은 서버가 로그인 성공 후 JWT를 응답 본문에만 주는 것이 아니라, `Set-Cookie` 헤더를 통해 브라우저에 쿠키로 저장시키고 이후 요청마다 브라우저가 해당 쿠키를 자동 전송하도록 하는 방식이다. `Set-Cookie`는 서버가 브라우저에 쿠키를 저장시키는 표준 응답 헤더다.

이 방식은 흔히 "세션 로그인"과 혼동되지만, 실제로는 JWT를 그대로 사용하면서 전달 수단만 쿠키로 바꾼 구조일 수 있다. 서버가 세션을 저장하지 않고 요청마다 JWT를 검증하면 여전히 Stateless JWT 인증이다. Spring Security에서 `SessionCreationPolicy.STATELESS`를 사용하면 서버 세션을 인증 저장소로 쓰지 않겠다는 의미다.

---

## 2. 기본 동작 흐름

### 2.1 로그인
1. 사용자가 이메일/비밀번호로 로그인 요청을 보낸다.
2. 서버가 사용자 검증 후 JWT(access token)를 생성한다.
3. 서버는 응답 헤더에 `Set-Cookie`를 넣어 브라우저에 인증 쿠키를 저장시킨다. 

예시:
```http
Set-Cookie: accessToken=...; HttpOnly; Secure; Path=/; Max-Age=3600; SameSite=Lax
```
### 2.2 이후 요청

브라우저는 조건이 맞으면 이후 API 요청에 해당 쿠키를 자동으로 포함한다. 서버는 요청에서 쿠키를 읽고 JWT를 검증해 현재 사용자를 인증한다. 쿠키가 자동 전송된다는 점이 헤더 방식과 가장 큰 차이다.

## 3. 쿠키 속성 이해
### 3.1 HttpOnly

HttpOnly는 자바스크립트에서 쿠키 접근을 제한하는 속성이다. MDN은 인증 식별자처럼 민감한 쿠키에는 HttpOnly를 사용하는 것이 XSS로부터 토큰 탈취 위험을 줄이는 데 도움이 된다고 설명한다.

### 3.2 Secure

Secure는 HTTPS 연결에서만 쿠키를 전송하게 하는 속성이다. MDN은 민감한 인증 쿠키에는 Secure를 설정할 것을 권장한다. 다만 localhost는 예외적으로 개발 시 다르게 보일 수 있다.

### 3.3 Path

Path는 어떤 경로에 쿠키를 붙일지를 제어한다. 예를 들어 Path=/라면 사이트 전체 경로에서 쿠키가 사용될 수 있다.

### 3.4 Max-Age / Expires

쿠키의 유효 기간을 정한다. Spring의 ResponseCookieBuilder.maxAge()는 쿠키 만료 시간을 설정하는 용도다.

### 3.5 SameSite

SameSite는 브라우저가 크로스 사이트 요청에 쿠키를 보낼지 말지를 제어하는 속성이다. OWASP는 SameSite를 CSRF 완화 수단으로 설명한다. 값은 Strict, Lax, None이 있다.

## 4. CSRF란 무엇인가

CSRF(Cross-Site Request Forgery)는 사용자가 우리 서비스에 로그인된 상태라는 점을 악용해, 다른 사이트가 사용자의 브라우저로 우리 서버에 원치 않는 요청을 보내게 만드는 공격이다. OWASP는 CSRF를 사용자의 브라우저가 자동으로 인증 정보를 보내는 특성을 악용하는 공격으로 설명한다.

##### 예시 상황:

사용자가 우리 사이트에 로그인되어 있어 인증 쿠키를 가지고 있다.
사용자가 악성 사이트를 방문한다.
악성 사이트가 사용자의 브라우저로 우리 서버에 POST /api/account/delete 같은 요청을 보내게 유도한다.
브라우저가 인증 쿠키를 자동으로 붙이면, 서버는 정상 사용자 요청처럼 오인할 수 있다.

즉 CSRF의 핵심은:

사용자는 로그인되어 있고
브라우저는 쿠키를 자동 전송하고
서버는 그 쿠키만 보고 인증된 요청이라고 판단할 수 있다는 점이다.

## 5. 왜 쿠키 방식에서 CSRF를 더 신경 써야 하나

쿠키는 브라우저가 자동 전송한다. 반면 Authorization 헤더는 보통 자바스크립트 코드가 명시적으로 붙인다. 그래서 쿠키 인증은 브라우저 자동 전송 특성 때문에 CSRF 설계를 반드시 고려해야 한다. OWASP도 SameSite, CSRF 토큰 등 추가 방어 기법을 함께 설명한다.

## 6. SameSite의 의미
### 6.1 Strict

SameSite=Strict는 가장 엄격하다. 같은 사이트 맥락에서만 쿠키를 보내고, 외부 사이트에서 시작된 흐름에는 쿠키를 거의 보내지 않는다. MDN은 Strict가 매우 제한적이며 외부 사이트 유입 흐름에 영향을 줄 수 있다고 설명한다.

장점:

CSRF 완화에 강함

단점:

외부 링크 유입
이메일 링크 클릭
소셜 로그인/OAuth 복귀
특정 크로스 사이트 흐름

에서 정상 기능까지 막을 수 있다.

### 6.2 Lax

Lax는 Strict보다 덜 엄격하다. 일부 상위 탐색 같은 경우 쿠키를 보낼 수 있다. 브라우저들 중 상당수는 SameSite를 명시하지 않으면 Lax 성격으로 취급하기도 하므로, MDN은 명시적으로 설정할 것을 권장한다.

### 6.3 None

SameSite=None은 크로스 사이트 요청에도 쿠키를 허용한다. 다만 현대 브라우저에서는 보통 Secure가 함께 필요하다. 즉 일반적으로 SameSite=None; Secure 조합으로 사용한다.

## 7. SameSite가 만능은 아니다

OWASP는 SameSite를 CSRF 완화 수단으로 설명하지만, 이것만으로 모든 CSRF 문제를 끝내는 것은 아니라고 본다. 방어 심화(defense in depth) 관점에서 추가 보호가 필요할 수 있다.

즉 실무에서는:

SameSite
CSRF 토큰
민감 요청 보호 전략
Origin/Referer 검증
상태 변경 API 설계

등을 함께 본다.

## 8. Spring Boot / Spring Security에서 쿠키 인증 시 백엔드가 해야 할 일
### 8.1 로그인 시 Set-Cookie 응답

서버는 로그인 성공 후 ResponseCookie로 쿠키를 만들고 응답 헤더에 실어야 한다. Spring의 ResponseCookieBuilder는 httpOnly, secure, sameSite, path, maxAge 같은 속성을 제공한다.

### 8.2 요청 시 쿠키에서 JWT 추출

HttpServletRequest.getCookies()로 쿠키를 읽고 accessToken 값을 찾아 JWT를 파싱한 뒤 SecurityContext에 인증 객체를 넣는다.

### 8.3 세션을 쓰지 않을 경우 Stateless 유지

서버가 JWT만 검증하고 세션을 저장하지 않으려면 SessionCreationPolicy.STATELESS를 사용한다. 이는 "쿠키를 쓰지만 세션 로그인으로 바뀐 것은 아님"을 의미한다.

### 8.4 CORS + Credentials

프론트와 백엔드가 다른 origin이면, 백엔드는 Access-Control-Allow-Credentials: true 성격의 설정이 필요하고, 허용 origin도 *가 아니라 구체적으로 지정해야 한다. 쿠키 전송 허용과 함께 동작해야 하기 때문이다. 브라우저의 쿠키 정책과 SameSite 정책이 여기에 함께 영향을 준다.

## 9. 쿠키 방식의 장점
HttpOnly를 쓰면 자바스크립트가 토큰에 직접 접근하기 어려워져 XSS로 access token이 탈취되는 위험을 줄이는 데 도움이 된다.
브라우저가 쿠키 전송을 자동으로 처리해 프론트에서 토큰을 일일이 붙이는 로직이 줄어든다.
브라우저 보안 속성(SameSite, Secure)을 함께 활용할 수 있다.

## 10. 쿠키 방식의 단점 / 주의점
브라우저 자동 전송 특성 때문에 CSRF를 더 신경 써야 한다.
SameSite, Secure, CORS, credentials 설정이 서로 맞지 않으면 "로그인은 되는데 인증 쿠키가 안 붙는" 문제가 생길 수 있다.
배포 도메인 구조, 외부 로그인, 이메일 링크 유입 같은 흐름에서 SameSite=Strict가 과도하게 엄격할 수 있다.

## 11. 실무 요약
JWT를 쿠키에 담아도 세션 인증으로 바뀌는 것은 아니다. Stateless라면 여전히 JWT 인증이다.
쿠키 방식의 핵심 장점은 HttpOnly와 브라우저 쿠키 정책을 활용할 수 있다는 점이다.
쿠키 방식의 핵심 위험은 CSRF와 브라우저 정책 불일치다.
SameSite=Strict는 보안상 강하지만, 서비스 흐름에 따라 너무 엄격할 수 있다.
운영 환경에서는 인증 쿠키에 Secure를 검토해야 한다. MDN은 민감한 쿠키에 Secure, HttpOnly를 권장한다.