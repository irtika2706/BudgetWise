package com.budgetwise.service;

import com.budgetwise.dto.*;
import com.budgetwise.model.*;
import com.budgetwise.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SavingsGoalService {

    private final SavingsGoalRepository goalRepository;
    private final SavingsEntryRepository entryRepository;
    private final UserRepository userRepository;

    public void createGoal(String email, SavingsGoalRequest request) {
        User user = userRepository.findByEmail(email).orElseThrow();

        SavingsGoal goal = new SavingsGoal();
        goal.setName(request.getName());
        goal.setTargetAmount(request.getTargetAmount());
        goal.setUser(user);

        goalRepository.save(goal);
    }

    public void updateGoal(String email, Long goalId, SavingsGoalRequest request) {
        SavingsGoal goal =
                goalRepository.findByIdAndUserEmail(goalId, email).orElseThrow();

        goal.setName(request.getName());
        goal.setTargetAmount(request.getTargetAmount());

        goalRepository.save(goal);
    }

    public void deleteGoal(String email, Long goalId) {
        SavingsGoal goal =
                goalRepository.findByIdAndUserEmail(goalId, email).orElseThrow();

        goalRepository.delete(goal);
    }

    public void addEntry(String email, Long goalId, SavingsEntryRequest request) {
        SavingsGoal goal =
                goalRepository.findByIdAndUserEmail(goalId, email).orElseThrow();

        SavingsEntry entry = new SavingsEntry();
        entry.setAmount(request.getAmount());
        entry.setDate(request.getDate());
        entry.setNote(request.getNote());
        entry.setGoal(goal);

        entryRepository.save(entry);
    }

    public void deleteEntry(String email, Long entryId) {
        SavingsEntry entry = entryRepository.findById(entryId).orElseThrow();

        if (!entry.getGoal().getUser().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized");
        }

        entryRepository.delete(entry);
    }

    public List<SavingsGoalResponse> getGoals(String email) {

        return goalRepository.findByUserEmail(email).stream().map(goal -> {

            double totalSaved =
                    goal.getEntries().stream().mapToDouble(SavingsEntry::getAmount).sum();

            return SavingsGoalResponse.builder()
                    .id(goal.getId())
                    .name(goal.getName())
                    .targetAmount(goal.getTargetAmount())
                    .totalSaved(totalSaved)
                    .remaining(goal.getTargetAmount() - totalSaved)
                    .percentage(
                            goal.getTargetAmount() == 0
                                    ? 0
                                    : (totalSaved / goal.getTargetAmount()) * 100
                    )
                    .entries(
                            goal.getEntries().stream().map(e ->
                                    SavingsGoalResponse.Entry.builder()
                                            .id(e.getId())
                                            .amount(e.getAmount())
                                            .date(e.getDate().toString())
                                            .note(e.getNote())
                                            .build()
                            ).toList()
                    )
                    .build();

        }).toList();
    }
}