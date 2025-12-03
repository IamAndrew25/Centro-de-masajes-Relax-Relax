package com.andreutp.centromasajes.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "invoices")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InvoiceModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "payment_id", nullable = false)
    private PaymentModel payment;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Type type;

    @Column(nullable = false, unique = true)
    private String invoiceNumber;

    @ManyToOne
    @JoinColumn(name = "appointment_id", nullable = false)
    private AppointmentModel appointment;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UserModel user;


    @Column(nullable = false)
    private String customerName;

    @Column(name = "customer_doc")
    private String customerDoc;

    @Column(nullable = false)
    private Double total;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.PENDING;

    public enum Status {
        PENDING,
        PAID,
        CANCELLED
    }

    public enum Type {
        BOLETA,
        FACTURA
    }
    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }
}
