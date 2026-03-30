package com.pawcarechart.backend.care.mapper;
import com.pawcarechart.backend.care.dto.CareRecordDetailQueryResult;
import com.pawcarechart.backend.care.dto.CareRecordListResponse;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Mapper
public interface CareMapper {

    List<CareRecordListResponse> selectCareRecordsByFilters(Long userId, Long dogId, String recordType, String searchKeyword, LocalDate startDate, LocalDate endDate);

    Optional<CareRecordDetailQueryResult> selectCareRecordDetail(@Param("id") Long id, @Param("userId") Long userId);
}
