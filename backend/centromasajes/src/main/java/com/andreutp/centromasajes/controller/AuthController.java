package com.andreutp.centromasajes.controller;


import com.andreutp.centromasajes.dto.AuthResponse;
import com.andreutp.centromasajes.dto.LoginRequest;
import com.andreutp.centromasajes.dto.RegisterRequest;
import com.andreutp.centromasajes.service.AuthService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
    public AuthResponse registrar(@RequestBody RegisterRequest request){
        return authService.register(request);
    }


    //logea al usuario
    @PostMapping("/login")
    public AuthResponse login (@RequestBody LoginRequest request){
        return authService.login(request);
    }
}







