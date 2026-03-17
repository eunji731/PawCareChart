# PawCareChart - Jira MCP 연결 및 초기 자동 생성 작업 기록

## 문서 목적
이 문서는 **PawCareChart 프로젝트에서 실제로 Jira MCP를 연결하고**, 원페이저(`PawCareChart.txt`)를 바탕으로 Jira에 Epic / Task / Sub-task를 생성한 과정을 기록한다.

이 문서는 다음에 중점을 둔다.
* PawCareChart 프로젝트 기준 실제 연결 절차
* 사용한 경로, 설정 파일, 명령어
* 중간에 발생한 오류와 해결
* 실제 Jira 생성 흐름

---

## 작업 기준 경로

* **프로젝트 루트:** `D:\selfProject\pawCareChart`
* **원페이저 파일:** `D:\selfProject\pawCareChart\docs\PawCareChart.txt`
* **Codex 설정 파일:** `D:\selfProject\pawCareChart\.codex\config.toml`

---

## 목표
이번 작업의 목표는 아래와 같았다.
1. Codex CLI와 Jira MCP 연결
2. PawCareChart 원페이저를 기반으로 Jira 작업 구조 자동 분해
3. Epic 생성 및 이후 Task / Sub-task 생성
4. 일정/담당자/스프린트는 사람이 직접 관리
5. AI는 작업 구조와 description 작성에 집중

---

## 전체 진행 순서
1. Codex CLI 설치 확인
2. Atlassian API token 준비
3. `email:token` Base64 생성
4. `ATLASSIAN_AUTH_HEADER` 환경변수 등록
5. `.codex/config.toml` 작성
6. 프로젝트 폴더에서 Codex 실행
7. `/mcp` 연결 확인
8. Jira 프로젝트 접근 테스트
9. PawCareChart 원페이저 기반 구조 초안 생성
10. Epic 생성 및 Task / Sub-task 생성

---

## 실제 사용 명령어

### 1. 프로젝트 폴더 이동
```powershell
Set-Location D:\selfProject\pawCareChart
```

### 2. .codex 폴더 생성
```powershell
New-Item -ItemType Directory -Force D:\selfProject\pawCareChart\.codex
```

### 3. API token Base64 생성
```powershell
$pair = "내이메일@example.com:API_TOKEN"
[Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($pair))
```

### 4. 환경변수 저장
* **영구 저장:** `setx ATLASSIAN_AUTH_HEADER "Basic Base64값전체"`
* **현재 세션 반영:** `$env:ATLASSIAN_AUTH_HEADER = "Basic Base64값전체"`

### 5. config.toml 작성
* **파일 경로:** `D:\selfProject\pawCareChart\.codex\config.toml`
* **내용:**
```toml
[mcp_servers.atlassian]
url = "https://mcp.atlassian.com/v1/mcp"
env_http_headers = { Authorization = "ATLASSIAN_AUTH_HEADER" }
required = true
```

### 6. Codex 실행 및 MCP 확인
```powershell
codex
/mcp
```

정상 연결 시 Atlassian 서버가 **enabled**로 보이며, 다음과 같은 도구가 확인된다.
* `createJiraIssue`, `editJiraIssue`, `getVisibleJiraProjects`, `searchJiraIssuesUsingJql`, `getJiraProjectIssueTypesMetadata` 등

---

## 실제로 겪은 오류와 해결

### 1. config.toml 파일을 실행하려고 한 오류
* **상황:** PowerShell에서 파일 경로만 입력하여 실행 시도.
* **문제:** PowerShell이 설정 파일을 실행 파일로 인식해 오류 발생.
* **해결:** `notepad D:\selfProject\pawCareChart\.codex\config.toml`로 수정.

### 2. No MCP servers configured
* **상황:** `/mcp` 명령 시 서버가 잡히지 않음.
* **원인:** 프로젝트 폴더가 아닌 홈 디렉터리에서 Codex 실행.
* **해결:** 반드시 `D:\selfProject\pawCareChart` 폴더로 이동 후 실행.

### 3. setx 후 값이 바로 안 보인 문제
* **상황:** 저장 후 `echo $env:ATLASSIAN_AUTH_HEADER` 결과가 빈 값임.
* **원인:** `setx`는 새 PowerShell 창부터 반영됨.
* **해결:** 현재 세션에도 직접 `$env:`를 통해 할당.

### 4. Base64 값 끝의 == 관련 혼동
* **상황:** 끝의 패딩 문자(`=`, `==`) 포함 여부 불분명.
* **해결:** 결과값 전체(패딩 포함)를 그대로 사용.

### 5. MCP는 연결됐지만 Jira 권한이 막힌 문제
* **메시지:** `You don't have permission to connect via API token...`
* **해결:** 계정/사이트 권한 점검 및 실제 Jira 프로젝트 키를 명시하여 작업하도록 방향 정리.

---

## PawCareChart 기준 작업 분해 흐름

### 영역 구분
원페이저(`PawCareChart.txt`)를 기준으로 Codex가 아래 4개 영역으로 구조를 나눴다.
1. **Frontend**
2. **Backend**
3. **DB**
4. **인프라**

### Epic 생성 결과
| Key | Name |
| :--- | :--- |
| PAWCHART-1 | MVP 프론트엔드 사용자 화면 구축 |
| PAWCHART-2 | MVP 백엔드 API 및 인증 구축 |
| PAWCHART-3 | MVP 데이터베이스 스키마 및 무결성 설계 |
| PAWCHART-4 | MVP 배포 및 운영 환경 구성 |

---

## 실제 사용한 프롬프트 예시

### 1. 프로젝트 상태 및 보드 조회
> "내가 접근 가능한 Jira 프로젝트 목록을 보여줘. PawCareChart 작업을 넣기 적절한 프로젝트를 추천해줘."
> "Jira 프로젝트 키가 PAWCHART인 프로젝트의 현재 이슈 상태를 요약해줘. 중복 방지를 위해 기존 기능들을 분류해줘."

### 2. 원페이저 기반 초안 생성
> "D:\selfProject\pawCareChart\docs\PawCareChart.txt 파일을 읽고, 중복되지 않게 MVP에 필요한 Epic과 Task 초안을 제안해줘. 프론트/백엔드/DB/인프라로 구분하고 구조만 먼저 보여줘."

### 3. Epic 및 Task 생성
> "방금 정리한 Epic 구조만 먼저 생성해줘. 이후 생성된 Epic 아래에 Task와 Sub-task를 함께 생성해줘. 각 description에는 구현 상세 내용을 포함해줘."

---

## 정리 및 현재 상태

### 핵심 포인트
* 연결 성공과 실제 데이터 생성 권한은 별개다.
* 로컬 `.codex/config.toml`의 위치가 매우 중요하다.
* **조회 → 초안 → 확인 → 생성** 흐름을 유지하는 것이 가장 안전하다.

### 현재 상태
* Codex CLI 설치 및 Jira MCP 연결 완료.
* PawCareChart 원페이저 기반 구조 분해 및 Jira 입력 완료(Epic/Task/Sub-task).
* 이후 일정, 담당자, 우선순위 등은 수동으로 조정 예정.

---
