package com.andreutp.centromasajes.repository;

import com.andreutp.centromasajes.dao.IUserRepository;
import com.andreutp.centromasajes.model.UserModel;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest

public class IRoleRepositoryTest {
    @Autowired
    private IUserRepository userRepository;

    @Test
    void testSaveUser() {
        UserModel user = new UserModel();
        user.setUsername("andre");
        user.setEmail("andre@example.com");
        user.setPassword("1234");
        user.setPhone("999999999");
        user.setDni("12345678");

        UserModel saved = userRepository.save(user);

        assertNotNull(saved.getId());
        assertEquals("andre", saved.getUsername());
    }
}
