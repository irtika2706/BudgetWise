package com.budgetwise.repository;

import com.budgetwise.model.CategoryBudget;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategoryBudgetRepository extends JpaRepository<CategoryBudget, Long> {

    List<CategoryBudget> findByBudgetId(Long budgetId);
}
