package com.auction.controller;

import com.auction.model.User;
import com.auction.repository.UserRepository;
import com.auction.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> request) {
        User user = userRepository.findByUsername(request.get("username"))
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));
        if (!passwordEncoder.matches(request.get("password"), user.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }
        String jwt = JwtUtil.generateToken(user.getUserId(), user.getUsername(), user.getEmail(), user.getRole().name());
        Map<String, Object> response = new HashMap<>();
        response.put("token", jwt);
        response.put("username", user.getUsername());
        response.put("role", user.getRole());
        return response;
    }

    @GetMapping("/validate")
    public Map<String, Object> validateToken(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Missing or invalid Authorization header");
        }
        String token = authHeader.substring(7);
        try {
            var claims = JwtUtil.validateToken(token);
            Map<String, Object> response = new HashMap<>();
            response.put("username", claims.getSubject());
            response.put("role", claims.get("role"));
            response.put("valid", true);
            return response;
        } catch (Exception e) {
            throw new RuntimeException("Invalid token: " + e.getMessage());
        }
    }
} 