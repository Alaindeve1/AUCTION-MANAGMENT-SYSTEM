package com.auction.config;

import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;

public class CustomHandshakeHandler implements HandshakeInterceptor {

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response, 
                                 WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {
        if (request instanceof ServletServerHttpRequest) {
            ServletServerHttpRequest servletRequest = (ServletServerHttpRequest) request;
            // You can add custom logic here to validate the handshake
            // For example, check authentication headers or session information
            
            // Log the handshake attempt
            System.out.println("WebSocket handshake from: " + servletRequest.getRemoteAddress());
        }
        return true; // Return true to proceed with the handshake
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response, 
                              WebSocketHandler wsHandler, Exception exception) {
        // This method is called after the handshake is complete
        if (exception != null) {
            System.err.println("WebSocket handshake failed: " + exception.getMessage());
        }
    }
}
