package com.budgetwise.dto;

import lombok.Data;

@Data
public class SavingsGoalRequest {
    private String name;
    private double targetAmount;
}