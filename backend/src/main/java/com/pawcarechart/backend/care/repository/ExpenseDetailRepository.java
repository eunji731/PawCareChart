package com.pawcarechart.backend.care.repository;

import com.pawcarechart.backend.care.entity.ExpenseDetail;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExpenseDetailRepository extends JpaRepository<ExpenseDetail, Long> {
}
