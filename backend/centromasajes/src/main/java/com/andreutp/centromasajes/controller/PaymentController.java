package com.andreutp.centromasajes.controller;


import com.andreutp.centromasajes.dto.PaymentRequest;
import com.andreutp.centromasajes.model.PaymentModel;
import com.andreutp.centromasajes.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/payments")
public class PaymentController {
    private final PaymentService paymentService;

    @Autowired
    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping
    public ResponseEntity<PaymentModel> createPayment(@RequestBody PaymentRequest request) {
        return ResponseEntity.ok(paymentService.createPayment(request));
        PaymentModel pagoCreado = paymentService.createPayment(request); // ya envía el PDF
        return ResponseEntity.ok(pagoCreado);
    }

    @GetMapping
    public ResponseEntity<List<PaymentModel>> getAllPayments() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }

    @GetMapping("/my")
    public ResponseEntity<List<PaymentModel>> getPaymentsByUser(@RequestParam Long userId) {
        return ResponseEntity.ok(paymentService.getPaymentsByUser(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PaymentModel> getPaymentById(@PathVariable Long id) {
        return ResponseEntity.ok(paymentService.getPaymentById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PaymentModel> updatePayment(@PathVariable Long id,
                                                      @RequestBody PaymentModel payment) {
        return ResponseEntity.ok(paymentService.updatePayment(id, payment));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePayment(@PathVariable Long id) {
        paymentService.deletePayment(id);
        return ResponseEntity.noContent().build();
    }
}
