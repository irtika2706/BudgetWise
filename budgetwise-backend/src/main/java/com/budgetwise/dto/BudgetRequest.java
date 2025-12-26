package com.budgetwise.dto;

import lombok.Data;
import java.util.List;

@Data
public class BudgetRequest {
    private String month;               // YYYY-MM
    private Double totalBudget;
    private List<CategoryBudgetDTO> categories;
}