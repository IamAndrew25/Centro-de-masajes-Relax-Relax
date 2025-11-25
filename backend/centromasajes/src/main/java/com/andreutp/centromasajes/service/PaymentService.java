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
import com.andreutp.centromasajes.utils.EmailService;
import com.andreutp.centromasajes.utils.PdfGenerator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PaymentService {
    private final IPaymentRepository paymentRepository;
    private final IUserRepository userRepository;
    private final IInvoiceRepository invoiceRepository;
    @Autowired
    private final IAppointmentRepository appointmentRepository;
    private final EmailService emailService;
    private static final Logger logger = LoggerFactory.getLogger(PdfGenerator.class);


    public PaymentService(IPaymentRepository paymentRepository, IUserRepository userRepository,
                          IInvoiceRepository invoiceRepository, IAppointmentRepository appointmentRepository
            ,EmailService emailService) {
        this.paymentRepository = paymentRepository;
        this.userRepository = userRepository;
        this.invoiceRepository = invoiceRepository;
        this.appointmentRepository = appointmentRepository;
        this.emailService = emailService;
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

    public PaymentModel createPayment(PaymentRequest request) {
        // 1. buscar user y appointment
        UserModel user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        AppointmentModel appointment = appointmentRepository.findById(request.getAppointmentId())
                .orElseThrow(() -> new RuntimeException("Cita no encontrada"));

        // 2. preparar payment
        LocalDateTime payDate = request.getPaymentDate() != null ? request.getPaymentDate() : LocalDateTime.now();

        PaymentModel payment = PaymentModel.builder()
                .user(user)
                .appointment(appointment)
                .amount(request.getAmount())
                .paymentDate(payDate)
                .method(request.getMethod())
                .status(PaymentModel.Status.PAID)
                .coveredBySubscription(Boolean.TRUE.equals(request.getCoveredBySubscription()))
                .build();

        PaymentModel savedPayment = paymentRepository.save(payment);

        // 3. crear invoice relacionado
        InvoiceModel invoice = InvoiceModel.builder()
                .payment(savedPayment)
                .user(user)
                .appointment(appointment)
                .type(InvoiceModel.Type.BOLETA)
                .invoiceNumber(generateInvoiceNumber())
                .customerName(user.getUsername())
                .customerDoc(user.getDni())
                .total(savedPayment.getAmount())
                .status(InvoiceModel.Status.PENDING)
                .build();

        invoice = invoiceRepository.save(invoice);

        // 4. asociar invoice al payment
        savedPayment.setInvoice(invoice);
        paymentRepository.save(savedPayment);

        // 5. enviar correo con PDF -- TRY/CATCH para evitar 500 si falla el mail
        try {
            byte[] pdfBytes = PdfGenerator.generateStyledInvoicePdf(
                    user.getUsername(),
                    invoice.getInvoiceNumber(),
                    buildDescriptionFromAppointment(appointment), // helper abajo
                    1,
                    invoice.getTotal(),
                    savedPayment.getMethod(),
                    String.valueOf(invoice.getInvoiceNumber())
            );

            String correoDestino = (request.getCorreo() != null && !request.getCorreo().isBlank()) ? request.getCorreo() : user.getEmail();

            emailService.enviarCorreoConAdjunto(
                    correoDestino,
                    "Tu boleta - " + invoice.getInvoiceNumber(),
                    "Adjuntamos su boleta electrónica. ¡Gracias por su preferencia!",
                    pdfBytes,
                    "Boleta_" + invoice.getInvoiceNumber() + ".pdf"
            );
        } catch (Exception e) {
            // loguear pero no lanzar excepción
            logger.error("Error enviando boleta por correo: {}", e.getMessage(), e);
        }

        return savedPayment;
    }

    // helper simple
    private String buildDescriptionFromAppointment(AppointmentModel appointment) {
        String serv = appointment.getService() != null ? appointment.getService().getName() : "Servicio";
        String worker = appointment.getWorker() != null ? appointment.getWorker().getUsername() : "Trabajador";
        String start = appointment.getAppointmentStart() != null ? appointment.getAppointmentStart().toString() : "";
        return serv + " - " + worker + " - " + start;
    }





    /*// Crear pago (sin factura o boleta  ain)
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
*/
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