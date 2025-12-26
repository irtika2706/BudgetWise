package com.budgetwise.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class BudgetResponse {

    private String month;

    private Overall overall;

    private List<Category> categories;

    @Data
    @Builder
    public static class Overall {
        private Double budget;
        private Double spent;
        private Double remaining;
        private Double percentage;
    }

    @Data
    @Builder
    public static class Category {
        private String category;
        private Double budget;
        private Double spent;
        private Double percentage;
    }
}