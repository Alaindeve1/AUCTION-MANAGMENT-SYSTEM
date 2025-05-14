package com.auction.service;

import com.auction.dto.AdminRegisterRequest;
import com.auction.dto.RegisterRequest;
import com.auction.exception.ResourceNotFoundException;
import com.auction.model.User;
import com.auction.model.UserRole;
import com.auction.repository.UserRepository;
import com.auction.validation.PasswordValidator;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final PasswordValidator passwordValidator;
    private final PasswordEncoder springPasswordEncoder;

    public UserService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder, PasswordValidator passwordValidator, PasswordEncoder springPasswordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.passwordValidator = passwordValidator;
        this.springPasswordEncoder = springPasswordEncoder;
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

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Transactional
    public User createPendingAdmin(AdminRegisterRequest request) {
        if (!passwordValidator.isValid(request.getPassword())) {
            throw new IllegalArgumentException(passwordValidator.getRequirements());
        }

        User admin = new User();
        admin.setEmail(request.getEmail());
        admin.setUsername(generateUsername(request.getEmail()));
        admin.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        admin.setRole(User.Role.ADMIN);
        admin.setUserStatus(User.UserStatus.PENDING);
        admin.setRegistrationDate(LocalDateTime.now());
        
        return userRepository.save(admin);
    }

    @Transactional
    public User approveAdmin(String email) {
        User admin = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("Admin not found with email: " + email));
            
        if (admin.getRole() != User.Role.ADMIN) {
            throw new IllegalArgumentException("User is not an admin");
        }
        
        admin.setUserStatus(User.UserStatus.ACTIVE);
        return userRepository.save(admin);
    }

    @Transactional
    public void resetPassword(String email, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    private String generateUsername(String email) {
        String baseUsername = email.split("@")[0];
        String username = baseUsername;
        int counter = 1;
        
        while (userRepository.existsByUsername(username)) {
            username = baseUsername + counter++;
        }
        
        return username;
    }

    @Transactional
    public User createUser(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setUsername(request.getUsername());
        user.setRole(User.Role.USER);
        
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

    @Transactional
    public User authenticate(String username, String password) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Invalid username or password"));
        
        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new RuntimeException("Invalid username or password");
        }
        
        if (user.getUserStatus() != User.UserStatus.ACTIVE) {
            throw new RuntimeException("Account is not active");
        }
        
        return user;
    }

    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}