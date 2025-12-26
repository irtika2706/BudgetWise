package com.budgetwise.repository;

import com.budgetwise.model.SavingsGoal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SavingsGoalRepository extends JpaRepository<SavingsGoal, Long> {

    List<SavingsGoal> findByUserEmail(String email);

    Optional<SavingsGoal> findByIdAndUserEmail(Long id, String email);
}