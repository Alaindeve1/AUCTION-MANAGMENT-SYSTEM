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
}
