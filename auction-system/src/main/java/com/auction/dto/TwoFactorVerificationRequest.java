package com.auction.dto;

import lombok.Data;

@Data
public class TwoFactorVerificationRequest {
    private String username;
    private int code;

    public String getUsername() {
        return username;
    }

    public int getCode() {
        return code;
    }
} 