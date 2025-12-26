package com.budgetwise.repository;

import com.budgetwise.model.SavingsEntry;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SavingsEntryRepository extends JpaRepository<SavingsEntry, Long> {
}