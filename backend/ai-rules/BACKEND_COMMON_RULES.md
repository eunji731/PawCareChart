# PawCareChart Backend Rules

- 먼저 읽기:
  1) PawCareChart_V2
  2) ddl_first
  3) ddl_second

- DDL이 최종 기준이다.
- 기획서와 DDL이 다르면 DDL을 따른다.
- 없는 테이블/컬럼/상태값은 만들지 않는다.

- 기술 스택:
  Spring Boot 3, Java 17, Gradle, Supabase PostgreSQL,
  Spring Security, JWT, JPA 우선

- 핵심 테이블:
  users, refresh_tokens, dogs, vet_records, expenses,
  files, file_mappings, schedules, health_logs, symptom_tags

- 기본 원칙:
  1) 로그인 사용자 기준으로만 데이터 조회/수정
  2) 엔티티를 API 응답으로 직접 노출 금지
  3) Request/Response DTO 분리
  4) CRUD는 JPA 우선
  5) 복잡한 집계만 native query/MyBatis 허용
  6) 전역 예외 처리 사용
  7) 유효성 검증 적용

- 파일 처리:
  files = 파일 메타데이터
  file_mappings = 파일 연결 정보
  target_type, target_id 구조 임의 변경 금지

- 주의:
  expense_records라고 쓰지 말고 실제 DDL 테이블명 expenses 사용