package com.auction.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

@Configuration
@EnableScheduling
public class SchedulerConfig {
    // The @EnableScheduling annotation activates Spring's scheduling capabilities
    // No additional configuration is needed for basic scheduling
}