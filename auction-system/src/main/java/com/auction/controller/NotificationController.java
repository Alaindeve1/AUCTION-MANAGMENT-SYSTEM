package com.auction.controller;

import com.auction.dto.NotificationDto;
import com.auction.model.Notification;
import com.auction.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    private final NotificationService notificationService;
    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<NotificationDto>> getNotificationsByUser(@PathVariable Long userId) {
        List<NotificationDto> dtos = notificationService.getNotificationsByUser(userId).stream()
            .map(n -> new NotificationDto(
                n.getId(),
                n.getMessage(),
                n.isRead(),
                n.getCreatedAt()
            ))
            .toList();
        return ResponseEntity.ok(dtos);
    }
}
