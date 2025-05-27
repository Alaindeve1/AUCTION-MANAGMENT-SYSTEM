package com.auction.service;

import com.auction.model.User;
import com.auction.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private TwoFactorAuthService twoFactorAuthService;

    public boolean validateCredentials(String username, String password) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            return user.getRole() == User.UserRole.ADMIN && 
                   passwordEncoder.matches(password, user.getPasswordHash());
        }
        return false;
    }

    @Transactional
    public String getOrCreateTwoFactorSecret(String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
            
        if (user.getTwoFactorSecret() == null) {
            String secretKey = twoFactorAuthService.generateSecretKey();
            user.setTwoFactorSecret(secretKey);
            userRepository.save(user);
            return secretKey;
        }
        
        return user.getTwoFactorSecret();
    }

    public String getTwoFactorSecret(String username) {
        return userRepository.findByUsername(username)
            .map(User::getTwoFactorSecret)
            .orElse(null);
    }

    public String generateToken(String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        return jwtService.generateToken(user);
    }
} 