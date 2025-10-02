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

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {
    //endpoints , al igua lq los role y user services
    private final AuthService authService;

    //su constructor pa usarlo

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    //registra usuario
    @PostMapping("/register")
    public AuthResponse registrar(@Valid @RequestBody RegisterRequest request){
        return authService.register(request);
    }


    //logea al usuario
    @PostMapping("/login")
    public AuthResponse login (@Valid @RequestBody LoginRequest request){
        return authService.login(request);
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

}







