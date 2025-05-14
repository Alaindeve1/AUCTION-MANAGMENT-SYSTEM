package com.auction.validation;

import org.springframework.stereotype.Component;

@Component
public class PasswordValidator {
    private static final int MIN_PASSWORD_LENGTH = 6;

    public boolean isValid(String password) {
        return password != null && password.length() >= MIN_PASSWORD_LENGTH;
    }

    public String getRequirements() {
        return "Password must be at least " + MIN_PASSWORD_LENGTH + " characters long";
    }
} 