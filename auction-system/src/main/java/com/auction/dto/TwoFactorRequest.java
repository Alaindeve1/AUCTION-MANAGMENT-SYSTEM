package com.auction.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TwoFactorRequest {
    @NotBlank(message = "2FA code is required")
    private String code;

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }
} 