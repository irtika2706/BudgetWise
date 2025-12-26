package com.budgetwise.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(
    uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "month"})
)
public class Budget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String month; // YYYY-MM

    private Double totalBudget;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(
        mappedBy = "budget",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    private List<CategoryBudget> categoryBudgets = new ArrayList<>();

}