package com.andreutp.centromasajes.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final CustomUserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;


    public SecurityConfig(CustomUserDetailsService userDetailsService, JwtUtil jwtUtil) {
        this.userDetailsService = userDetailsService;
        this.jwtUtil = jwtUtil;
    }


    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(
                auth -> auth
                        .requestMatchers("/appointments/**").permitAll()
                        .requestMatchers("/user/**").permitAll()
                        .requestMatchers("/availability/**").permitAll()

                        .requestMatchers("/auth/register/**","/auth/login/**","/auth/forgot-password/**", "/auth/reset-password/**").permitAll()
                        .requestMatchers("/services/**").permitAll()
                        //SERVICIOS ENDPOINS
                        // Solo ADMIN puede crear/actualizar/eliminar servicios
                        //.requestMatchers("/services/**" ,"/services" ).hasRole("ADMIN")//sigue pidiendo token si aun esta en permitir todo
                        .requestMatchers("/services/**").permitAll()
                        .requestMatchers("/test-email").permitAll()
                        .requestMatchers("/test-excel").permitAll()
                        .requestMatchers("/reports/**").permitAll()
                        //cambiarlo luego a que solo el administrador pueda
                        // Solo USER puede listar servicios (GET)
                        //.requestMatchers("/services").hasAnyRole("USER", "ADMIN")

                        //PLANES
                        //.requestMatchers(HttpMethod.GET, "/plans/**").hasAnyRole("ADMIN", "WORKER", "USER") // todos pueden ver
                        //.requestMatchers("/plans/**").hasAnyRole("ADMIN", "WORKER") // crear/editar/eliminar solo WORKER y ADMIN segun necesidad xd

                        // APPOINTMENTS
                        // Crear cita: solo USER
                        //.requestMatchers(HttpMethod.POST, "/appointments/**").hasRole("USER")

                        // Listar todas las citas: solo ADMIN
                        //.requestMatchers(HttpMethod.GET, "/appointments").hasRole("ADMIN")

                        // Ver citas de un trabajador: solo WORKER
                        //.requestMatchers(HttpMethod.GET, "/appointments/worker/**").hasRole("WORKER")

                        // Ver mis citas: USER
                        //.requestMatchers(HttpMethod.GET, "/appointments/my/**").hasRole("USER")

                        // Actualizar estado de cita: WORKER
                        //.requestMatchers(HttpMethod.PATCH, "/appointments/**/status").hasRole("WORKER")

                        // Actualizar/Eliminar cita completa: ADMIN
                        //.requestMatchers(HttpMethod.PUT, "/appointments/**").hasRole("ADMIN")
                        //.requestMatchers(HttpMethod.DELETE, "/appointments/**").hasRole("ADMIN")

                        // (APOINSTMENS)Citas: restricciones según rol
                        // Accesos para USER
                        //.requestMatchers(HttpMethod.POST, "/appointments").hasRole("USER")       // Crear cita
                        //.requestMatchers(HttpMethod.GET, "/appointments/my").hasRole("USER")     // Ver sus citas

                        // Accesos para WORKER
                        //.requestMatchers(HttpMethod.GET, "/appointments/worker/**").hasRole("WORKER") // Ver citas por trabajador
                        //.requestMatchers(HttpMethod.PATCH, "/appointments/**/status").hasRole("WORKER") // Actualizar estado

                        // Accesos para ADMIN
                        //.requestMatchers(HttpMethod.GET, "/appointments").hasRole("ADMIN")       // Listar todas
                        //.requestMatchers(HttpMethod.PUT, "/appointments/**").hasRole("ADMIN")    // Actualizar completa
                        //.requestMatchers(HttpMethod.DELETE, "/appointments/**").hasRole("ADMIN") // Eliminar
                        //.requestMatchers(HttpMethod.PATCH, "/appointments/**/status").hasRole("ADMIN") // También puede cambiar estado

                        // PROMOTIONS
                        //.requestMatchers(HttpMethod.GET, "/promotions/**").hasAnyRole("USER", "WORKER", "ADMIN") // listar/consultar
                        //.requestMatchers("/promotions/**").hasRole("ADMIN") // crear/editar/eliminar


                        // INVOICE
                        //.requestMatchers(HttpMethod.POST, "/invoices/**").hasRole("USER") // crear factura
                        //.requestMatchers(HttpMethod.GET, "/invoices/my/**").hasRole("USER") // listar mis facturas
                        //.requestMatchers("/invoices/**").hasRole("ADMIN") // actualizar, eliminar, listar todas

                        // Payments
                        //.requestMatchers(HttpMethod.POST, "/payments").hasRole("USER")
                        //.requestMatchers(HttpMethod.GET, "/payments/my").hasRole("USER")
                        //.requestMatchers("/payments/**").hasRole("ADMIN") // GET all, PUT, DELETE

                        // Appointments
                        //.requestMatchers("/appointments/**").authenticated()

                        .anyRequest().authenticated()
        )       .httpBasic(Customizer.withDefaults())
                .addFilterBefore(new JwtAuthenticationFilter(jwtUtil, userDetailsService),
                        UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }
}