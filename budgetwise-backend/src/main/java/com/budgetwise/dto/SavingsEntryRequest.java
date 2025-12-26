package com.budgetwise.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class SavingsEntryRequest {
    private double amount;
    private LocalDate date;
    private String note;
}