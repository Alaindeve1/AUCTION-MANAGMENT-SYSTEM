package com.auction.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
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

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "users")
@Data
@NoArgsConstructor
@JsonIdentityInfo(
    generator = ObjectIdGenerators.PropertyGenerator.class,
    property = "userId"
)
@ToString(exclude = {"listedItems", "bids", "wonAuctions"})
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @NotBlank(message = "Username is required")
    @Column(unique = true)
    private String username;

    @NotBlank(message = "Password is required")
    @JsonIgnore
    @Column(name = "password_hash")
    private String password;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @Column(unique = true)
    private String email;

    @Enumerated(EnumType.STRING)
    private UserStatus userStatus;

    private LocalDateTime registrationDate;

    @OneToMany(mappedBy = "seller", cascade = CascadeType.ALL)
    private List<Item> listedItems = new ArrayList<>();

    @OneToMany(mappedBy = "bidder", cascade = CascadeType.ALL)
    private List<Bid> bids = new ArrayList<>();

    @OneToMany(mappedBy = "winner", cascade = CascadeType.ALL)
    private List<AuctionResult> wonAuctions = new ArrayList<>();

    public enum UserStatus {
        ACTIVE, INACTIVE, SUSPENDED
    }

    @Override
    @JsonIgnore
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    @JsonIgnore
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    @JsonIgnore
    public boolean isAccountNonLocked() {
        return userStatus != UserStatus.SUSPENDED;
    }

    @Override
    @JsonIgnore
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    @JsonIgnore
    public boolean isEnabled() {
        return userStatus == UserStatus.ACTIVE;
    }

    @PrePersist
    protected void onCreate() {
        registrationDate = LocalDateTime.now();
        if (userStatus == null) {
            userStatus = UserStatus.ACTIVE;
        }
    }
}