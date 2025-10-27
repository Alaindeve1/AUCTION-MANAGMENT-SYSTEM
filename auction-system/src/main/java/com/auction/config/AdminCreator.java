package com.auction.config;

import com.auction.model.User;
import com.auction.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminCreator implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Value("${create.admin:false}")
    private boolean createAdmin;
    
    @Value("${admin.username:}")
    private String username;
    
    @Value("${admin.password:}")
    private String password;
    
    @Value("${admin.email:}")
    private String email;
    
    @Override
    public void run(String... args) {
        if (createAdmin && !userRepository.existsByUsername(username)) {
            User admin = new User();
            admin.setUsername(username);
            admin.setEmail(email);
            admin.setPasswordHash(passwordEncoder.encode(password));
            admin.setRole("ADMIN");
            admin.setEnabled(true);
            admin.setCreatedAt(java.time.LocalDateTime.now());
            admin.setUpdatedAt(java.time.LocalDateTime.now());
            
            userRepository.save(admin);
            System.out.println("Admin user created successfully: " + username);
        } else if (createAdmin) {
            System.out.println("Admin user already exists");
        }
    }
}
