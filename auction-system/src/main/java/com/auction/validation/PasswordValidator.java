package com.auction.validation;

import org.springframework.stereotype.Component;

@Component
public class PasswordValidator {
    private static final int MIN_LENGTH = 8;
    private static final String REQUIREMENTS = "Password must be at least " + MIN_LENGTH + " characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.";

    public boolean isValid(String password) {
        if (password == null || password.length() < MIN_LENGTH) {
            return false;
        }

        boolean hasUpper = false;
        boolean hasLower = false;
        boolean hasNumber = false;
        boolean hasSpecial = false;

        for (char c : password.toCharArray()) {
            if (Character.isUpperCase(c)) hasUpper = true;
            else if (Character.isLowerCase(c)) hasLower = true;
            else if (Character.isDigit(c)) hasNumber = true;
            else hasSpecial = true;
        }

        return hasUpper && hasLower && hasNumber && hasSpecial;
    }

    public String getRequirements() {
        return REQUIREMENTS;
    }
} 