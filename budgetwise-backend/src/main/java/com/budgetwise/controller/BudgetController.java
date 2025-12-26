package com.budgetwise.controller;

import com.budgetwise.dto.*;
import com.budgetwise.service.BudgetService;
import lombok.RequiredArgsConstructor;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/budget")
@RequiredArgsConstructor
public class BudgetController {

    private final BudgetService budgetService;

    private String getEmail() {
        return SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();
    }

    @PostMapping
    public void saveBudget(@RequestBody BudgetRequest request) {
        budgetService.saveBudget(getEmail(), request);
    }

    @GetMapping
    public BudgetResponse getBudget(@RequestParam String month) {
        return budgetService.getBudgetSummary(getEmail(), month);
    }

    @DeleteMapping
    public void deleteBudget(@RequestParam String month) {
        budgetService.deleteBudget(getEmail(), month);
    }
}