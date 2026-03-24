Read docs first: PawCareChart_V2, ddl_first, ddl_second.
DDL is source of truth.
Do not invent schema.
Use Spring Boot 3 + Java 17 + JWT + JPA.
Use only:
users, refresh_tokens, dogs, vet_records, expenses, files, file_mappings, schedules, health_logs, symptom_tags.
Scope all queries by authenticated user.
Use DTOs, not entities, in responses.
Prefer JPA for CRUD.
Use MyBatis/native only for complex stats.
Do not rename `expenses`.
Keep changes minimal.