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
        try {
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
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/general")
    public ResponseEntity<List<NotificationDto>> getGeneralNotifications() {
        try {
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
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> createNotification(@RequestBody NotificationDto dto) {
        try {
            notificationService.createNotification(dto);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}