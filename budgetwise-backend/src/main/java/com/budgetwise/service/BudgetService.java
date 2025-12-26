package com.budgetwise.service;

import com.budgetwise.dto.*;
import com.budgetwise.model.*;
import com.budgetwise.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    @Transactional
    public void saveBudget(String email, BudgetRequest request) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Budget budget = budgetRepository
                .findByUserEmailAndMonth(email, request.getMonth())
                .orElse(new Budget());

        budget.setUser(user);
        budget.setMonth(request.getMonth());
        budget.setTotalBudget(request.getTotalBudget());

        budget.getCategoryBudgets().clear();

        request.getCategories().forEach(dto -> {
            CategoryBudget cb = new CategoryBudget();
            cb.setCategory(dto.getCategory());
            cb.setAmount(dto.getAmount());
            cb.setBudget(budget);
            budget.getCategoryBudgets().add(cb);
        });

        budgetRepository.save(budget);
    }

    public void deleteBudget(String email, String month) {
        Budget budget = budgetRepository
                .findByUserEmailAndMonth(email, month)
                .orElseThrow(() -> new RuntimeException("Budget not found"));

        budgetRepository.delete(budget);
    }

    public BudgetResponse getBudgetSummary(String email, String month) {

        Budget budget = budgetRepository
                .findByUserEmailAndMonth(email, month)
                .orElseGet(() ->
                        budgetRepository
                                .findFirstByUserEmailAndMonthLessThanOrderByMonthDesc(
                                        email, month
                                )
                                .orElseThrow(() ->
                                        new RuntimeException("No previous budget found")
                                )
                );

        String[] parts = month.split("-");
        int year = Integer.parseInt(parts[0]);
        int monthValue = Integer.parseInt(parts[1]);

        LocalDate start = LocalDate.of(year, monthValue, 1);
        LocalDate end = start.withDayOfMonth(start.lengthOfMonth());

        // 🔒 CRITICAL FIX: ONLY EXPENSE transactions
        List<Expense> expenses =
        expenseRepository.findByUserEmailAndDateBetweenAndType(
        email,
        start,
        end,
        TransactionType.EXPENSE
        );


        double totalSpent = expenses.stream()
                .mapToDouble(Expense::getAmount)
                .sum();

        Map<String, Double> spentByCategory =
                expenses.stream().collect(
                        Collectors.groupingBy(
                                Expense::getCategory,
                                Collectors.summingDouble(Expense::getAmount)
                        )
                );

        List<BudgetResponse.Category> categories =
                budget.getCategoryBudgets().stream().map(cb -> {
                    double spent = spentByCategory.getOrDefault(cb.getCategory(), 0.0);
                    double percent = cb.getAmount() == 0
                            ? 0
                            : (spent / cb.getAmount()) * 100;

                    return BudgetResponse.Category.builder()
                            .category(cb.getCategory())
                            .budget(cb.getAmount())
                            .spent(spent)
                            .percentage(percent)
                            .build();
                }).toList();

        double overallPercent = budget.getTotalBudget() == 0
                ? 0
                : (totalSpent / budget.getTotalBudget()) * 100;

        return BudgetResponse.builder()
                .month(month)
                .overall(
                        BudgetResponse.Overall.builder()
                                .budget(budget.getTotalBudget())
                                .spent(totalSpent)
                                .remaining(budget.getTotalBudget() - totalSpent)
                                .percentage(overallPercent)
                                .build()
                )
                .categories(categories)
                .build();
    }
}

