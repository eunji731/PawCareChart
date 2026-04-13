# apiClient
- “앞으로 apiClient로 요청하면, 기본 주소/쿠키/CSRF 설정을 자동으로 붙이고, 응답도 공통 형태로 한 번 정리해서 넘겨주겠다”
- axios를 기반으로 만든 API 요청 래퍼(wrapper)
- 우리 프로젝트 전용 axios 생성
- 기본 주소도 정해져있고 쿠키도 자동 포함하고 CSRF 관련 설정도 들어있고 응답 후처리도 자동으로 하는 커스텀 axios 인스턴스


## Axios 라이브러리
- 자바스크립트에서 HTTP 요청을 보내는 데 쓰는 라이브러리
- 브라우저의 `fetch` API를 더 편하게 쓸 수 있게 해주는 도구
- `fetch`보다 설정이 간편하고, 인터셉터(요청/응답 가로채기), 자동 JSON 변환, 에러 처리 등이 편리
- `axios`를 사용하면 API 요청을 일관된 방식으로 만들고 관리하기 쉬움
- 서버에 요청보내기, 응답받기, 에러처리하기, 공통 설정 묶기 좋게 만든 도구
- `axios.create` : 공통 설정이 들어간 프로젝트 전용 axios를 만든다

## baseURL
- 요청 앞에 자동으로 붙는 기본 주소
```typescript
baseURL: import.meta.env.VITE_API_BASE_URL || '/api',

apiClient.get('/dogs')  // -> [VITE_API_BASE_URL]/dogs
```
### import.meta.env
- Vite에서 환경변수 읽는 방식
- .env 파일에 적은 값을 읽어올 때 사용
- VITE_ 접두사가 붙은 것만 읽어올 수 있음

### withCredentials: true
- HttpOnly 쿠키를 서버와 주고받기 위해 필수 설정(이 요청은 인증용 쿠키도 같이 보내라)
- 브라우저가 쿠키를 요청에 같이 보내도록 허용하는 설정
- 현재 프로젝트 : JWT를 localStorage가 아니라 HttpOnly 쿠키로 주고받는 구조 => withCredentials: true 필수
- withCredentials: true 설정이 없으면 브라우저는 서버가 보낸 쿠키를 저장하지 않고, 요청 시 자동으로 포함하지도 않음

### withXSRFToken: true
- CSRF 관련
- 인증을 쿠키 기반으로 하면 브라우저가 쿠키를 자동으로 보내는 특성이 생기고 이로인해 CSFR방어가 중요해짐
- 때문에 서버가 CSRF 토큰을 쿠키로 내려주고 프론트는 그 토큰을 헤더에 넣어 보내는 구조 많이 사용
- Axios가 XSRF 토큰을 자동으로 읽어서 헤더에 넣도록 돕는 옵션

### xsrfCookieName, xsrfHeaderName
- `xsrfCookieName` : 브라우저 쿠키 중에서 어떤 이름의 쿠키를 CSRF 토큰으로 볼 건지 정하는 것
- `xsrfHeaderName` : 찾아낸 CSRF 토큰을 어떤 헤더 이름으로 보낼지 정하는 것

## headers - Content-Type
- `Content-Type: application/json` : 요청 본문(body)이 JSON 형식임을 서버에 알림
- `Content-Type: multipart/form-data` : 파일 업로드 시 사용
- `Content-Type: application/x-www-form-urlencoded` : 폼 데이터 전송 시 사용
- 파일업로드시 content-Type를 제이슨으로 박아두면 문제 발생 가능
- json 요청은 axios가 자동 처리하게 두고 파일 업로드만 FormData 사용하도록 하는게 적합

### 응답 인터셉터
- 인터셉터 : 요청이나 응답이 실제로 전달되기 전에 가로채서 특정 작업을 수행할 수 있게 해주는 기능
- axios의 인터셉터는 요청을 보내기 전이나 응답을 받기 전에 공통 로직을 적용할 때 사용(서버가 응답을 주고 그 응답이 컴포넌트로 바로 가기 전에 한번 검사, 수정하고 넘기는 기능)
- response.data.response, response.data.data 등 여러 겹으로 오는 응답을 한 번에 벗겨내서 컴포넌트에서는 그냥 데이터만 받도록 설정 => response.data
```typescript
{ "success": true, "response": ... }
{ "success": true, "data": ... }

// => response.data
```
## Promise.reject(error)
- 인터셉터에서 에러를 잡았다고 해서 삼켜버리면, 실제로 API를 호출한 쪽은 실패를 알 수 없음.
- -> 그래서 에러를 던져줌
- 공통처리 조금 하고 호출한 쪽에서도 catch 가능하도록 다시 넘김

## 전체 흐름
- 1. URL 완성(baseUrl 사용)
- 2. 쿠키 포함 (withCredentials: true 때문에 인증 쿠키 같이 감)
- 3. CSRF 토큰 포함 (withXSRFToken: true 때문에 CSRF 토큰 같이 감)
- 4. 요청 보내기
- 5. 응답 받기
- 6. 응답 가공(인터셉터에서 response.data 벗겨내기)
- 7. 에러 처리(에러 있으면 던지기)


