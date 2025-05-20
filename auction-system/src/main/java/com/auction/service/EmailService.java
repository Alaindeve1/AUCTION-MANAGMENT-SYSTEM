package com.auction.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender emailSender;

    public void sendPasswordResetEmail(String to, String resetLink) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Password Reset Request");
        message.setText("You have requested to reset your password. Please click the link below to reset your password:\n\n" +
                resetLink + "\n\n" +
                "If you did not request this password reset, please ignore this email.\n\n" +
                "This link will expire in 24 hours.");
        
        emailSender.send(message);
    }
} 