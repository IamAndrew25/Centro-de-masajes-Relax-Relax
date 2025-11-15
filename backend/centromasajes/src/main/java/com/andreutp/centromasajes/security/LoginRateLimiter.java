package com.andreutp.centromasajes.security;

import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;
import com.google.common.util.concurrent.RateLimiter;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;

@Component
public class LoginRateLimiter {

    // Cache que mantiene un RateLimiter por usuario o IP
    private final Cache<String, RateLimiter> limiters = CacheBuilder.newBuilder()
            .expireAfterAccess(30, TimeUnit.MINUTES) // Expiración del caché después de 30 minutos
            .maximumSize(10_000)                    // Limite del tamaño del caché
            .build();

    /**
     * Verifica si la solicitud puede ser aceptada según el RateLimiter.
     * @param key Clave que identifica el usuario o IP (ejemplo: email o IP)
     * @param permitsPerSecond Número de intentos permitidos por segundo
     * @return true si se permite el intento, false si no.
     */
    public boolean tryAcquire(String key, double permitsPerSecond) {
        RateLimiter rateLimiter = limiters.getIfPresent(key);
        if (rateLimiter == null) {
            rateLimiter = RateLimiter.create(permitsPerSecond); // 1 intentos por segundo
            limiters.put(key, rateLimiter);
        }
        return rateLimiter.tryAcquire(); // Devuelve true si el intento es permitido
    }
}
