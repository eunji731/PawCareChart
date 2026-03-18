# TailwindCSS v4 + Vite 환경 설정 트러블슈팅 정리

## 1. 개요
멍케어차트 초기 로그인 화면 UI를 구현하고 브라우저에서 띄웠을 때, Tailwind CSS가 전혀 적용되지 않고 일반 브라우저의 기본 HTML 스타일로만 렌더링되는 문제가 발생.

## 2. 문제 발생 과정 및 원인 분석

1. **Tailwind 미설치 (최초 원인)**
   기획서 상에 "tailWind.css"가 명시되어 있어 코드는 Tailwind 클래스 기반으로 짜여졌으나, 실제 프론트엔드 환경(`package.json`)에는 Tailwind 패키지가 설치되어 있지 않았음.
2. **버전 호환성 문제 & 잘못된 설정 (결정적 원인)**
   - 문제를 인지한 후 `npm install tailwindcss postcss autoprefixer` 명령어와 `tailwindcss init` 명령어를 통해 기존 v3 방식의 설정을 시도했음.
   - 프로젝트 환경은 Vite v8 인데 최근 릴리즈된 **Tailwind CSS v4**가 설치되었음.
   - Tailwind v4는 기존 `postcss.config.js`와 `tailwind.config.js`를 사용하던 구조에서 벗어나, Vite 내장 플러그인(`@tailwindcss/vite`)을 사용하는 구조로 전면 개편되었음.
   - 구형 설정 파일(`postcss.config.mjs`)이 프로젝트 최상단에 존재하면, 최신 Tailwind 모듈과 충돌하여 스타일 생성이 멈추는 에러가 발생했음.
3. **서버 좀비 프로세스 캐시 문제**
   - 올바른 v4 설정으로 변경하고 파일들을 삭제했음에도 스타일이 적용되지 않았음.
   - 이전 설정의 상태를 물고 있는 Vite 개발 서버 백그라운드 프로세스가 종료되지 않고 남아포트를 점유하고 있었음.(Port 5173 / PID 00000)
   - 이로 인해 `.vite` 캐시 등 구버전 설정 찌꺼기가 남아 새로 설정된 Vite + Tailwind 렌더링이 되지 않았음.

## 3. 해결 밎 조치 방법

Vite 기반 프론트엔드에서 Tailwind v4 버전을 사용할 때는 다음과 같이 조치.

1. **설정 파일 제거 및 패키지 재설치**
   - 구버전 설정 파일인 `postcss.config.mjs`, `tailwind.config.js`를 삭제.
   - 호환성 문제 방지를 위해 `--legacy-peer-deps` 옵션을 주어 Vite 전용 Tailwind 플러그인을 설치.
     ```bash
     npm install -D @tailwindcss/vite --legacy-peer-deps
     ```
2. **Vite 설정 파일(`vite.config.ts`) 수정**
   - Tailwind 익스텐션을 플러그인에 등록.
     ```typescript
     import { defineConfig } from 'vite'
     import react from '@vitejs/plugin-react'
     import tailwindcss from '@tailwindcss/vite' // 추가

     export default defineConfig({
       plugins: [
         tailwindcss(), // 플러그인 함수 실행
         react()
       ],
     })
     ```
3. **진입점 CSS(`src/index.css`) 수정**
   - `@tailwind base;`와 같은 기존 디렉티브를 모두 지우고 v4 스타일 임포트 구문 하나만 남김.
     ```css
     @import "tailwindcss";
     ```
4. **캐시 비우기 및 서버 강제 재시작 (가장 중요)**
   - 의존성 캐시 문제를 일으킬 수 있는 구버전 폴더(`node_modules/.vite`)를 삭제.
   - 기존에 실행 중이던/포트를 점유하던 Node 프로세스를 강제로 완전히 종료(Taskkill)한 후 처음부터 서버(`npm run dev`)를 다시 시작.

## 4. 향후 주의사항

- **CSS 엔진 메이저 업데이트 주의**: Tailwind v3 와 v4 는 설치 방법 및 아키텍처가 완전히 다름. 블로그나 ChatGPT의 오래된 정보(구버전 PostCSS기반)를 따라할 경우 오류가 발생할 수 있음.
- **서버 설정 파일 수정 시 재시작 필수**: `vite.config.ts` 등 빌드 단의 설정이 변경되었을 때는 핫 리로드(HMR)만 믿지 말고 터미널에서 강제로 서버를 종료 후 켜는 습관을 들이는 것이 좋음.
- **포트 점유 상태 확인**: 설정은 다 맞는데 브라우저에서 요지부동이라면 서버 프로세스가 죽지 않고 두 개가 겹쳐서 돌고 있는지 체크(`netstat -ano`)하고 과감히 정리해야 함.
