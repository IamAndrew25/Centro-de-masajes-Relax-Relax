package com.andreutp.centromasajes.dao;

import com.andreutp.centromasajes.model.PaymentModel;
import com.andreutp.centromasajes.model.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface IPaymentRepository extends JpaRepository<PaymentModel, Long> {
    List<PaymentModel> findByUser(UserModel user);
}
