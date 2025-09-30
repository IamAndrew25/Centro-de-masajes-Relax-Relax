package com.andreutp.centromasajes.service;

import com.andreutp.centromasajes.dto.AuthResponse;
import com.andreutp.centromasajes.dto.LoginRequest;
import com.andreutp.centromasajes.dto.RegisterRequest;
import com.andreutp.centromasajes.model.RoleModel;
import com.andreutp.centromasajes.model.UserModel;
import com.andreutp.centromasajes.dao.IRoleRepository;
import com.andreutp.centromasajes.dao.IUserRepository;
import com.andreutp.centromasajes.security.JwtUtil;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class AuthService {
    //bd
    private final IUserRepository iuserRepository;
    private final IRoleRepository iroleRepository;
    //para cifrar la contrasenas de spring
    private final BCryptPasswordEncoder passwordEncoder;

    private final JwtUtil jwtUtil; // pues el token xd

    public AuthService(IUserRepository iuserRepository,
                       IRoleRepository iroleRepository,
                       BCryptPasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil) {
        this.iuserRepository = iuserRepository;
        this.iroleRepository = iroleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    //registrar un usuario normal q siempre sera user primero
    public AuthResponse register(RegisterRequest request){
        //q si o si cuando se cree sea como usuario
        RoleModel userRole = iroleRepository.findByName("USER");
        //si no es usuario da error
        if (userRole==null){
            throw new RuntimeException("EL ROL USER NO SE HA ENCONTARDO EN AL BD");
        }
        //creamos el usuario y obtenemos los datos de la request
        UserModel user = new UserModel();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setDni(request.getDni());
        user.setEnabled(true);
        user.setRole(userRole);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        //se guarda el usuario de el metodo save de la base de datos dada por jpa en repository
        iuserRepository.save(user);

        //lo q saldrai en el postman caudno se creo
        AuthResponse response = new AuthResponse();
        response.setMessage("EL USUARIO HA SIDO CREADO CORRECTAMENTE:)");
        response.setEmail(user.getEmail());
        response.setUsername(user.getUsername());
        response.setDni(user.getDni());
        response.setRoleId(user.getRole().getId());

        return response;

    }


        //login
    public AuthResponse login(LoginRequest request){
        //de lista de los usuarios
        Optional<UserModel> userOpt= iuserRepository.findAll()
                .stream()
                .filter(u -> u.getEmail().equals(request.getEmail())).findFirst();
        //verificar si el user esta vacio o es incorrecto junto a la contrasena cifrada
        if (userOpt.isEmpty()|| !passwordEncoder.matches(request.getPassword(), userOpt.get().getPassword())){
            throw new RuntimeException("Email o contrasena incorrectos :0");
        }

        //obtenemos e usuario
        UserModel user = userOpt.get();
        //ahora el token
        String token = jwtUtil.generateToken(user.getUsername()); // aca se genera el token , ahi dice generatetoken xd
        // da bien si es pues correcto dx
        AuthResponse response = new AuthResponse();

        response.setMessage("Login existoso");
        response.setEmail(user.getEmail());
        response.setUsername(user.getUsername());
        response.setRoleId(user.getRole().getId());
        response.setToken(token);

        return response;
    }

}
