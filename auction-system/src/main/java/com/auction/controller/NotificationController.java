package com.auction.controller;

import com.auction.dto.NotificationDto;
import com.auction.model.Notification;
import com.auction.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}, methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.PATCH})
public class NotificationController {
    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping("/search")
    public ResponseEntity<List<NotificationDto>> searchNotifications(@RequestParam String query) {
        List<Notification> notifications = notificationService.searchNotifications(query);
        List<NotificationDto> dtos = notifications.stream()
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
        try {
            List<NotificationDto> allNotifications = new ArrayList<>();
            
            // Get ALL notifications
            List<Notification> allTargetNotifications = notificationService.getNotificationsByTarget("ALL");
            if (allTargetNotifications != null) {
                allNotifications.addAll(allTargetNotifications.stream()
                    .map(n -> new NotificationDto(
                        n.getId(),
                        n.getTitle(),
                        n.getMessage(),
                        n.getTarget(),
                        n.isRead(),
                        n.getCreatedAt()
                    ))
                    .collect(java.util.stream.Collectors.toList()));
            }
            
            // Get SIGNED_IN notifications
            List<Notification> signedInNotifications = notificationService.getNotificationsByTarget("SIGNED_IN");
            if (signedInNotifications != null) {
                allNotifications.addAll(signedInNotifications.stream()
                    .map(n -> new NotificationDto(
                        n.getId(),
                        n.getTitle(),
                        n.getMessage(),
                        n.getTarget(),
                        n.isRead(),
                        n.getCreatedAt()
                    ))
                    .collect(java.util.stream.Collectors.toList()));
            }
            
            return ResponseEntity.ok(allNotifications);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(new ArrayList<>());
        }
    }

    // Only admins can create notifications
    @PostMapping
    public ResponseEntity<?> createNotification(@RequestBody NotificationDto dto) {
        notificationService.createNotification(dto);
        return ResponseEntity.ok().build();
    }

    // Mark notification as read
    @PatchMapping("/{id}/read")
    public ResponseEntity<?> markNotificationAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok().build();
    }
}
