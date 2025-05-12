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
                n.getTitle(),
                n.getMessage(),
                n.getTarget(),
                n.isRead(),
                n.getCreatedAt()
            ))
            .toList();
        return ResponseEntity.ok(dtos);
    }

    // Endpoint to get general notifications (ALL and SIGNED_IN)
    @GetMapping("/general")
    public ResponseEntity<List<NotificationDto>> getGeneralNotifications() {
        List<NotificationDto> dtos = notificationService.getNotificationsByTarget("ALL").stream()
            .map(n -> new NotificationDto(
                n.getId(),
                n.getTitle(),
                n.getMessage(),
                n.getTarget(),
                n.isRead(),
                n.getCreatedAt()
            ))
            .toList();
        dtos.addAll(notificationService.getNotificationsByTarget("SIGNED_IN").stream()
            .map(n -> new NotificationDto(
                n.getId(),
                n.getTitle(),
                n.getMessage(),
                n.getTarget(),
                n.isRead(),
                n.getCreatedAt()
            ))
            .toList());
        return ResponseEntity.ok(dtos);
    }

    // Only admins can create notifications
    @PostMapping
    public ResponseEntity<?> createNotification(@RequestBody NotificationDto dto) {
        notificationService.createNotification(dto);
        return ResponseEntity.ok().build();
    }
}
