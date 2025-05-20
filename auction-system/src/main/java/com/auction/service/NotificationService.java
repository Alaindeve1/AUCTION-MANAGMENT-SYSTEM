package com.auction.service;

import com.auction.model.Notification;
import com.auction.repository.NotificationRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class NotificationService {
    private final NotificationRepository notificationRepository;
    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }
    public List<Notification> getNotificationsByUser(Long userId) {
        return notificationRepository.findByUserUserId(userId);
    }

    public void createNotification(com.auction.dto.NotificationDto dto) {
        Notification notification = new Notification();
        notification.setTitle(dto.getTitle());
        notification.setMessage(dto.getMessage());
        notification.setTarget(dto.getTarget());
        notification.setRead(false);
        notification.setCreatedAt(java.time.LocalDateTime.now());
        notificationRepository.save(notification);
    }

    public List<Notification> getNotificationsByTarget(String target) {
        return notificationRepository.findByTarget(target);
    }

    public List<Notification> searchNotifications(String query) {
        return notificationRepository.findByTitleContainingIgnoreCaseOrMessageContainingIgnoreCase(query, query);
    }

    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
            .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setRead(true);
        notificationRepository.save(notification);
    }
}
