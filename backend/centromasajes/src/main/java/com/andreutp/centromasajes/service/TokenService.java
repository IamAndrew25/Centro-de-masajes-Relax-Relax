package com.andreutp.centromasajes.service;

import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;


//google guava con token o sea que el token q se creara aqui es de google guava solo
// para hacer el cambi ode la contrasena mediante el correo y le pondre una duracion de 15 min por ahi xd
@Service
public class TokenService {
    private final Cache<String, String> tokenCache = CacheBuilder.newBuilder()
            .expireAfterWrite(15, TimeUnit.MINUTES) // Token válido por 15 min
            .build();

    // Guardar token en memoria
    public void storeToken(String token, String email) {
        tokenCache.put(token, email);
    }

    // Validar y obtener email por token
    public String validateToken(String token) {
        return tokenCache.getIfPresent(token);
    }

    // Eliminar token una vez usado
    public void removeToken(String token) {
        tokenCache.invalidate(token);
    }
}
