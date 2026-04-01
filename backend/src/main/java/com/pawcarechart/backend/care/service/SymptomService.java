package com.pawcarechart.backend.care.service;

import com.pawcarechart.backend.care.entity.CareRecordSymptom;
import com.pawcarechart.backend.care.entity.SymptomMaster;
import com.pawcarechart.backend.care.repository.CareRecordSymptomRepository;
import com.pawcarechart.backend.care.repository.SymptomMasterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collections;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SymptomService {

    private final SymptomMasterRepository symptomMasterRepository;
    private final CareRecordSymptomRepository careRecordSymptomRepository;

    /**
     * 특정 케어 기록에 연결된 증상 태그 이름 목록 조회
     */
    public List<String> getSymptomNamesByCareRecordId(Long careRecordId) {
        List<CareRecordSymptom> mappings = careRecordSymptomRepository.findAllByCareRecordId(careRecordId);
        if (mappings.isEmpty()) return Collections.emptyList();

        List<Long> symptomIds = mappings.stream().map(CareRecordSymptom::getSymptomId).toList();
        return symptomMasterRepository.findAllById(symptomIds).stream()
                .map(SymptomMaster::getName)
                .toList();
    }

    /**
     * 증상 태그 동기화 (기존 매핑 삭제 후 재등록)
     */
    @Transactional
    public void syncCareRecordSymptoms(Long careRecordId, Long dogId, List<String> tags) {
        careRecordSymptomRepository.deleteAllByCareRecordId(careRecordId);
        processAndConnectSymptoms(careRecordId, dogId, tags);
    }

    /**
     * 증상 태그 삭제
     */
    @Transactional
    public void deleteCareRecordSymptoms(Long careRecordId) {
        careRecordSymptomRepository.deleteAllByCareRecordId(careRecordId);
    }

    /**
     * 태그 문자열 리스트를 처리하여 DB에 연결 (사전 등록 포함)
     */
    @Transactional
    public void processAndConnectSymptoms(Long careRecordId, Long dogId, List<String> tags) {
        if (tags == null || tags.isEmpty()) return;

        // 1) 정제: trim, 빈 문자열 제거, 중복 제거
        List<String> cleanTags = tags.stream()
                .filter(Objects::nonNull)
                .map(String::trim)
                .filter(tag -> !tag.isEmpty())
                .distinct()
                .toList();

        for (String tagName : cleanTags) {
            // 2) 사전(Master) 확인 및 저장
            SymptomMaster symptom = symptomMasterRepository.findByName(tagName)
                    .orElseGet(() -> {
                        try {
                            return symptomMasterRepository.save(SymptomMaster.builder().name(tagName).build());
                        } catch (Exception e) {
                            // 동시성 이슈 대응: 다른 트랜잭션에서 먼저 저장했을 경우 재조회
                            return symptomMasterRepository.findByName(tagName)
                                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "증상 태그 저장 중 오류가 발생했습니다."));
                        }
                    });

            // 3) 매핑 저장
            careRecordSymptomRepository.save(CareRecordSymptom.builder()
                    .careRecordId(careRecordId)
                    .symptomId(symptom.getId())
                    .dogId(dogId)
                    .build());
        }
    }
}
