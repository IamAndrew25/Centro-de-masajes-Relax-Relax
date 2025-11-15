package com.andreutp.centromasajes.dto;

import lombok.Data;

@Data
public class InvoiceRequest {
    private Long paymentId;
    private String type;
    private String invoiceNumber;
    private String customerName;
    private String customerDoc;
    private Double total;
    private String notes;
}
