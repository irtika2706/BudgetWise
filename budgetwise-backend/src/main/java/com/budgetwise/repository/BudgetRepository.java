package com.budgetwise.repository;

import com.budgetwise.model.Budget;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BudgetRepository extends JpaRepository<Budget, Long> {

    Optional<Budget> findByUserEmailAndMonth(String email, String month);

    Optional<Budget> findFirstByUserEmailAndMonthLessThanOrderByMonthDesc(
            String email,
            String month
    );
}
