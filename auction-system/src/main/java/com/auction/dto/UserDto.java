package com.auction.dto;

import java.time.LocalDateTime;
import com.auction.model.User;

public class UserDto {
    private Long userId;
    private String username;
    private String email;
    private String userStatus;
    private LocalDateTime registrationDate;
    
    // Default constructor
    public UserDto() {
    }
    
    // Constructor with fields
    public UserDto(Long userId, String username, String email, 
                  String userStatus, LocalDateTime registrationDate) {
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.userStatus = userStatus;
        this.registrationDate = registrationDate;
    }
    
    // Static method to convert User entity to UserDto
    public static UserDto fromEntity(User user) {
        return new UserDto(
            user.getUserId(),
            user.getUsername(),
            user.getEmail(),
            user.getUserStatus().toString(),
            user.getRegistrationDate()
        );
    }
    
    // Getters and Setters
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getUserStatus() {
        return userStatus;
    }
    
    public void setUserStatus(String userStatus) {
        this.userStatus = userStatus;
    }
    
    public LocalDateTime getRegistrationDate() {
        return registrationDate;
    }
    
    public void setRegistrationDate(LocalDateTime registrationDate) {
        this.registrationDate = registrationDate;
    }
    
    @Override
    public String toString() {
        return "UserDto{" +
               "userId=" + userId +
               ", username='" + username + '\'' +
               ", email='" + email + '\'' +
               ", userStatus='" + userStatus + '\'' +
               ", registrationDate=" + registrationDate +
               '}';
    }
}