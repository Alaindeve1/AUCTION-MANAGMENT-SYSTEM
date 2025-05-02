package com.auction.controller;

import com.auction.model.User;
import com.auction.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable("id") Long userId) {
        return ResponseEntity.ok(userService.getUserById(userId));
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<User> getUserByUsername(@PathVariable String username) {
        return ResponseEntity.ok(userService.getUserByUsername(username));
    }

    @PostMapping
    public ResponseEntity<User> createUser(@Valid @RequestBody User user) {
        return new ResponseEntity<>(userService.createUser(user), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(
            @PathVariable("id") Long userId,
            @Valid @RequestBody User userDetails) {
        return ResponseEntity.ok(userService.updateUser(userId, userDetails));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<User> updateUserStatus(
            @PathVariable("id") Long userId,
            @RequestBody User.UserStatus status) {
        return ResponseEntity.ok(userService.updateUserStatus(userId, status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable("id") Long userId) {
        userService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getUserCount() {
        return ResponseEntity.ok(userService.getUserCount());
    }
}