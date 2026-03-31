-- =========================================================
-- PawCareChart Integrated Schema v5
-- 기준: v4 + 하이브리드 증상 태그(N:M) + MEMO 타입 통합
-- 반영사항:
-- 1) symptom_tags를 symptoms_master(사전)와 care_record_symptoms(연결)로 분리 (다대다)
-- 2) 모든 사용자가 증상 태그 풀을 공유하도록 unique 제약조건 추가
-- 3) RECORD_TYPE에 'MEMO' 추가하여 일상 관찰을 타임라인에 통합
-- =========================================================

-- =========================================================
-- 0. 공통코드 관리
-- =========================================================
CREATE TABLE code_groups (
    id BIGSERIAL PRIMARY KEY,
    group_code VARCHAR(50) NOT NULL UNIQUE,
    group_name VARCHAR(100) NOT NULL,
    description TEXT,
    use_yn CHAR(1) NOT NULL DEFAULT 'Y',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_code_groups_use_yn CHECK (use_yn IN ('Y', 'N'))
);

CREATE TABLE codes (
    id BIGSERIAL PRIMARY KEY,
    group_code VARCHAR(50) NOT NULL REFERENCES code_groups(group_code),
    code VARCHAR(50) NOT NULL,
    code_name VARCHAR(100) NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    description TEXT,
    use_yn CHAR(1) NOT NULL DEFAULT 'Y',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_codes_group_code_code UNIQUE (group_code, code),
    CONSTRAINT chk_codes_use_yn CHECK (use_yn IN ('Y', 'N'))
);

CREATE INDEX idx_codes_group_code ON codes (group_code);
CREATE INDEX idx_codes_group_code_use_yn ON codes (group_code, use_yn);

-- =========================================================
-- 1. 사용자 및 인증 관리
-- =========================================================
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(50) NOT NULL,
    role_code VARCHAR(50) NOT NULL DEFAULT 'ROLE_USER',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_users_role_code FOREIGN KEY (role_code)
        REFERENCES codes(code)
        DEFERRABLE INITIALLY DEFERRED
);

CREATE TABLE refresh_tokens (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expiry_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================
-- 2. 반려견 정보 관리
-- =========================================================
CREATE TABLE dogs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    breed VARCHAR(50),
    birth_date DATE,
    weight DECIMAL(5,2),
    profile_image_url TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================
-- 3. 케어기록 통합 관리 (부모 테이블)
-- =========================================================
CREATE TABLE care_records (
    id BIGSERIAL PRIMARY KEY,
    dog_id BIGINT NOT NULL REFERENCES dogs(id) ON DELETE CASCADE,
    record_type_code VARCHAR(50) NOT NULL,
    record_date DATE NOT NULL,
    title VARCHAR(200),
    note TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_care_records_record_type_code FOREIGN KEY (record_type_code)
        REFERENCES codes(code)
        DEFERRABLE INITIALLY DEFERRED
);

CREATE INDEX idx_care_records_dog_date ON care_records (dog_id, record_date DESC);
CREATE INDEX idx_care_records_type ON care_records (record_type_code);

-- ---------------------------------------------------------
-- 3-1. 병원 기록 상세 (MEDICAL)
-- ---------------------------------------------------------
CREATE TABLE care_record_medical_details (
    care_record_id BIGINT PRIMARY KEY REFERENCES care_records(id) ON DELETE CASCADE,
    clinic_name VARCHAR(100) NOT NULL,
    symptoms TEXT, -- 의사의 상세 소견을 적는 서술형 텍스트 (태그와 무관)
    diagnosis TEXT,
    treatment TEXT,
    medication_start_date DATE,
    medication_days INTEGER,
    is_medication_completed BOOLEAN NOT NULL DEFAULT FALSE
);

-- ---------------------------------------------------------
-- 3-2. 지출 기록 상세 (EXPENSE)
-- ---------------------------------------------------------
CREATE TABLE care_record_expense_details (
    care_record_id BIGINT PRIMARY KEY REFERENCES care_records(id) ON DELETE CASCADE,
    category_code VARCHAR(50) NOT NULL,
    amount INTEGER NOT NULL,
    memo TEXT,
    related_medical_record_id BIGINT REFERENCES care_records(id) ON DELETE SET NULL,
    CONSTRAINT chk_expense_amount CHECK (amount >= 0),
    CONSTRAINT fk_expense_category_code FOREIGN KEY (category_code)
        REFERENCES codes(code)
        DEFERRABLE INITIALLY DEFERRED
);

CREATE INDEX idx_expense_related_medical_record ON care_record_expense_details (related_medical_record_id);
CREATE INDEX idx_expense_category_code ON care_record_expense_details (category_code);

-- =========================================================
-- 4. 파일 관리
-- =========================================================
CREATE TABLE files (
    id BIGSERIAL PRIMARY KEY,
    original_file_name VARCHAR(255) NOT NULL,
    stored_file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_size BIGINT,
    file_type VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE file_mappings (
    id BIGSERIAL PRIMARY KEY,
    file_id BIGINT NOT NULL REFERENCES files(id) ON DELETE CASCADE,
    target_type VARCHAR(50) NOT NULL,
    target_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_file_mapping_target_type CHECK (target_type IN ('CARE_RECORD', 'DOG', 'HEALTH_LOG'))
);

CREATE INDEX idx_file_mappings_target ON file_mappings (target_type, target_id);

-- =========================================================
-- 5. 일정 관리
-- =========================================================
CREATE TABLE schedules (
    id BIGSERIAL PRIMARY KEY,
    dog_id BIGINT NOT NULL REFERENCES dogs(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    schedule_date DATE NOT NULL,
    schedule_type_code VARCHAR(50),
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    memo TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_schedules_schedule_type_code FOREIGN KEY (schedule_type_code)
        REFERENCES codes(code)
        DEFERRABLE INITIALLY DEFERRED
);

CREATE INDEX idx_schedules_dog_date ON schedules (dog_id, schedule_date);
CREATE INDEX idx_schedules_type_code ON schedules (schedule_type_code);

-- =========================================================
-- 6. 빠른 관찰 메모 (health_logs)
-- ※ 참고: v5부터는 care_records의 'MEMO' 타입을 활용하는 것을 권장하나, 
-- 아주 가벼운 단독 메모 용도를 위해 기존 구조를 남겨둡니다.
-- =========================================================
CREATE TABLE health_logs (
    id BIGSERIAL PRIMARY KEY,
    dog_id BIGINT NOT NULL REFERENCES dogs(id) ON DELETE CASCADE,
    log_date DATE NOT NULL DEFAULT CURRENT_DATE,
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_health_logs_dog_date ON health_logs (dog_id, log_date DESC);

-- =========================================================
-- 7. 증상 사전(Master) 및 매핑 (v5 변경점: 하이브리드 N:M 구조)
-- =========================================================

-- 7-1. 증상 마스터 (모든 견주가 공유하는 글로벌 태그 풀)
CREATE TABLE symptoms_master (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL, -- 중복 생성 방지용 UNIQUE
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_symptoms_master_name ON symptoms_master (name);

-- 7-2. 케어기록-증상 연결 테이블 (N:M 매핑)
CREATE TABLE care_record_symptoms (
    id BIGSERIAL PRIMARY KEY,
    care_record_id BIGINT NOT NULL REFERENCES care_records(id) ON DELETE CASCADE,
    symptom_id BIGINT NOT NULL REFERENCES symptoms_master(id) ON DELETE CASCADE,
    dog_id BIGINT NOT NULL REFERENCES dogs(id) ON DELETE CASCADE, -- 통계(랭킹) 조회 성능을 위한 반정규화
    severity_code VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_care_record_symptoms_severity FOREIGN KEY (severity_code)
        REFERENCES codes(code)
        DEFERRABLE INITIALLY DEFERRED
);

CREATE INDEX idx_crs_dog_id ON care_record_symptoms (dog_id);
CREATE INDEX idx_crs_care_record_id ON care_record_symptoms (care_record_id);
CREATE INDEX idx_crs_symptom_id ON care_record_symptoms (symptom_id);

-- =========================================================
-- 8. 조회 편의용 뷰
-- =========================================================
CREATE VIEW vw_care_record_list AS
SELECT
    cr.id,
    cr.dog_id,
    cr.record_type_code,
    cr.record_date,
    cr.title,
    cr.note,
    md.clinic_name,
    md.symptoms,
    md.diagnosis,
    md.treatment,
    md.medication_start_date,
    md.medication_days,
    md.is_medication_completed,
    ed.category_code AS expense_category_code,
    ed.amount AS expense_amount,
    ed.memo AS expense_memo,
    ed.related_medical_record_id,
    cr.created_at,
    cr.updated_at
FROM care_records cr
LEFT JOIN care_record_medical_details md ON md.care_record_id = cr.id
LEFT JOIN care_record_expense_details ed ON ed.care_record_id = cr.id;

-- =========================================================
-- 9. 공통코드 초기 데이터 (MEMO 타입 추가)
-- =========================================================
INSERT INTO code_groups (group_code, group_name, description) VALUES
('USER_ROLE', '사용자 역할', '권한 관리용 코드'),
('RECORD_TYPE', '케어기록 유형', '통합 케어기록 유형'),
('EXPENSE_CATEGORY', '지출 카테고리', '지출 분류 코드'),
('SCHEDULE_TYPE', '일정 유형', '예방접종/재진 등 일정 코드'),
('SYMPTOM_SEVERITY', '증상 심각도', '증상 강도 코드');

INSERT INTO codes (group_code, code, code_name, sort_order) VALUES
('USER_ROLE', 'ROLE_USER', '일반 사용자', 1),
('USER_ROLE', 'ROLE_ADMIN', '관리자', 2),
('RECORD_TYPE', 'MEDICAL', '병원기록', 1),
('RECORD_TYPE', 'EXPENSE', '지출기록', 2),
('RECORD_TYPE', 'MEMO', '일상기록', 3),  -- v5 추가됨 (타임라인 통합용)
('EXPENSE_CATEGORY', 'CONSULTATION', '진료비', 1),
('EXPENSE_CATEGORY', 'MEDICINE', '약값', 2),
('EXPENSE_CATEGORY', 'EXAM', '검사비', 3),
('EXPENSE_CATEGORY', 'VACCINE', '예방접종', 4),
('EXPENSE_CATEGORY', 'GROOMING', '미용', 5),
('EXPENSE_CATEGORY', 'FOOD', '사료/간식', 6),
('EXPENSE_CATEGORY', 'ETC', '기타', 99),
('SCHEDULE_TYPE', 'VACCINE', '예방접종', 1),
('SCHEDULE_TYPE', 'HEARTWORM', '심장사상충', 2),
('SCHEDULE_TYPE', 'CHECKUP', '재진/정기검진', 3),
('SCHEDULE_TYPE', 'GROOMING', '미용', 4),
('SCHEDULE_TYPE', 'MEDICATION', '복약', 5),
('SCHEDULE_TYPE', 'ETC', '기타', 99),
('SYMPTOM_SEVERITY', 'LOW', '낮음', 1),
('SYMPTOM_SEVERITY', 'MEDIUM', '보통', 2),
('SYMPTOM_SEVERITY', 'HIGH', '높음', 3);