package com.auction.dto;

import java.time.LocalDateTime;

public class NotificationDto {
    private Long id;
    private String title;
    private String message;
    private String target; // "ALL" or "SIGNED_IN"
    private boolean read;
    private LocalDateTime createdAt;

    public NotificationDto(Long id, String title, String message, String target, boolean read, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.message = message;
        this.target = target;
        this.read = read;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getMessage() { return message; }
    public String getTarget() { return target; }
    public boolean isRead() { return read; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}

