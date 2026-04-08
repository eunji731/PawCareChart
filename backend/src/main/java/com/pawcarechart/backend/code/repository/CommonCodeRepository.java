package com.pawcarechart.backend.code.repository;

import com.pawcarechart.backend.code.entity.CommonCode;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommonCodeRepository extends JpaRepository<CommonCode, Long> {
    List<CommonCode> findAllByGroupCodeAndUseYnOrderBySortOrderAsc(String groupCode, String useYn);
}
