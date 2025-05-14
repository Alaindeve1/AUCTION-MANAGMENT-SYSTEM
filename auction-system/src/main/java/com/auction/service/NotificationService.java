package com.auction.service;

import com.auction.model.Notification;
import com.auction.model.User;
import com.auction.repository.NotificationRepository;
import com.auction.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationService(NotificationRepository notificationRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
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
        
        // Set user if target is not ALL or SIGNED_IN
        if (dto.getTarget() != null && !dto.getTarget().equals("ALL") && !dto.getTarget().equals("SIGNED_IN")) {
            User user = userRepository.findById(Long.parseLong(dto.getTarget()))
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + dto.getTarget()));
            notification.setUser(user);
        }
        
        notificationRepository.save(notification);
    }

    public List<Notification> getNotificationsByTarget(String target) {
        return notificationRepository.findByTarget(target);
    }
}
