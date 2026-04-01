package com.pawcarechart.backend.symptom.service;

import com.pawcarechart.backend.symptom.entity.CareRecordSymptom;
import com.pawcarechart.backend.symptom.entity.ScheduleSymptom;
import com.pawcarechart.backend.symptom.entity.SymptomMaster;
import com.pawcarechart.backend.symptom.repository.CareRecordSymptomRepository;
import com.pawcarechart.backend.symptom.repository.ScheduleSymptomRepository;
import com.pawcarechart.backend.symptom.repository.SymptomMasterRepository;
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
    private final ScheduleSymptomRepository scheduleSymptomRepository;

    /**
     * 특정 케어 기록에 연결된 증상 태그 이름 목록 조회
     */
    public List<String> getSymptomNamesByCareRecordId(Long careRecordId) {
        List<CareRecordSymptom> mappings = careRecordSymptomRepository.findAllByCareRecordId(careRecordId);
        return getSymptomNamesFromIds(mappings.stream().map(CareRecordSymptom::getSymptomId).toList());
    }

    /**
     * 특정 일정에 연결된 증상 태그 이름 목록 조회
     */
    public List<String> getSymptomNamesByScheduleId(Long scheduleId) {
        List<ScheduleSymptom> mappings = scheduleSymptomRepository.findAllByScheduleId(scheduleId);
        return getSymptomNamesFromIds(mappings.stream().map(ScheduleSymptom::getSymptomId).toList());
    }

    private List<String> getSymptomNamesFromIds(List<Long> symptomIds) {
        if (symptomIds.isEmpty()) return Collections.emptyList();
        return symptomMasterRepository.findAllById(symptomIds).stream()
                .map(SymptomMaster::getName)
                .toList();
    }

    /**
     * 일정 증상 태그 동기화
     */
    @Transactional
    public void syncScheduleSymptoms(Long scheduleId, List<String> tags) {
        scheduleSymptomRepository.deleteAllByScheduleId(scheduleId);
        if (tags == null || tags.isEmpty()) return;

        List<String> cleanTags = cleanTags(tags);
        for (String tagName : cleanTags) {
            SymptomMaster symptom = getOrCreateSymptom(tagName);
            scheduleSymptomRepository.save(ScheduleSymptom.builder()
                    .scheduleId(scheduleId)
                    .symptomId(symptom.getId())
                    .build());
        }
    }

    @Transactional
    public void deleteScheduleSymptoms(Long scheduleId) {
        scheduleSymptomRepository.deleteAllByScheduleId(scheduleId);
    }

    /**
     * 케어 기록 증상 태그 동기화
     */
    @Transactional
    public void syncCareRecordSymptoms(Long careRecordId, Long dogId, List<String> tags) {
        careRecordSymptomRepository.deleteAllByCareRecordId(careRecordId);
        processAndConnectSymptoms(careRecordId, dogId, tags);
    }

    /**
     * 케어 기록 증상 태그 삭제
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

        List<String> cleanTags = cleanTags(tags);

        for (String tagName : cleanTags) {
            SymptomMaster symptom = getOrCreateSymptom(tagName);

            // 매핑 저장
            careRecordSymptomRepository.save(CareRecordSymptom.builder()
                    .careRecordId(careRecordId)
                    .symptomId(symptom.getId())
                    .dogId(dogId)
                    .build());
        }
    }

    private List<String> cleanTags(List<String> tags) {
        return tags.stream()
                .filter(Objects::nonNull)
                .map(String::trim)
                .filter(tag -> !tag.isEmpty())
                .distinct()
                .toList();
    }

    private SymptomMaster getOrCreateSymptom(String tagName) {
        return symptomMasterRepository.findByName(tagName)
                .orElseGet(() -> {
                    try {
                        return symptomMasterRepository.save(SymptomMaster.builder().name(tagName).build());
                    } catch (Exception e) {
                        return symptomMasterRepository.findByName(tagName)
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "증상 태그 저장 중 오류"));
                    }
                });
    }
}
