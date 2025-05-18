package com.auction.controller;

import com.auction.dto.*;
import com.auction.model.User;
import com.auction.service.EmailService;
import com.auction.service.JwtService;
import com.auction.service.SessionService;
import com.auction.service.TwoFactorService;
import com.auction.service.UserService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final JwtService jwtService;
    private final EmailService emailService;
    private final SessionService sessionService;
    private final TwoFactorService twoFactorService;
    private final AuthenticationManager authenticationManager;
    private final UserService userService;

    public AuthController(
            JwtService jwtService,
            EmailService emailService,
            SessionService sessionService,
            TwoFactorService twoFactorService,
            AuthenticationManager authenticationManager,
            UserService userService) {
        this.jwtService = jwtService;
        this.emailService = emailService;
        this.sessionService = sessionService;
        this.twoFactorService = twoFactorService;
        this.authenticationManager = authenticationManager;
        this.userService = userService;
    }

    @PostMapping("/login")
public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request, HttpSession session) {
    try {
        logger.info("Login attempt for user: {}", request.getUsername());

        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getUsername(),
                request.getPassword()
            )
        );

        if (authentication.isAuthenticated()) {
            User user = (User) authentication.getPrincipal();
            logger.info("User authenticated successfully: {}", user.getUsername());
            
            // Check if 2FA is required
            if (user.isTwoFactorEnabled()) {
                logger.info("2FA required for user: {}", user.getUsername());
                sessionService.setAttribute(session, "pendingUserId", user.getUserId());
                return ResponseEntity.ok(Map.of("requiresTwoFactor", true));
            }
            
            // Generate JWT token
            String token = jwtService.generateToken(user);
            logger.info("Generated token for user: {}", user.getUsername());
            
            // Store user session attributes
            sessionService.setAttribute(session, "userId", user.getUserId());
            sessionService.setAttribute(session, "userRole", user.getRole());
            sessionService.setAttribute(session, "userEmail", user.getEmail());
            
            return ResponseEntity.ok(new AuthResponse(token, user));
        } else {
            logger.warn("Authentication failed for user: {}", request.getUsername());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Authentication failed");
        }
    } catch (BadCredentialsException e) {
        logger.error("Invalid credentials for user: {}", request.getUsername(), e);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Invalid username or password");
    } catch (AuthenticationException e) {
        logger.error("Authentication exception for user: {} - Error: {}", 
            request.getUsername(), 
            e.getMessage(), 
            e
        );
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Authentication failed: " + e.getMessage());
    } catch (Exception e) {
        logger.error("Unexpected error during login", e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("An unexpected error occurred");
    }
}

    @PostMapping("/verify-2fa")
    public ResponseEntity<?> verifyTwoFactor(
            @Valid @RequestBody TwoFactorRequest request,
            HttpSession session) {
        
        Long pendingUserId = (Long) sessionService.getAttribute(session, "pendingUserId");
        if (pendingUserId == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("No pending 2FA verification");
        }

        User user = userService.findById(pendingUserId);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("User not found");
        }

        if (!twoFactorService.verifyCode(user.getTwoFactorSecret(), request.getCode())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid 2FA code");
        }

        String token = jwtService.generateToken(user);
        
        // Store user info in session
        sessionService.setAttribute(session, "userId", user.getUserId());
        sessionService.setAttribute(session, "userRole", user.getRole());
        sessionService.setAttribute(session, "userEmail", user.getEmail());
        
        return ResponseEntity.ok(new AuthResponse(token, user));
    }

    @PostMapping("/setup-2fa")
    public ResponseEntity<?> setupTwoFactor(
            @RequestHeader("Authorization") String authHeader,
            HttpSession session) {
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body("Invalid or missing token");
        }

        String token = authHeader.substring(7);
        String username = jwtService.extractUsername(token);
        User user = userService.getUserByUsername(username);

        if (user == null) {
            return ResponseEntity.status(401).body("User not found");
        }

        String secret = twoFactorService.generateNewSecret();
        user.setTwoFactorSecret(secret);
        userService.save(user);

        String qrCodeUri = twoFactorService.generateQrCodeImageUri(secret, user.getEmail());
        
        Map<String, Object> response = new HashMap<>();
        response.put("secret", secret);
        response.put("qrCodeUri", qrCodeUri);
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/enable-2fa")
    public ResponseEntity<?> enableTwoFactor(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody TwoFactorRequest request) {
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body("Invalid or missing token");
        }

        String token = authHeader.substring(7);
        String username = jwtService.extractUsername(token);
        User user = userService.getUserByUsername(username);

        if (user == null) {
            return ResponseEntity.status(401).body("User not found");
        }

        if (!twoFactorService.verifyCode(user.getTwoFactorSecret(), request.getCode())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid 2FA code");
        }

        user.setTwoFactorEnabled(true);
        userService.save(user);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/disable-2fa")
    public ResponseEntity<?> disableTwoFactor(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody TwoFactorRequest request) {
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body("Invalid or missing token");
        }

        String token = authHeader.substring(7);
        String username = jwtService.extractUsername(token);
        User user = userService.getUserByUsername(username);

        if (user == null) {
            return ResponseEntity.status(401).body("User not found");
        }

        if (!twoFactorService.verifyCode(user.getTwoFactorSecret(), request.getCode())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid 2FA code");
        }

        user.setTwoFactorEnabled(false);
        user.setTwoFactorSecret(null);
        userService.save(user);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request, HttpSession session) {
        try {
            logger.info("Registering new user: {}", request.getUsername());
            User user = userService.createUser(request);
            String token = jwtService.generateToken(user);
            
            sessionService.setAttribute(session, "userId", user.getUserId());
            sessionService.setAttribute(session, "userRole", user.getRole());
            sessionService.setAttribute(session, "userEmail", user.getEmail());
            
            return ResponseEntity.ok(new AuthResponse(token, user));
        } catch (Exception e) {
            logger.error("Registration failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
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