package com.auction.controller;

import com.auction.dto.AdminLoginRequest;
import com.auction.model.User;
import com.auction.repository.UserRepository;
import com.auction.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminAuthController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public Map<String, Object> adminLogin(@RequestBody AdminLoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));
        if (user.getRole() != User.UserRole.ADMIN) {
            throw new RuntimeException("Not authorized");
        }
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }
        String jwt = JwtUtil.generateToken(user.getUsername(), user.getRole().name());
        Map<String, Object> response = new HashMap<>();
        response.put("token", jwt);
        response.put("username", user.getUsername());
        response.put("role", user.getRole());
        return response;
    }

    @GetMapping("/validate")
    public Map<String, Object> validateAdminToken(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Missing or invalid Authorization header");
        }
        String token = authHeader.replace("Bearer ", "");
        try {
            var claims = com.auction.util.JwtUtil.validateToken(token);
            String username = claims.getSubject();
            String role = (String) claims.get("role");
            if (!"ADMIN".equals(role)) {
                throw new RuntimeException("Not authorized");
            }
            // Optionally fetch more info from DB
            User user = userRepository.findByUsername(username)
                .orElse(null);
            Map<String, Object> response = new HashMap<>();
            response.put("username", username);
            response.put("role", role);
            if (user != null) {
                response.put("email", user.getEmail());
            }
            return response;
        } catch (Exception e) {
            throw new RuntimeException("Invalid token");
        }
    }
} 