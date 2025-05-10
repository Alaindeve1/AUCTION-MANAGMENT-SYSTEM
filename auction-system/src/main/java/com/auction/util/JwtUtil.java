package com.auction.util;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.security.Keys;
import java.util.Date;
import javax.crypto.SecretKey;
import java.util.Base64;

public class JwtUtil {
    private static final String SECRET_KEY = "bXktc3VwZXItc2VjcmV0LWtleS1mb3ItanVzdC1hdWN0aW9uLXN5c3RlbQ=="; // Base64-encoded string
    private static final long EXPIRATION_TIME = 86400000; // 1 day in ms

    private static SecretKey getKey() {
        return Keys.hmacShaKeyFor(Base64.getDecoder().decode(SECRET_KEY));
    }

    public static String generateToken(Long id, String username, String email, String role) {
        return Jwts.builder()
                .setSubject(username)
                .claim("id", id)
                .claim("username", username)
                .claim("email", email)
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