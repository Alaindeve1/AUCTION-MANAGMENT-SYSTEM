package com.auction.controller;

import com.auction.dto.NotificationDto;
import com.auction.model.Notification;
import com.auction.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.ArrayList;
import java.util.stream.Collectors;

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

    @GetMapping("/general")
    public ResponseEntity<List<NotificationDto>> getGeneralNotifications() {
        List<NotificationDto> dtos = new ArrayList<>();
        
        // Get ALL notifications
        List<Notification> allNotifications = notificationService.getNotificationsByTarget("ALL");
        dtos.addAll(allNotifications.stream()
            .map(n -> new NotificationDto(
                n.getId(),
                n.getTitle(),
                n.getMessage(),
                n.getTarget(),
                n.isRead(),
                n.getCreatedAt()
            ))
            .collect(Collectors.toList()));
            
        // Get SIGNED_IN notifications
        List<Notification> signedInNotifications = notificationService.getNotificationsByTarget("SIGNED_IN");
        dtos.addAll(signedInNotifications.stream()
            .map(n -> new NotificationDto(
                n.getId(),
                n.getTitle(),
                n.getMessage(),
                n.getTarget(),
                n.isRead(),
                n.getCreatedAt()
            ))
            .collect(Collectors.toList()));
            
        return ResponseEntity.ok(dtos);
    }

    @PostMapping
    public ResponseEntity<?> createNotification(@RequestBody NotificationDto dto) {
        notificationService.createNotification(dto);
        return ResponseEntity.ok().build();
    }
}