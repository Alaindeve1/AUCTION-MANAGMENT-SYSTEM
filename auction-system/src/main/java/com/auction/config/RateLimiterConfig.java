package com.auction.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.HandlerInterceptor;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import java.time.LocalDateTime;

@Configuration
public class RateLimiterConfig implements WebMvcConfigurer {

    private final Map<String, RequestCounter> requestCounters = new ConcurrentHashMap<>();

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new RateLimitInterceptor(requestCounters))
                .addPathPatterns("/api/auth/**");
    }

    private static class RequestCounter {
        private final AtomicInteger count = new AtomicInteger(0);
        private LocalDateTime resetTime = LocalDateTime.now().plusMinutes(1);

        public boolean tryIncrement() {
            if (LocalDateTime.now().isAfter(resetTime)) {
                count.set(0);
                resetTime = LocalDateTime.now().plusMinutes(1);
            }
            return count.incrementAndGet() <= 30;
        }
    }

    private static class RateLimitInterceptor implements HandlerInterceptor {
        private final Map<String, RequestCounter> requestCounters;

        public RateLimitInterceptor(Map<String, RequestCounter> requestCounters) {
            this.requestCounters = requestCounters;
        }

        @Override
        public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
            String ip = request.getRemoteAddr();
            RequestCounter counter = requestCounters.computeIfAbsent(ip, k -> new RequestCounter());

            if (!counter.tryIncrement()) {
                response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                response.getWriter().write("Too many requests. Please try again later.");
                return false;
            }

            return true;
        }
    }
} 