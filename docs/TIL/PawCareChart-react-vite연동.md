# [pawCareChart] 프론트엔드(Vite) 초기 세팅 및 백엔드 연동 가이드

## 📌 문서 개요
본 문서는 `pawCareChart` 프로젝트의 `dev/frontend` 디렉토리 초기 환경 설정 및 Spring Boot 백엔드와의 통신 연동 방법을 명세한다.

## 🛠️ 기술 스택 (Frontend)
- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **HTTP Client**: Axios (for Spring Boot), `@supabase/supabase-js` (for DB/Auth)
- **State Management**: `@tanstack/react-query` (예정)

## ⚙️ 상세 설정 단계

### 1. 환경 변수 설정
`dev/frontend` 루트 경로에 `.env.local` 파일을 생성하고 아래 변수를 등록한다.

```env
# Supabase 연결 정보 (대시보드에서 발급)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Spring Boot API 서버 주소
VITE_API_BASE_URL=http://localhost:8080/api
```
#### 💡 코드 설명:
- Vite 프로젝트에서는 환경 변수 이름이 반드시 VITE_로 시작해야 리액트 코드 안에서 읽어올 수 있습니다.

- .env.local 파일은 깃허브(Git)에 올라가지 않도록 미리 .gitignore에 설정되어 있어 보안을 지켜줍니다


### 2. 통신 클라이언트 모듈화 (src/lib/)
외부와의 통신을 담당하는 클라이언트를 모듈화하여 관리한다.
데이터를 주고받을 때마다 매번 주소와 설정을 적는 것은 비효율적입니다. 따라서 통신을 전담하는 '공통 창구'를 미리 만들어둠.

supabaseClient.ts
Supabase DB 직접 접근 및 인증 정보를 다루는 클라이언트.

```TypeScript
import { createClient } from '@supabase/supabase-js';
// 환경 변수에서 Supabase URL과 KEY를 가져옵니다.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
// 클라이언트 객체를 생성하여 내보냅니다(export).
export const supabase = createClient(supabaseUrl, supabaseKey);
```
#### 💡 코드 설명:

import.meta.env : Vite에서 .env 파일에 적어둔 환경 변수를 불러오는 전용 명령어입니다.

createClient : Supabase가 제공하는 함수로, 이 함수에 URL과 Key를 넣으면 DB에 접근할 수 있는 만능 열쇠(supabase 객체)가 만들어집니다. 앞으로 DB에서 데이터를 뺄 때는 이 supabase 객체만 불러와서 사용하면 됩니다.


apiClient.ts
Spring Boot 백엔드와 통신하기 위한 Axios 인스턴스.

```TypeScript
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // 기본 주소 (http://localhost:8080/api)
  headers: {
    'Content-Type': 'application/json', // "우리는 JSON 형태로 대화할 거야"라는 약속
  },
});
```

#### 💡 코드 설명:

axios.create : Axios의 기본 설정을 세팅해 두는 기능입니다.

baseURL을 설정해 두었기 때문에, 앞으로 리액트에서 백엔드로 요청을 보낼 때 전체 주소를 다 적을 필요 없이 apiClient.get('/hello') 처럼 뒷부분 주소만 적어도 자동으로 완성됩니다.

### 3. Spring Boot CORS 설정 반영
프론트엔드의 원활한 API 호출을 위해 백엔드 프로젝트에 아래 설정이 적용되어 있어야 한다.
프론트엔드(localhost:5173)와 백엔드(localhost:8080)는 주소(포트)가 다르기 때문에, 브라우저가 해킹 시도로 오해하고 통신을 막아버립니다. (이를 CORS 에러라고 합니다.) 이를 해결하기 위한 백엔드 설정.

```Java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // 백엔드의 모든 API 주소에 대하여
                .allowedOrigins("http://localhost:5173") // 리액트(Vite)의 접근을 허락함
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // 허용할 통신 방식
                .allowCredentials(true); // 인증 정보(쿠키 등)를 포함한 요청도 허락함
    } 
}
```
### 4. 연동 테스트 예시 (App.tsx)
초기 세팅이 정상적으로 완료되었는지 확인하기 위한 테스트 코드 예시.
스프링 부트의 상태 체크 응답을 받고, Supabase에서 특정 대상(예: 봉봉)의 기록을 조회하는 로직을 포함한다.

```TypeScript
import { useEffect, useState } from 'react';
import { apiClient } from './lib/apiClient';

function App() {

  // 백엔드에서 받아온 메시지를 저장할 '상태(State)' 공간을 만듬.  
  const [backendMessage, setBackendMessage] = useState<string>('');

  // useEffect: 화면이 처음 켜질 때 딱 한 번만 실행되는 함수.
  useEffect(() => {
    // 백엔드(Spring Boot) 통신 테스트(apiClient를 이용해 백엔드의 /hello 주소로 접근)
    apiClient.get('/hello')
        // 2. 통신이 성공(.then)하면, 받아온 데이터(response.data)를 상태에 저장
      .then((response) => setBackendMessage(response.data))
        // 3. 통신이 실패(.catch)하면, 에러 메시지
      .catch((error) => console.error('API 연결 실패:', error));
  }, []);// 끝에 있는 [] 빈 배열이 '처음 켜질 때 한 번만'을 의미

  return (
    <div>
      <h1>🐾 Paw Care Chart 초기 세팅 완료</h1>
      <div>
        <h2>백엔드 연결 상태</h2>
        <p>{backendMessage || '연결 중...'}</p>
      </div>
    </div>
  );
}

export default App;
```