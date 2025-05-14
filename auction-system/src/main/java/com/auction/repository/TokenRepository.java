package com.auction.repository;

import com.auction.model.Token;
import com.auction.model.TokenType;
import com.auction.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface TokenRepository extends JpaRepository<Token, Long> {
    Optional<Token> findByToken(String token);
    Optional<Token> findByTokenAndTokenType(String token, TokenType type);
    void deleteByEmail(String email);
    Optional<Token> findByUserAndTokenType(User user, TokenType type);
    void deleteByUserAndTokenType(User user, TokenType type);
} 