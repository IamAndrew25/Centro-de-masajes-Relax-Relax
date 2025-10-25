package com.andreutp.centromasajes.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class PaymentRequest {
    private Long appointmentId; // + getter y setter
    private Long userId;
    //private Long invoiceId;
    private Double amount;
    private LocalDateTime paymentDate;
    private String method; // Ejemplo: CREDIT_CARD, CASH, TRANSFER< YAPE Y MAS XD
    private Boolean coveredBySubscription;


    public Boolean isCoveredBySubscription() {
        return coveredBySubscription;
    }
}
