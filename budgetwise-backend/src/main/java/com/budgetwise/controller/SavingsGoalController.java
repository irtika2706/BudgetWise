package com.budgetwise.controller;

import com.budgetwise.dto.*;
import com.budgetwise.security.SecurityUtil;
import com.budgetwise.service.SavingsGoalService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/savings-goals")
@RequiredArgsConstructor
public class SavingsGoalController {

    private final SavingsGoalService service;

    @PostMapping
    public void create(@RequestBody SavingsGoalRequest request) {
        service.createGoal(SecurityUtil.getCurrentUserEmail(), request);
    }

    @PutMapping("/{id}")
    public void update(
            @PathVariable Long id,
            @RequestBody SavingsGoalRequest request
    ) {
        service.updateGoal(SecurityUtil.getCurrentUserEmail(), id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.deleteGoal(SecurityUtil.getCurrentUserEmail(), id);
    }

    @PostMapping("/{id}/entries")
    public void addEntry(
            @PathVariable Long id,
            @RequestBody SavingsEntryRequest request
    ) {
        service.addEntry(SecurityUtil.getCurrentUserEmail(), id, request);
    }

    @DeleteMapping("/entries/{entryId}")
    public void deleteEntry(@PathVariable Long entryId) {
        service.deleteEntry(SecurityUtil.getCurrentUserEmail(), entryId);
    }

    @GetMapping
    public List<SavingsGoalResponse> list() {
        return service.getGoals(SecurityUtil.getCurrentUserEmail());
    }
}
