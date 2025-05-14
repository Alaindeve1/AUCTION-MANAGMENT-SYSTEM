package com.auction.service;

import com.auction.model.Token;
import com.auction.model.TokenType;
import com.auction.repository.TokenRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class TokenService {
    private final TokenRepository tokenRepository;

    public TokenService(TokenRepository tokenRepository) {
        this.tokenRepository = tokenRepository;
    }

    @Transactional
    public String generateAdminApprovalToken(String email) {
        // Delete any existing tokens for this email
        tokenRepository.deleteByEmail(email);
        
        Token token = new Token();
        token.setToken(UUID.randomUUID().toString());
        token.setEmail(email);
        token.setTokenType(TokenType.ADMIN_APPROVAL);
        token.setExpiryDate(LocalDateTime.now().plusHours(24)); // 24 hours expiry
        token.setUsed(false);
        
        tokenRepository.save(token);
        return token.getToken();
    }

    @Transactional
    public String generatePasswordResetToken(String email) {
        // Delete any existing tokens for this email
        tokenRepository.deleteByEmail(email);
        
        Token token = new Token();
        token.setToken(UUID.randomUUID().toString());
        token.setEmail(email);
        token.setTokenType(TokenType.PASSWORD_RESET);
        token.setExpiryDate(LocalDateTime.now().plusHours(1)); // 1 hour expiry
        token.setUsed(false);
        
        tokenRepository.save(token);
        return token.getToken();
    }

    public boolean validateToken(String tokenString, TokenType type) {
        return tokenRepository.findByTokenAndTokenType(tokenString, type)
                .map(token -> !token.isUsed() && !token.isExpired())
                .orElse(false);
    }

    public Token getToken(String tokenString) {
        return tokenRepository.findByToken(tokenString)
                .orElseThrow(() -> new IllegalArgumentException("Invalid token"));
    }

    @Transactional
    public void markTokenAsUsed(String tokenString) {
        Token token = getToken(tokenString);
        token.setUsed(true);
        tokenRepository.save(token);
    }
} 