package com.budgetwise.controller;

import com.budgetwise.dto.ExpenseResponse;
import com.budgetwise.model.Expense;
import com.budgetwise.security.JwtUtil;
import com.budgetwise.service.ExpenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;
    private final JwtUtil jwtUtil;

    // ✅ ADD expense (JWT protected by Spring Security)
    @PostMapping
    public Expense addExpense(
            @RequestBody Expense expense,
            @RequestHeader("Authorization") String authHeader
    ) {
        String email = extractEmail(authHeader);
        return expenseService.addExpense(expense, email);
    }

    // ✅ GET expenses (Soft JWT – manual validation)
    @GetMapping
    public List<ExpenseResponse> getExpenses(
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token required");
        }

        String email = extractEmail(authHeader);
        return expenseService.getExpenses(email);
    }

    // ✅ UPDATE expense (JWT protected)
    @PutMapping("/{id}")
    public Expense updateExpense(
            @PathVariable Long id,
            @RequestBody Expense expense,
            @RequestHeader("Authorization") String authHeader
    ) {
        String email = extractEmail(authHeader);
        return expenseService.updateExpense(id, expense, email);
    }

    // ✅ DELETE expense (JWT protected)
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteExpense(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader
    ) {
        String email = extractEmail(authHeader);
        expenseService.deleteExpense(id, email);
    }

    // 🔑 Helper
    private String extractEmail(String authHeader) {
        if (!authHeader.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid token");
        }

        String token = authHeader.substring(7);
        return jwtUtil.extractUsername(token);
    }
}
