package com.auction.controller;

import com.auction.model.User;
import com.auction.repository.UserRepository;
import com.auction.service.EmailService;
import com.auction.service.JwtService;
import com.auction.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import io.jsonwebtoken.Claims;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtService jwtService;
    
    @Autowired
    private EmailService emailService;
    
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        try {
            // Check if username already exists
            if (userRepository.findByUsername(request.get("username")).isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Username already exists"));
            }

            // Check if email already exists
            if (userRepository.findByEmail(request.get("email")).isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Email already registered"));
            }

            // Create new user
            User user = new User();
            user.setUsername(request.get("username"));
            user.setEmail(request.get("email"));
            user.setPasswordHash(passwordEncoder.encode(request.get("password")));
            user.setRole(User.UserRole.USER); // Using the enum
            user.setUserStatus(User.UserStatus.ACTIVE); // Set initial status

            userRepository.save(user);

            return ResponseEntity.ok().body(Map.of("message", "User registered successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        try {
            User user = userRepository.findByUsername(request.get("username"))
                    .orElseThrow(() -> new RuntimeException("Invalid credentials"));
            
            if (!passwordEncoder.matches(request.get("password"), user.getPasswordHash())) {
                return ResponseEntity.status(401).body(Map.of("message", "Invalid credentials"));
            }

            String jwt = jwtService.generateToken(user);
            Map<String, Object> response = new HashMap<>();
            response.put("token", jwt);
            response.put("username", user.getUsername());
            response.put("role", user.getRole());
            response.put("email", user.getEmail());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

            // Generate a password reset token
            String resetToken = jwtService.generateToken(user);
            
            // Send email with reset link
            String resetLink = "http://localhost:3000/reset-password?token=" + resetToken;
            emailService.sendPasswordResetEmail(user.getEmail(), resetLink);
            
            return ResponseEntity.ok().body(Map.of("message", "Password reset instructions sent to your email"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        try {
            String token = request.get("token");
            String newPassword = request.get("newPassword");
            
            // Validate token and extract user info
            String username = jwtService.extractUsername(token);
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            if (!jwtService.validateToken(token, user)) {
                return ResponseEntity.badRequest().body(Map.of("message", "Invalid or expired reset token"));
            }
            
            // Update password
            user.setPasswordHash(passwordEncoder.encode(newPassword));
            userRepository.save(user);
            
            return ResponseEntity.ok().body(Map.of("message", "Password reset successful"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid or expired reset token"));
        }
    }

    @GetMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body(Map.of("message", "Missing or invalid Authorization header"));
            }

            String token = authHeader.substring(7);
            String username = jwtService.extractUsername(token);
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (!jwtService.validateToken(token, user)) {
                return ResponseEntity.status(401).body(Map.of("message", "Invalid token"));
            }

            Map<String, Object> response = new HashMap<>();
            response.put("username", username);
            response.put("role", user.getRole());
            response.put("email", user.getEmail());
            response.put("valid", true);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid token: " + e.getMessage()));
        }
    }
} 