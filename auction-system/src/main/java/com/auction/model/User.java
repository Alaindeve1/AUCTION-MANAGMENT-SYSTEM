package com.auction.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

@Data
@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "users")
@JsonIdentityInfo(
    generator = ObjectIdGenerators.PropertyGenerator.class,
    property = "userId"
)
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @NotBlank
    @Size(max = 50)
    @Column(unique = true, nullable = false)
    private String username;

    @NotBlank
    @Size(max = 100)
    @Email
    @Column(unique = true, nullable = false)
    private String email;

    @NotBlank
    @Size(max = 120)
    @Column(nullable = false)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserStatus userStatus;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.USER;

    @Column(nullable = false)
    private LocalDateTime registrationDate;

    @OneToMany(mappedBy = "seller", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Item> listedItems = new ArrayList<>();

    @OneToMany(mappedBy = "bidder", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Bid> bids = new ArrayList<>();

    @OneToMany(mappedBy = "winner", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AuctionResult> wonAuctions = new ArrayList<>();

    @Column(name = "enabled", nullable = false)
    private boolean enabled = true;

    // 2FA fields
    @Column(name = "two_factor_secret")
    private String twoFactorSecret;
    
    @Column(name = "two_factor_enabled")
    private Boolean twoFactorEnabled = false;

    public User() {}

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    // Alias for compatibility with code expecting getId()
    public Long getId() { return userId; }
    public void setId(Long id) { this.userId = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public UserStatus getUserStatus() { return userStatus; }
    public void setUserStatus(UserStatus userStatus) { this.userStatus = userStatus; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public LocalDateTime getRegistrationDate() { return registrationDate; }
    public void setRegistrationDate(LocalDateTime registrationDate) { this.registrationDate = registrationDate; }

    public List<Item> getListedItems() { return listedItems; }
    public void setListedItems(List<Item> listedItems) { this.listedItems = listedItems; }

    public List<Bid> getBids() { return bids; }
    public void setBids(List<Bid> bids) { this.bids = bids; }

    public List<AuctionResult> getWonAuctions() { return wonAuctions; }
    public void setWonAuctions(List<AuctionResult> wonAuctions) { this.wonAuctions = wonAuctions; }

    public String getTwoFactorSecret() { return twoFactorSecret; }
    public void setTwoFactorSecret(String twoFactorSecret) { this.twoFactorSecret = twoFactorSecret; }

    public Boolean isTwoFactorEnabled() { return twoFactorEnabled; }
    public void setTwoFactorEnabled(Boolean twoFactorEnabled) { this.twoFactorEnabled = twoFactorEnabled; }

    @PrePersist
    protected void onCreate() {
        registrationDate = LocalDateTime.now();
        if (userStatus == null) {
            userStatus = UserStatus.ACTIVE;
        }
        if (role == null) {
            role = Role.USER;
        }
        if (twoFactorEnabled == null) {
            twoFactorEnabled = false;
        }
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role));
    }

    @Override
    public String getPassword() {
        return passwordHash;
    }

    @Override
    public boolean isAccountNonExpired() {
        return enabled && userStatus == UserStatus.ACTIVE;
    }

    @Override
    public boolean isAccountNonLocked() {
        return userStatus != UserStatus.SUSPENDED;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return enabled && userStatus == UserStatus.ACTIVE;
    }

    public enum UserStatus {
        PENDING,
        ACTIVE,
        SUSPENDED
    }
}