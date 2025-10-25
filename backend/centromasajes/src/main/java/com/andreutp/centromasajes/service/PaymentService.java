package com.andreutp.centromasajes.service;


import com.andreutp.centromasajes.dao.IAppointmentRepository;
import com.andreutp.centromasajes.model.AppointmentModel;
import com.andreutp.centromasajes.model.InvoiceModel;
import com.andreutp.centromasajes.dao.IInvoiceRepository;
import com.andreutp.centromasajes.dao.IPaymentRepository;
import com.andreutp.centromasajes.dao.IUserRepository;
import com.andreutp.centromasajes.dto.PaymentRequest;
import com.andreutp.centromasajes.model.PaymentModel;
import com.andreutp.centromasajes.model.UserModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentService {
    private final IPaymentRepository paymentRepository;
    private final IUserRepository userRepository;
    private final IInvoiceRepository invoiceRepository;
    @Autowired
    private final IAppointmentRepository appointmentRepository;

    public PaymentService(IPaymentRepository paymentRepository, IUserRepository userRepository,
                          IInvoiceRepository invoiceRepository, IAppointmentRepository appointmentRepository) {
        this.paymentRepository = paymentRepository;
        this.userRepository = userRepository;
        this.invoiceRepository = invoiceRepository;
        this.appointmentRepository = appointmentRepository;
    }
/*
    // Crear pago con factura o boleta existente
    public PaymentModel createPayment(PaymentRequest request) {
        UserModel user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        AppointmentModel appointment = appointmentRepository.findById(request.getAppointmentId())
                .orElseThrow(() -> new RuntimeException("Cita no encontrada"));

        InvoiceModel invoice = invoiceRepository.findById(request.getInvoiceId())
                .orElseThrow(() -> new RuntimeException("Factura no encontrada"));


        PaymentModel payment = new PaymentModel();
        payment.setUser(user);
        payment.setAppointment(appointment);
        payment.setInvoice(invoice);
        payment.setAmount(request.getAmount());
        payment.setPaymentDate(request.getPaymentDate());
        payment.setMethod(request.getMethod());
        payment.setStatus(PaymentModel.Status.COMPLETED);
        payment.setCoveredBySubscription(request.isCoveredBySubscription());

        return paymentRepository.save(payment);
    }
*/
    public List<PaymentModel> getAllPayments() {
        return paymentRepository.findAll();
    }

    // Crear pago (sin factura o boleta  ain)
    public PaymentModel createPayment(PaymentRequest request) {
        UserModel user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        AppointmentModel appointment = appointmentRepository.findById(request.getAppointmentId())
                .orElseThrow(() -> new RuntimeException("Cita no encontrada"));

        PaymentModel payment = new PaymentModel();
        payment.setUser(user);
        payment.setAppointment(appointment);
        payment.setAmount(request.getAmount());
        payment.setPaymentDate(request.getPaymentDate());
        payment.setMethod(request.getMethod());
        payment.setStatus(PaymentModel.Status.PENDING);
        payment.setCoveredBySubscription(request.isCoveredBySubscription());

        // Guardar pago primero, sin factura
        return paymentRepository.save(payment);
    }

    // Generar factura para un pago existente
    public InvoiceModel createInvoiceForPayment(Long paymentId, String type, String customerName, String customerDoc) {
        PaymentModel payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Pago no encontrado"));

        InvoiceModel invoice = new InvoiceModel();
        invoice.setPayment(payment);
        invoice.setType(InvoiceModel.Type.valueOf(type.toUpperCase()));  // BOLETA o FACTURA
        invoice.setInvoiceNumber(generateInvoiceNumber());
        invoice.setCustomerName(customerName);
        invoice.setCustomerDoc(customerDoc);
        invoice.setTotal(payment.getAmount());

        invoice = invoiceRepository.save(invoice);

        // Actualizar pago con la factura
        payment.setInvoice(invoice);
        paymentRepository.save(payment);

        return invoice;
    }

    private String generateInvoiceNumber() {
        // Genera un número único simple
        return "INV-" + System.currentTimeMillis();
    }

    public List<PaymentModel> getPaymentsByUser(Long userId) {
        UserModel user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return paymentRepository.findByUser(user);
    }

    public PaymentModel getPaymentById(Long id) {
        return paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pago no encontrado"));
    }

    public PaymentModel updatePayment(Long id, PaymentModel updatedPayment) {
        PaymentModel existing = getPaymentById(id);
        existing.setAmount(updatedPayment.getAmount());
        existing.setPaymentDate(updatedPayment.getPaymentDate());
        existing.setMethod(updatedPayment.getMethod());
        existing.setStatus(updatedPayment.getStatus());
        return paymentRepository.save(existing);
    }

    public void deletePayment(Long id) {
        paymentRepository.deleteById(id);
    }
}
