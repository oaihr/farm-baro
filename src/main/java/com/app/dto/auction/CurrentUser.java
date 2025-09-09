package com.app.dto.auction;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CurrentUser {
    private String id;
    private Long totalBalance;
    private Long bidDeposit;
}