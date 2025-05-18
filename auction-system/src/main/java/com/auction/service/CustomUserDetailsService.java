package com.auction.service;

import com.auction.model.User;
import com.auction.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    private static final Logger logger = LoggerFactory.getLogger(CustomUserDetailsService.class);

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        try {
            logger.debug("Loading user by username: {}", username);
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
            
            logger.debug("User found: {}", user.getUsername());
            return user;
        } catch (UsernameNotFoundException e) {
            logger.error("User not found: {}", username);
            throw e;
        } catch (Exception e) {
            logger.error("Error loading user: {} - Error: {}", username, e.getMessage(), e);
            throw new UsernameNotFoundException("Error loading user: " + username, e);
        }
    }
} 