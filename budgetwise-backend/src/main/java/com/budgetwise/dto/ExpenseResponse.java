package com.budgetwise.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ExpenseResponse {

    private Long id;
    private String title;
    private double amount;
    private String category;
    private String type;     // ✅ NEW
    private LocalDate date;
}
