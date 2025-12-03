package com.andreutp.centromasajes.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "appointment_id", nullable = false)
    private AppointmentModel appointment;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private UserModel user;

    @ManyToOne
    @JoinColumn(name = "invoice_id", nullable = true) //true para que primero se pague y luego cree factura , aunque prodria ser al revez tambien
    private InvoiceModel invoice;

    @Column(nullable = false)
    private Double amount;

    @Column(name = "payment_date", nullable = false)
    private LocalDateTime paymentDate ;

    @Column(length = 50)
    private String method;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "covered_by_subscription", nullable = false)
    private Boolean coveredBySubscription = false;

    public enum Status {
        PENDING,
        PAID,
        REFUNDED,
        FAILED
    }


    @Enumerated(EnumType.STRING)
    private Status status = Status.PENDING;

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.paymentDate == null) {
            this.paymentDate = LocalDateTime.now();
        }
    }
}
