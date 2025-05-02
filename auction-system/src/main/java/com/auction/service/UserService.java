package com.auction.service;

import com.auction.exception.ResourceNotFoundException;
import com.auction.model.User;
import com.auction.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
    }

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
    }

    @Transactional
    public User createUser(User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }
        
        // Hash the password before saving
        user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));
        user.setRegistrationDate(LocalDateTime.now());
        user.setUserStatus(User.UserStatus.ACTIVE);
        
        return userRepository.save(user);
    }

    @Transactional
    public User updateUser(Long userId, User userDetails) {
        User user = getUserById(userId);
        
        user.setUsername(userDetails.getUsername());
        user.setEmail(userDetails.getEmail());
        
        // Only update password if provided
        if (userDetails.getPasswordHash() != null && !userDetails.getPasswordHash().isEmpty()) {
            user.setPasswordHash(passwordEncoder.encode(userDetails.getPasswordHash()));
        }
        
        if (userDetails.getUserStatus() != null) {
            user.setUserStatus(userDetails.getUserStatus());
        }
        
        return userRepository.save(user);
    }

    @Transactional
    public void deleteUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }
        userRepository.deleteById(userId);
    }

    @Transactional
    public User updateUserStatus(Long userId, User.UserStatus status) {
        User user = getUserById(userId);
        user.setUserStatus(status);
        return userRepository.save(user);
    }
}