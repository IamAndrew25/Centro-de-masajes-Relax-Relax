package com.andreutp.centromasajes.security;

import com.andreutp.centromasajes.model.UserModel;
import com.andreutp.centromasajes.dao.IUserRepository;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    private final IUserRepository iuserRepository;

    public CustomUserDetailsService(IUserRepository iuserRepository) {
        this.iuserRepository = iuserRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserModel user = iuserRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getUsername())
                .password(user.getPassword())
                .roles("USER")
                .build();
    }
}
