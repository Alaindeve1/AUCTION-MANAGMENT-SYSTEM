package com.auction.service;

import jakarta.servlet.http.HttpSession;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import java.util.concurrent.TimeUnit;

@Service
public class SessionService {
    private final RedisTemplate<String, Object> redisTemplate;
    private static final long SESSION_TIMEOUT = 3600; // 1 hour in seconds

    public SessionService(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public void setAttribute(HttpSession session, String key, Object value) {
        String sessionKey = getSessionKey(session, key);
        redisTemplate.opsForValue().set(sessionKey, value, SESSION_TIMEOUT, TimeUnit.SECONDS);
        session.setAttribute(key, value);
    }

    public Object getAttribute(HttpSession session, String key) {
        Object value = session.getAttribute(key);
        if (value == null) {
            String sessionKey = getSessionKey(session, key);
            value = redisTemplate.opsForValue().get(sessionKey);
            if (value != null) {
                session.setAttribute(key, value);
            }
        }
        return value;
    }

    public void removeAttribute(HttpSession session, String key) {
        String sessionKey = getSessionKey(session, key);
        redisTemplate.delete(sessionKey);
        session.removeAttribute(key);
    }

    public void invalidateSession(HttpSession session) {
        String sessionId = session.getId();
        redisTemplate.delete(redisTemplate.keys("session:" + sessionId + ":*"));
        session.invalidate();
    }

    private String getSessionKey(HttpSession session, String key) {
        return "session:" + session.getId() + ":" + key;
    }
} 