package com.andreutp.centromasajes.controller;


import com.andreutp.centromasajes.dto.AuthResponse;
import com.andreutp.centromasajes.dto.LoginRequest;
import com.andreutp.centromasajes.dto.RegisterRequest;
import com.andreutp.centromasajes.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.andreutp.centromasajes.security.LoginRateLimiter;
import com.google.common.base.Preconditions;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {
    //endpoints , al igual que los role y user services
    private final AuthService authService;
    private final LoginRateLimiter loginRateLimiter;

    //su constructor pa usarlo

    public AuthController(AuthService authService, LoginRateLimiter loginRateLimiter) {
        this.authService = authService;
        this.loginRateLimiter = loginRateLimiter;
    }

    //registra usuario
    @PostMapping("/register")
    public AuthResponse registrar(@Valid @RequestBody RegisterRequest request){
        return authService.register(request);
    }


    // Login de usuario con Rate Limiting y validacion con predictions(guava)
    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {

        // Validación con Guava
        Preconditions.checkNotNull(request, "El objeto LoginRequest no puede ser nulo");
        Preconditions.checkArgument(request.getEmail() != null && !request.getEmail().isEmpty(), "El correo electrónico no puede estar vacío");
        Preconditions.checkArgument(request.getPassword() != null && !request.getPassword().isEmpty(), "La contraseña no puede estar vacía");

        // Limitar los intentos de login: 1 intento por segundo
        String key = request.getEmail(); // Usamos el email como clave de rate limiting
        if (!loginRateLimiter.tryAcquire(key, 1.0)) {
            throw new RateLimitExceededException("Demasiados intentos. Intenta de nuevo más tarde.");
        }

        return authService.login(request); // Procesamos el login si no excede el límite
    }


    //ME OLVIDE LA CONTRASENA (LOGIN)
    @PostMapping("/forgot-password")
    public Map<String, String> forgotPassword(@RequestBody Map<String, String> body) {
        authService.sendPasswordResetToken(body.get("email"));
        return Map.of("message", "Se envió un enlace de recuperación al correo");
    }

    //resetear contrasena (INTERNO- cuando esta logeado)
    @PostMapping("/reset-password")
    public Map<String, String> resetPassword(@RequestBody Map<String, String> body) {
        authService.resetPassword(body.get("token"), body.get("newPassword"));
        return Map.of("message", "Contraseña actualizada con éxito");
    }

     // Excepción personalizada para Rate Limit
    static class RateLimitExceededException extends RuntimeException {
        public RateLimitExceededException(String msg) {
            super(msg);
        }
    }

}







