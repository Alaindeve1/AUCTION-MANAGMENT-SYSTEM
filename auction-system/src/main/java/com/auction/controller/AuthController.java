package com.auction.controller;

import com.auction.dto.*;
import com.auction.model.User;
import com.auction.service.EmailService;
import com.auction.service.JwtService;
import com.auction.service.SessionService;
import com.auction.service.UserService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;
    private final EmailService emailService;
    private final SessionService sessionService;

    public AuthController(UserService userService, JwtService jwtService, EmailService emailService, SessionService sessionService) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.emailService = emailService;
        this.sessionService = sessionService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request, HttpSession session) {
        User user = userService.authenticate(request.getUsername(), request.getPassword());
        String token = jwtService.generateToken(user);
        
        // Store user info in session
        sessionService.setAttribute(session, "userId", user.getId());
        sessionService.setAttribute(session, "userRole", user.getRole());
        sessionService.setAttribute(session, "userEmail", user.getEmail());
        
        return ResponseEntity.ok(new AuthResponse(token, user));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request, HttpSession session) {
        User user = userService.createUser(request);
        String token = jwtService.generateToken(user);
        
        // Store user info in session
        sessionService.setAttribute(session, "userId", user.getId());
        sessionService.setAttribute(session, "userRole", user.getRole());
        sessionService.setAttribute(session, "userEmail", user.getEmail());
        
        return ResponseEntity.ok(new AuthResponse(token, user));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpSession session) {
        sessionService.invalidateSession(session);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(HttpSession session) {
        Long userId = (Long) sessionService.getAttribute(session, "userId");
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        User user = userService.findById(userId);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body("Invalid or missing token");
        }
        
        String token = authHeader.substring(7);
        try {
            String username = jwtService.extractUsername(token);
            User user = userService.getUserByUsername(username);
            
            if (user != null && jwtService.isTokenValid(token)) {
                return ResponseEntity.ok().build();
            }
        } catch (Exception e) {
            // Token validation failed
            System.err.println("Token validation error: " + e.getMessage());
        }
        
        return ResponseEntity.status(401).body("Invalid token");
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Void> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        if (!userService.existsByEmail(request.getEmail())) {
            return ResponseEntity.ok().build(); // Don't reveal if email exists
        }
        String token = jwtService.generatePasswordResetToken(request.getEmail());
        try {
            emailService.sendPasswordResetEmail(request.getEmail(), token);
        } catch (jakarta.mail.MessagingException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Void> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        if (!jwtService.isTokenValid(request.getToken())) {
            return ResponseEntity.badRequest().build();
        }
        
        userService.resetPassword(request.getEmail(), request.getNewPassword());
        return ResponseEntity.ok().build();
    }
} 