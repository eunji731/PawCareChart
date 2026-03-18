# PawCareChart 백엔드 개발환경 구성 및 Supabase DB 연동 기록

---

## 목차
1. [문서 목적](#문서-목적)
2. [작업 배경](#작업-배경)
3. [적용한 설정 구조](#적용한-설정-구조)
4. [실제 작성한 파일 구조](#실제-작성한-파일-구조)
5. [설정 내용](#설정-내용)
6. [연동 중 발생한 오류](#연동-중-발생한-오류)
7. [오류 원인 분석](#오류-원인-분석)
8. [해결 방법](#해결-방법)
9. [최종 적용 결과](#최종-적용-결과)
10. [다음 작업 시 참고할 점](#다음-작업-시-참고할-점)

---

## 1. 문서 목적

이 문서는 PawCareChart 프로젝트에서 **Spring Boot 백엔드와 Supabase PostgreSQL을 연동한 과정**을 기록하기 위한 문서이다.

단순 개념 정리보다 아래 내용을 중심으로 남긴다.

- 실제 어떤 구조로 설정했는지
- 어떤 파일에 어떤 내용을 작성했는지
- 연동 중 어떤 오류가 발생했는지
- 각 오류를 어떻게 확인하고 해결했는지

---

## 2. 작업 배경

PawCareChart 백엔드 개발환경을 구성하면서 DB로 **Supabase PostgreSQL**을 사용하기로 했다.

초기 목표는 다음과 같았다.

- Spring Boot에서 Supabase PostgreSQL 연결
- IntelliJ 실행 환경 구성
- `dev` 프로파일 기준 datasource 분리
- `.env`로 접속 정보 관리
- yml에는 실제 비밀번호를 직접 적지 않는 구조 적용

---

## 3. 적용한 설정 구조

이번 프로젝트에서는 아래 구조를 사용했다.

### 구성 파일

- `application.yaml`
  - 공통 설정
  - `dev` 프로파일 활성화
  - swagger, mybatis 등 공통 설정

- `application-dev.yml`
  - `.env` import
  - datasource 설정
  - JPA 개발 옵션

- `.env`
  - 실제 DB 접속 정보 관리

---

## 4. 실제 작성한 파일 구조

```text
pawcarechart-backend/
  ├── src/
  ├── build.gradle
  ├── .env
  ├── .gitignore
  ├── application.yaml
  ├── application-dev.yml
  └── application-prod.yml
```

## 5. 설정 내용
### 5.1 application.yaml
```text
spring:
  profiles:
    active: dev

springdoc:
  swagger-ui:
    path: /swagger-ui.html
    operationsSorter: method

mybatis:
  mapper-locations: classpath:mapper/**/*.xml
  type-aliases-package: com.pawcarechart.backend
  configuration:
    map-underscore-to-camel-case: true
```
적용 의도

기본 실행 프로파일을 dev로 지정

공통 설정을 중앙에서 관리

datasource 설정은 포함하지 않음

### 5.2 application-dev.yml
```text
spring:
  config:
    import: optional:file:./.env[.properties]

  datasource:
    url: ${DB_URL}
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
    driver-class-name: org.postgresql.Driver

  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    open-in-view: false
```

적용 의도

개발 환경에서만 datasource 설정 적용

.env 값을 참조하도록 구성

개발 편의를 위한 JPA 옵션 설정

### 5.3 .env
```text
DB_URL=jdbc:postgresql://aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres?sslmode=require
DB_USERNAME=postgres.<project-ref>
DB_PASSWORD=실제비밀번호
```

적용 의도

민감 정보 분리

Git에 비밀번호 노출 방지

## 6. 연동 중 발생한 오류
### 6.1 JDBC 연결 오류
org.hibernate.exception.JDBCConnectionException: unable to obtain isolated JDBC connection
Caused by: org.postgresql.util.PSQLException: The connection attempt failed.
Caused by: java.net.SocketTimeoutException: Connect timed out

### 당시 의심 원인

- Supabase 주소 오류  
- 포트 차단  
- pooler 설정 문제  
- 비밀번호 오류  
- `.env` 미반영  
- yml 설정 충돌  

---

### 6.2 yml 설정 혼선

다음과 같은 설정 문제 가능성을 의심했다.

- `spring:` 키 중복 선언 가능성  
- `application.yaml` vs `application-dev.yml` 간 datasource 중복  
- 설정 우선순위 충돌  

---

### 6.3 .env 미적용 의심

설정을 변경했음에도 동일한 오류가 지속되었다.

→ `.env` 파일이 정상적으로 적용되지 않는 것으로 보였음

## 7. 오류 원인 분석
### 7.1 네트워크 확인
```text
Test-NetConnection aws-1-ap-northeast-2.pooler.supabase.com -Port 6543
Test-NetConnection aws-1-ap-northeast-2.pooler.supabase.com -Port 5432
```
→ 정상

### 7.2 DBeaver 연결 확인

동일한 DB 정보로 DBeaver에서 연결 테스트를 수행한 결과 정상 접속이 확인되었다.

#### ✔ 확인된 사실

- DB 주소 정상  
- 포트 정상  
- 계정 정상  
- 비밀번호 정상  

→ **Spring 설정 문제로 범위를 축소할 수 있었음**

---

### 7.3 yml 구조 점검

설정 파일 구조를 점검한 결과 다음과 같이 정리되었다.

- 프로파일 구조 정상  
- datasource 위치 정리 완료  

→ 구조 자체는 문제 없음 확인

---

### 7.4 최종 원인

👉 IntelliJ Run Configuration의 Environment Variables

- 이전에 입력된 환경변수가 남아 있었음  
- `.env`보다 우선 적용됨  
- 최신 설정이 덮어쓰기됨  

---

## 8. 해결 방법

### 8.1 IntelliJ 설정 확인

다음 항목을 확인하였다.

- Environment Variables  
- Working Directory  

---

### 8.2 기존 환경변수 제거

- 기존에 설정되어 있던 DB 관련 환경변수 삭제 또는 최신 값으로 수정  

---

### 8.3 datasource 구조 정리

- datasource는 `application-dev.yml`에서만 관리  
- 실제 값은 `.env`에서 참조하도록 구성  

---

### 8.4 보안 유지

- 비밀번호는 `.env`에만 존재하도록 유지  

## 9. 최종 적용 결과
```text
HikariPool-1 - Added connection org.postgresql.jdbc.PgConnection@...
HikariPool-1 - Start completed.
Initialized JPA EntityManagerFactory for persistence unit 'default'
Tomcat started on port 8080 (http)
Started Application
```


### 결과 요약

- Supabase PostgreSQL 연결 성공  
- Spring Boot 정상 실행  
- JPA 초기화 완료  
- datasource 설정 정상 동작  

---

## 10. 다음 작업 시 참고할 점

### 10.1 DB 연결 오류 발생 시

- DBeaver로 먼저 확인  

→ DB 자체 문제인지 빠르게 판단 가능  

---

### 10.2 IntelliJ 설정 우선 확인

- `.env`, yml보다 IDE 설정이 우선 적용될 수 있음  

---

### 10.3 datasource 단일화

- datasource는 한 곳에서만 관리  


###10.4 .env Git 제외
```text
.env
.env.*
!.env.example
```
## 문서 결론

이번 Supabase 연동 이슈는 단순한 DB 장애가 아니라,  
**실행 환경 설정 충돌(IntelliJ Environment Variables)** 문제였다.

이를 통해 다음과 같은 원칙을 정리할 수 있었다.

- 공통 설정과 환경별 설정은 명확히 분리한다.  
- 민감 정보는 `.env`로 관리한다.  
- DB 연결 오류 발생 시 IDE 실행 환경도 함께 점검한다.  