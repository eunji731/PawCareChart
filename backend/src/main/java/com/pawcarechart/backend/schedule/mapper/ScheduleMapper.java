package com.pawcarechart.backend.schedule.mapper;

import com.pawcarechart.backend.schedule.dto.ScheduleResponse;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface ScheduleMapper {
    List<ScheduleResponse> selectSchedules(
            @Param("userId") Long userId,
            @Param("dogId") Long dogId,
            @Param("typeId") Long typeId,
            @Param("keyword") String keyword,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );
}
