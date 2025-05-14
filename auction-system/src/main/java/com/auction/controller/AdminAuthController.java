package com.auction.controller;

import com.auction.dto.AdminLoginRequest;
import com.auction.model.User;
import com.auction.repository.UserRepository;
import com.auction.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class AdminAuthController {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtService jwtService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AdminLoginRequest request) {
        User admin = userRepository.findByUsername(request.getUsername())
                .orElse(null);

        if (admin == null || !passwordEncoder.matches(request.getPassword(), admin.getPasswordHash())) {
            return ResponseEntity.badRequest().body("Invalid credentials");
        }

        if (admin.getRole() != User.Role.ADMIN) {
            return ResponseEntity.badRequest().body("User is not an admin");
        }

        String token = jwtService.generateToken(admin);
        
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", admin);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().body("Invalid token format");
        }

        String token = authHeader.substring(7);
        String email = jwtService.extractEmail(token);
        
        User admin = userRepository.findByEmail(email)
                .orElse(null);

        if (admin == null || admin.getRole() != User.Role.ADMIN) {
            return ResponseEntity.badRequest().body("Invalid admin token");
        }

        return ResponseEntity.ok().build();
    }
} 