package com.budgetwise.repository;

import com.budgetwise.model.Expense;
import com.budgetwise.model.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findByUserId(Long userId);

    List<Expense> findByUserEmailAndDateBetween(
            String email,
            LocalDate start,
            LocalDate end
    );

    // ✅ ADD THIS — expense-only fetch for budget calculations
    List<Expense> findByUserEmailAndDateBetweenAndType(
            String email,
            LocalDate start,
            LocalDate end,
            TransactionType type
    );
}


