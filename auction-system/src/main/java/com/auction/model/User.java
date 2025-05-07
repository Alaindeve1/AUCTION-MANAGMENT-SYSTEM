package com.auction.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.ToString;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "users")
@JsonIdentityInfo(
    generator = ObjectIdGenerators.PropertyGenerator.class,
    property = "userId"
)
@ToString(exclude = {"listedItems", "bids", "wonAuctions"})
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @NotBlank
    @Column(unique = true)
    private String username;

    @NotBlank
    @Email
    @Column(unique = true)
    private String email;

    @NotBlank
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    private UserStatus userStatus;

    @Enumerated(EnumType.STRING)
    private UserRole role;

    private LocalDateTime registrationDate;

    @OneToMany(mappedBy = "seller", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Item> listedItems = new ArrayList<>();

    @OneToMany(mappedBy = "bidder", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Bid> bids = new ArrayList<>();

    @OneToMany(mappedBy = "winner", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AuctionResult> wonAuctions = new ArrayList<>();

    public User() {}

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public UserStatus getUserStatus() { return userStatus; }
    public void setUserStatus(UserStatus userStatus) { this.userStatus = userStatus; }

    public UserRole getRole() { return role; }
    public void setRole(UserRole role) { this.role = role; }

    public LocalDateTime getRegistrationDate() { return registrationDate; }
    public void setRegistrationDate(LocalDateTime registrationDate) { this.registrationDate = registrationDate; }

    public List<Item> getListedItems() { return listedItems; }
    public void setListedItems(List<Item> listedItems) { this.listedItems = listedItems; }

    public List<Bid> getBids() { return bids; }
    public void setBids(List<Bid> bids) { this.bids = bids; }

    public List<AuctionResult> getWonAuctions() { return wonAuctions; }
    public void setWonAuctions(List<AuctionResult> wonAuctions) { this.wonAuctions = wonAuctions; }

    @PrePersist
    protected void onCreate() {
        registrationDate = LocalDateTime.now();
        if (userStatus == null) {
            userStatus = UserStatus.ACTIVE;
        }
        if (role == null) {
            role = UserRole.USER;
        }
    }

    public enum UserStatus {
        ACTIVE, INACTIVE, SUSPENDED
    }

    public enum UserRole {
        ADMIN, USER
    }
}