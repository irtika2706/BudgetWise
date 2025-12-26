package com.budgetwise.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class SavingsGoalResponse {

    private Long id;
    private String name;
    private double targetAmount;
    private double totalSaved;
    private double remaining;
    private double percentage;

    private List<Entry> entries;

    @Data
    @Builder
    public static class Entry {
        private Long id;
        private double amount;
        private String date;
        private String note;
    }
}