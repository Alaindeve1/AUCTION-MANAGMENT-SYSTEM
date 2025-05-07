package com.auction.util;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.security.Keys;
import java.util.Date;
import javax.crypto.SecretKey;

public class JwtUtil {
    private static final String SECRET_KEY = "your-very-secret-key-your-very-secret-key"; // should be at least 256 bits for HS256
    private static final long EXPIRATION_TIME = 86400000; // 1 day in ms

    private static SecretKey getKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }

    public static String generateToken(String username, String role) {
        return Jwts.builder()
                .setSubject(username)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(getKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public static Claims validateToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
} 