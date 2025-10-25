package com.andreutp.centromasajes.service;


import com.andreutp.centromasajes.model.InvoiceModel;
import com.andreutp.centromasajes.dao.IInvoiceRepository;
import com.andreutp.centromasajes.dao.IPaymentRepository;
import com.andreutp.centromasajes.dto.InvoiceRequest;
import com.andreutp.centromasajes.model.PaymentModel;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InvoiceService {

    private final IInvoiceRepository invoiceRepository;
    private final IPaymentRepository paymentRepository;

    public InvoiceService(IInvoiceRepository invoiceRepository, IPaymentRepository paymentRepository) {
        this.invoiceRepository = invoiceRepository;
        this.paymentRepository = paymentRepository;
    }
/*
    // Crear factura o boleta antes de pagar
    public InvoiceModel createInvoice(InvoiceRequest request) {
        PaymentModel payment = paymentRepository.findById(request.getPaymentId())
                .orElseThrow(() -> new RuntimeException("Pago no encontrado"));

        InvoiceModel invoice = InvoiceModel.builder()
                .payment(payment)
                .type(InvoiceModel.Type.valueOf(request.getType().toUpperCase()))
                .invoiceNumber(request.getInvoiceNumber())
                .customerName(request.getCustomerName())
                .customerDoc(request.getCustomerDoc())
                .total(request.getTotal())
                .notes(request.getNotes())
                .build();

        return invoiceRepository.save(invoice);
    }*/

    // Crear factura despues del pago
    public InvoiceModel createInvoice(InvoiceRequest request) {
        PaymentModel payment = paymentRepository.findById(request.getPaymentId())
                .orElseThrow(() -> new RuntimeException("Pago no encontrado"));

        InvoiceModel invoice = InvoiceModel.builder()
                .payment(payment)
                .appointment(payment.getAppointment())  // <--- asignamos la cita
                .user(payment.getUser())
                .type(InvoiceModel.Type.valueOf(request.getType().toUpperCase()))
                .invoiceNumber(request.getInvoiceNumber())
                .customerName(request.getCustomerName())
                .customerDoc(request.getCustomerDoc())
                .total(request.getTotal())
                .notes(request.getNotes())
                .status(InvoiceModel.Status.PENDING)
                .build();

        invoice = invoiceRepository.save(invoice);

        // Opcional: actualizar el pago con la factura
        payment.setInvoice(invoice);
        paymentRepository.save(payment);

        return invoice;
    }


    // Listar todas las facturas
    public List<InvoiceModel> getAllInvoices() {
        return invoiceRepository.findAll();
    }

    // Obtener factura por ID
    public InvoiceModel getInvoiceById(Long id) {
        return invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Factura no encontrada"));
    }

    // Actualizar factura (solo campos modificables)
    public InvoiceModel updateInvoice(Long id, InvoiceRequest request) {
        InvoiceModel existing = getInvoiceById(id);

        existing.setTotal(request.getTotal());
        existing.setNotes(request.getNotes());
        existing.setType(InvoiceModel.Type.valueOf(request.getType().toUpperCase()));
        existing.setInvoiceNumber(request.getInvoiceNumber());
        existing.setCustomerName(request.getCustomerName());
        existing.setCustomerDoc(request.getCustomerDoc());

        return invoiceRepository.save(existing);
    }

    // Eliminar factura
    public void deleteInvoice(Long id) {
        invoiceRepository.deleteById(id);
    }
}
