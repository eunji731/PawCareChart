package com.pawcarechart.backend.code.service;

import com.pawcarechart.backend.code.dto.CodeResponse;
import com.pawcarechart.backend.code.repository.CommonCodeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CodeService {

    private final CommonCodeRepository commonCodeRepository;

    /**
     * 특정 그룹 코드에 속한 활성화된 코드 목록 조회
     */
    public List<CodeResponse> getCodesByGroup(String groupCode) {
        return commonCodeRepository.findAllByGroupCodeAndUseYnOrderBySortOrderAsc(groupCode, "Y")
                .stream()
                .map(CodeResponse::from)
                .collect(Collectors.toList());
    }
}
