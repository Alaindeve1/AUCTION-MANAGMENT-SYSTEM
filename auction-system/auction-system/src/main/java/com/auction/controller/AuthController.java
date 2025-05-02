package com.auction.controller;

import com.auction.model.User;
import com.auction.service.JwtService;
import com.auction.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final UserService userService;
    private final BCryptPasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthController(
            UserService userService,
            BCryptPasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtService jwtService
    ) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        try {
            if (credentials == null || !credentials.containsKey("username") || !credentials.containsKey("password")) {
                return ResponseEntity.badRequest().body("Username and password are required");
            }

            String username = credentials.get("username");
            String password = credentials.get("password");

            if (username == null || username.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Username cannot be empty");
            }

            if (password == null || password.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Password cannot be empty");
            }

            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
            );

            User user = (User) authentication.getPrincipal();
            String token = jwtService.generateToken(user);
            
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", user);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace(); // Add this for debugging
            return ResponseEntity.badRequest().body("Invalid username or password: " + e.getMessage());
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> registrationData) {
        try {
            User user = new User();
            user.setUsername(registrationData.get("username"));
            user.setPassword(passwordEncoder.encode(registrationData.get("password")));
            user.setEmail(registrationData.get("email"));
            user.setUserStatus(User.UserStatus.ACTIVE);
            
            User createdUser = userService.createUser(user);
            return ResponseEntity.ok(createdUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body("Invalid or missing token");
        }
        
        String token = authHeader.substring(7);
        try {
            String username = jwtService.extractUsername(token);
            UserDetails userDetails = userService.getUserByUsername(username);
            
            if (jwtService.validateToken(token, userDetails)) {
                return ResponseEntity.ok().build();
            }
        } catch (Exception e) {
            // Token validation failed
        }
        
        return ResponseEntity.status(401).body("Invalid token");
    }
} 