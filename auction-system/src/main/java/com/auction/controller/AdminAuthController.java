package com.auction.controller;

import com.auction.dto.AdminLoginRequest;
import com.auction.dto.TwoFactorVerificationRequest;
import com.auction.model.User;
import com.auction.repository.UserRepository;
import com.auction.service.AdminService;
import com.auction.service.JwtService;
import com.auction.service.TwoFactorAuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/auth")
public class AdminAuthController {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Autowired
    private AdminService adminService;

    @Autowired
    private TwoFactorAuthService twoFactorAuthService;

    public AdminAuthController(
            UserRepository userRepository,
            BCryptPasswordEncoder passwordEncoder,
            JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AdminLoginRequest request) {
        try {
            // First step: Verify username and password
            if (adminService.validateCredentials(request.getUsername(), request.getPassword())) {
                // Generate 2FA secret if not exists
                String secretKey = adminService.getOrCreateTwoFactorSecret(request.getUsername());
                // Generate QR code URL
                String qrCodeUrl = twoFactorAuthService.generateQRCodeUrl(secretKey, request.getUsername());
                
                Map<String, Object> response = new HashMap<>();
                response.put("requiresTwoFactor", true);
                response.put("qrCodeUrl", qrCodeUrl);
                response.put("username", request.getUsername());
                
                return ResponseEntity.ok(response);
            }
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid credentials"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/verify-2fa")
    public ResponseEntity<?> verifyTwoFactor(@RequestBody TwoFactorVerificationRequest request) {
        try {
            String secretKey = adminService.getTwoFactorSecret(request.getUsername());
            if (secretKey == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "2FA not set up for this user"));
            }

            if (twoFactorAuthService.verifyCode(secretKey, request.getCode())) {
                // Generate JWT token and return it
                String token = adminService.generateToken(request.getUsername());
                User user = userRepository.findByUsername(request.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));
                
                Map<String, Object> response = new HashMap<>();
                response.put("token", token);
                response.put("username", user.getUsername());
                response.put("role", user.getRole());
                response.put("email", user.getEmail());
                
                return ResponseEntity.ok(response);
            }
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid verification code"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/validate")
    public ResponseEntity<?> validateAdminToken(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(Map.of("error", "Missing or invalid Authorization header"));
        }
        
        String token = authHeader.substring(7);
        try {
            String username = jwtService.extractUsername(token);
            User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
                
            if (user.getRole() != User.UserRole.ADMIN) {
                return ResponseEntity.status(403).body(Map.of("error", "Not authorized as admin"));
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("username", username);
            response.put("role", user.getRole());
            response.put("email", user.getEmail());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid token"));
        }
    }
} 