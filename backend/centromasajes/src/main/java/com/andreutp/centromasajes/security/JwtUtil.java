package com.andreutp.centromasajes.security;

import com.andreutp.centromasajes.model.UserModel;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtil {

    private static final String SECRET_KEY = "laClaveSuperSecretaParaJWT_123456789xd";
    private static final long EXPIRATION_TIME = 1000 * 60 * 60; // 1 hora

    private final Key key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

    // Genera el token incluyendo userId y role
    public String generateToken(UserModel user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getId());
        claims.put("role", user.getRole().getName());

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(user.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // Helper para extraer todos los claims
    private Claims extractAllClaims(String token) {
         return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // Metodo  para extraer un claim especifico
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // Extrae el username
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // Extrae el userId
    public Long extractUserId(String token) {
        return extractClaim(token, claims -> claims.get("userId", Long.class));
     }

     // Extrae el role
     public String extractRole(String token) {
        return extractClaim(token, claims -> claims.get("role", String.class));
     }

     // Verifica si el token ha expirado
     private Boolean isTokenExpired(String token) {
        return extractClaim(token, Claims::getExpiration).before(new Date());
     }

    // Valida el token
    public boolean isTokenValid(String token) {
        try {
            final String username = extractUsername(token);
            // Verifica que el username exista y que el token no haya expirado
            return (username != null && !isTokenExpired(token));
        } catch (JwtException e) {
            System.err.println("JWT validation error: " + e.getMessage());
            return false;
        }
    }
}