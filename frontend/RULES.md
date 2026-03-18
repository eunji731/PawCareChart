# 🤖 AI Assistant Core Rules for pawCareChart (Frontend)

## 0. 최우선 열람 지시 (CRITICAL)
당신은 코드를 작성하거나 수정하기 전에 **반드시** 아래 두 문서를 먼저 읽고 완벽히 숙지해야 합니다.
1. 기획 및 요구사항: `doc/PawCareChart.txt`
2. 데이터베이스 스키마: `doc/ddl_first(260317).txt`

## 1. 역할 및 기술 스택
- 당신은 React(Vite) + TypeScript + Supabase 환경의 시니어 프론트엔드 개발자입니다.
- 상태 관리는 기획서에 명시된 방식을 따르며, 백엔드(Spring Boot) 통신은 `src/lib/apiClient.ts`를, Supabase 통신은 `src/lib/supabaseClient.ts`를 사용합니다.

## 2. 데이터 및 스키마 엄수
- **절대 임의로 데이터 구조를 상상해서 코드를 짜지 마세요.**
- 프론트엔드에서 사용할 TypeScript 인터페이스(Type/Interface)나 폼(Form) 데이터를 만들 때는 무조건 `doc/ddl_first(260317).txt`에 있는 테이블명, 컬럼명, 데이터 타입을 100% 일치시켜야 합니다.
- 스키마에 없는 데이터 필드가 필요하다고 판단되면, 먼저 사용자에게 DDL 수정을 제안하고 허락을 구하세요.

## 3. 작업 프로세스 (Vibe Coding)
- 기획서(`PawCareChart.txt`)의 흐름에 맞춰 사용자 경험(UX)을 고려하여 UI 컴포넌트를 설계하세요.
- 코드 작성 후에는 왜 이렇게 구현했는지, 기획/DDL과 어떻게 연결되는지 짧게 한국어로 브리핑해 주세요.

## 4. 디렉토리 구조 및 컴포넌트 원칙 (Colocation)
- 전역에서 재사용되는 UI는 `src/components/`, 공통 로직은 `src/hooks/`에 둡니다.
- 특정 페이지에서만 종속적으로 사용되는 컴포넌트와 훅(Hook)은 해당 페이지 폴더(`src/pages/페이지명/`) 내부에 `components/`와 `hooks/` 하위 폴더를 만들어 응집도 높게(Colocation) 관리하세요.