# AuthContext
- 앱 전체의 로그인 상태를 관리하는 부분
- 지금 로그인한 사람이 누구인지 저장하고, 앱이 시작될 때 로그인 상태를 확인하고, 로그인/로그아웃을 공통으로 처리하고, 401 에러가 나면 자동으로 로그인 풀린 상태로 바꾸는 역할
- AuthProvider는 앱 전체에서 로그인 상태를 보관하고, 앱 시작/로그인 직후/인증 실패 시점을 관리하는 인증 중앙 관리자입니다


## 주요 기능
- user: 현재 로그인한 유저 정보
- isAuthenticated: 로그인 여부
- isLoading: 로그인 상태 확인 중 여부
- login: 로그인
- logout: 로그아웃
- checkAuth: 로그인 상태 확인

### 주요 포인트
1. `createContext`는 로그인 정보를 공유하기 위한 통로를 만든다.
2. `AuthProvider`는 그 통로에 실제 값을 넣어준다.
3. `checkAuth()`는 “지금 쿠키 기준으로 내가 로그인 상태인지 확인”하는 함수다.
4. `useEffect()`는 앱 시작 시 checkAuth()를 한 번 실행한다.
5. `useAuth()`는 다른 컴포넌트에서 인증 정보를 꺼내 쓰기 쉽게 만든 커스텀 훅이다.

### 앱 시작
- `AuthProvider` 실행
- `useEffect` 실행
- `checkAuth()` 호출
- `authApi.getMe()` 요청
- 성공하면 `user` 저장 / 실패하면 `null`

### 로그인
- `login(credentials)` 호출
- `authApi.login()` 실행
- `refreshCsrfToken()` 실행
- `checkAuth()` 실행
- `user` 상태 갱신
- `isAuthenticated`가 `true`가 됨

### 로그아웃
- `logout()` 호출
- `authApi.logout()` 실행
- 최종적으로 `setUser(null)`

### 인증 만료
- 다른 API 호출
- 서버가 401 응답
- 인터셉터가 감지
- `setUser(null)`

### interceptor 관련
- apiClient로 호출하는 axios 요청들은 응답이 올 때마다 이 로직을 거친다.(// apiClient가 받는 모든 응답에 대해 이 규칙을 적용)
- 401 에러가 오면 자동으로 user를 null로 바꾼다.
- 프로젝트 내에서의 역할 : 어떤 API에서든 401이 오면 로그인 상태를 자동 해제한다
```typescript
interceptors.response.use(
  성공했을 때 실행할 함수, // (response) => response
  실패했을 때 실행할 함수 // (error) => { ... }
)
```

### 401만 따로 취급하는 이유
- 로그인 안됨
- 토큰 만료
- 인증 실패
- 세션 없음
과 관련된 의미이므로 지금 인증된 사용자가 아니라는 의미기 때문에 user를 null로 바꾼다.

### Promise.reject(error) ?
- 의미 : 에러를 여기서 먹어버리지 말고, 원래 요청한 쪽에도 에러라고 알려줘라
- 인터셉터에서 401을 보고 setUser(null) 처리한 뒤에도 그 API를 호출한 쪽에서는 여전히 에러로 받아야 한다.
- `await apiClient.get('/something')` 와 같은 코드가 실행되서 401에러 발생시 
    인터셉터: setUser(null) 실행 -> 다시 에러를 던짐 -> 그래서 그 요청한 쪽의 catch도 동작 가능

### interceptor 사용이유
```typescript
try {
  const data = await apiClient.get('/api/dogs');
} catch (error: any) {
  if (error.response?.status === 401) {
    setUser(null);
  }
}
```
- 인터셉터가 없는 경우 모든 api마다 이와 같은 코드를 추가해야함
- 따라서 공통규칙으로 삼아 인터셉터로 빼는 것
- 모든 응답, 에러에 공통으로 적용할 처리

### `.eject(interceptor)` : cleanup
- 이걸 안 하면 같은 인터셉터가 여러 번 등록될 수 있음
- 없을 경우 401 한 번 났는데 처리를 여러번 하는 경우, 디버깅 어려움, 메모리 낭비등의 이슈 생김
- 등록한 인터셉터 번호를 저장해두고 필요할 때 제거하는 용도

### 전체 흐름 도식화
```text
[컴포넌트]
   ↓
apiClient.get(...) 호출
   ↓
[서버로 요청 전송]
   ↓
[서버 응답 반환]
   ↓
[response interceptor]
   ├─ 성공 응답이면 → 그대로 통과
   └─ 실패 응답이면 → error 확인
                        ├─ 401이면 setUser(null)
                        └─ Promise.reject(error)
   ↓
[원래 요청한 컴포넌트의 then / catch 로 이동]
```

### apiClient와 interceptor의 관계

interceptor는 혼자 존재하는 게 아니라
axios 인스턴스(apiClient)에 붙여서 사용한다.

즉 이런 뜻이다:

apiClient.interceptors.response.use(...)

해석:

apiClient가 받는 응답(response)에 대해 공통 규칙을 등록한다