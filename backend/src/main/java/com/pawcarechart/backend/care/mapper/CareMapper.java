package com.pawcarechart.backend.care.mapper;
import com.pawcarechart.backend.care.dto.CareRecordListResponse;
import org.apache.ibatis.annotations.Mapper;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface CareMapper {

    List<CareRecordListResponse> selectCareRecordsByFilters(Long userId, Long dogId, String recordType, String searchKeyword, LocalDate startDate, LocalDate endDate);
}
