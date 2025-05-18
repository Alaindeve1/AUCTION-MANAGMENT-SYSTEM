package com.auction.test;

import com.warrenstrange.googleauth.GoogleAuthenticator;
import com.warrenstrange.googleauth.GoogleAuthenticatorKey;

public class GoogleAuthenticatorTest {
    public static void main(String[] args) {
        GoogleAuthenticator googleAuthenticator = new GoogleAuthenticator();
        GoogleAuthenticatorKey key = googleAuthenticator.createCredentials();
        System.out.println("Secret Key: " + key.getKey());
        System.out.println("Period: " + key.getPeriod());
        System.out.println("Code Length: " + key.getCodeLength());
        
        // Generate a code
        int code = googleAuthenticator.getTotpPassword(key.getKey());
        System.out.println("Generated Code: " + code);
        
        // Verify the code
        boolean isValid = googleAuthenticator.authorize(key.getKey(), code);
        System.out.println("Code Valid: " + isValid);
    }
}
