package com.budgetwise.service;

import com.budgetwise.dto.ExpenseResponse;
import com.budgetwise.model.Expense;
import com.budgetwise.model.User;
import com.budgetwise.repository.ExpenseRepository;
import com.budgetwise.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    public Expense addExpense(Expense expense, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (expense.getType() == null) {
            throw new RuntimeException("Transaction type is required");
        }

        expense.setUser(user);
        return expenseRepository.save(expense);
    }

    public List<ExpenseResponse> getExpenses(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow();

        return expenseRepository.findByUserId(user.getId())
                .stream()
                .map(e -> {
                    ExpenseResponse dto = new ExpenseResponse();
                    dto.setId(e.getId());
                    dto.setTitle(e.getTitle());
                    dto.setAmount(e.getAmount());
                    dto.setCategory(e.getCategory());
                    dto.setType(e.getType().name());   // ✅ NEW
                    dto.setDate(e.getDate());
                    return dto;
                })
                .toList();
    }

    @Transactional
    public void deleteExpense(Long id, String email) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow();

        if (!expense.getUser().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized");
        }

        expenseRepository.delete(expense);
    }

    public Expense updateExpense(Long id, Expense updated, String email) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found"));

        if (!expense.getUser().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized");
        }

        // ❌ TYPE IS INTENTIONALLY NOT UPDATED
        expense.setTitle(updated.getTitle());
        expense.setAmount(updated.getAmount());
        expense.setCategory(updated.getCategory());
        expense.setDate(updated.getDate());

        return expenseRepository.save(expense);
    }
}
