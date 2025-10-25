package com.andreutp.centromasajes.dao;

import com.andreutp.centromasajes.model.InvoiceModel;
import com.andreutp.centromasajes.model.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IInvoiceRepository extends JpaRepository<InvoiceModel, Long> {
    List<InvoiceModel> findByPaymentUser(UserModel user);
}
