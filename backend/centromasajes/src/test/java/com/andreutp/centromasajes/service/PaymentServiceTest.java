package com.andreutp.centromasajes.service;

import com.andreutp.centromasajes.dao.IAppointmentRepository;
import com.andreutp.centromasajes.dao.IInvoiceRepository;
import com.andreutp.centromasajes.dao.IPaymentRepository;
import com.andreutp.centromasajes.dao.IUserRepository;
import com.andreutp.centromasajes.dto.PaymentRequest;
import com.andreutp.centromasajes.model.*;
import com.andreutp.centromasajes.utils.EmailService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PaymentServiceTest {

    @Mock
    private IPaymentRepository paymentRepository;

    @Mock
    private IUserRepository userRepository;

    @Mock
    private IInvoiceRepository invoiceRepository;

    @Mock
    private IAppointmentRepository appointmentRepository;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private PaymentService paymentService;

    private UserModel testUser;
    private AppointmentModel testAppointment;
    private ServiceModel testService;
    private PaymentModel testPayment;
    private InvoiceModel testInvoice;
    private PaymentRequest paymentRequest;

    @BeforeEach
    void setUp() {
        testUser = new UserModel();
        testUser.setId(1L);
        testUser.setUsername("testUser");
        testUser.setEmail("test@example.com");
        testUser.setDni("12345678");

        testService = new ServiceModel();
        testService.setId(1L);
        testService.setName("Masaje Relajante");
        testService.setBaseprice(100.0);

        testAppointment = new AppointmentModel();
        testAppointment.setId(1L);
        testAppointment.setUser(testUser);
        testAppointment.setService(testService);

        testPayment = new PaymentModel();
        testPayment.setId(1L);
        testPayment.setUser(testUser);
        testPayment.setAppointment(testAppointment);
        testPayment.setAmount(100.0);
        testPayment.setMethod("CREDIT_CARD");
        testPayment.setStatus(PaymentModel.Status.PAID);
        testPayment.setPaymentDate(LocalDateTime.now());

        testInvoice = new InvoiceModel();
        testInvoice.setId(1L);
        testInvoice.setPayment(testPayment);
        testInvoice.setUser(testUser);
        testInvoice.setAppointment(testAppointment);
        testInvoice.setInvoiceNumber("INV-123456");
        testInvoice.setCustomerName(testUser.getUsername());
        testInvoice.setCustomerDoc(testUser.getDni());
        testInvoice.setTotal(100.0);

        paymentRequest = new PaymentRequest();
        paymentRequest.setUserId(1L);
        paymentRequest.setAppointmentId(1L);
        paymentRequest.setAmount(100.0);
        paymentRequest.setMethod("CREDIT_CARD");
        paymentRequest.setPaymentDate(LocalDateTime.now());
        paymentRequest.setCoveredBySubscription(false);
    }

    @Test
    void testCreatePayment_Success() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(appointmentRepository.findById(1L)).thenReturn(Optional.of(testAppointment));
        when(paymentRepository.save(any(PaymentModel.class))).thenReturn(testPayment);
        when(invoiceRepository.save(any(InvoiceModel.class))).thenReturn(testInvoice);
        doNothing().when(emailService).enviarBoletaConPDF(anyString(), anyString(), anyString(), anyString(), any(Double.class));

        // Act
        PaymentModel result = paymentService.createPayment(paymentRequest);

        // Assert
        assertNotNull(result);
        assertEquals(testUser, result.getUser());
        assertEquals(testAppointment, result.getAppointment());
        assertEquals(100.0, result.getAmount());
        assertEquals(PaymentModel.Status.PAID, result.getStatus());

        verify(userRepository, times(1)).findById(1L);
        verify(appointmentRepository, times(1)).findById(1L);
        verify(paymentRepository, times(2)).save(any(PaymentModel.class)); // 2 veces: inicial y con invoice
        verify(invoiceRepository, times(1)).save(any(InvoiceModel.class));
        verify(emailService, times(1)).enviarBoletaConPDF(anyString(), anyString(), anyString(), anyString(), any(Double.class));
    }

    @Test
    void testCreatePayment_UserNotFound() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            paymentService.createPayment(paymentRequest);
        });

        assertEquals("Usuario no encontrado", exception.getMessage());
        verify(paymentRepository, never()).save(any(PaymentModel.class));
    }

    @Test
    void testCreatePayment_AppointmentNotFound() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(appointmentRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            paymentService.createPayment(paymentRequest);
        });

        assertEquals("Cita no encontrada", exception.getMessage());
        verify(paymentRepository, never()).save(any(PaymentModel.class));
    }

    @Test
    void testGetAllPayments() {
        // Arrange
        List<PaymentModel> payments = Arrays.asList(testPayment);
        when(paymentRepository.findAll()).thenReturn(payments);

        // Act
        List<PaymentModel> result = paymentService.getAllPayments();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testPayment, result.get(0));
        verify(paymentRepository, times(1)).findAll();
    }

    @Test
    void testGetPaymentsByUser_Success() {
        // Arrange
        List<PaymentModel> payments = Arrays.asList(testPayment);
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(paymentRepository.findByUser(testUser)).thenReturn(payments);

        // Act
        List<PaymentModel> result = paymentService.getPaymentsByUser(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(userRepository, times(1)).findById(1L);
        verify(paymentRepository, times(1)).findByUser(testUser);
    }

    @Test
    void testGetPaymentsByUser_UserNotFound() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            paymentService.getPaymentsByUser(1L);
        });

        assertEquals("Usuario no encontrado", exception.getMessage());
    }

    @Test
    void testGetPaymentById_Success() {
        // Arrange
        when(paymentRepository.findById(1L)).thenReturn(Optional.of(testPayment));

        // Act
        PaymentModel result = paymentService.getPaymentById(1L);

        // Assert
        assertNotNull(result);
        assertEquals(testPayment, result);
        verify(paymentRepository, times(1)).findById(1L);
    }

    @Test
    void testGetPaymentById_NotFound() {
        // Arrange
        when(paymentRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            paymentService.getPaymentById(1L);
        });

        assertEquals("Pago no encontrado", exception.getMessage());
    }

    @Test
    void testUpdatePayment_Success() {
        // Arrange
        PaymentModel updatedPayment = new PaymentModel();
        updatedPayment.setAmount(150.0);
        updatedPayment.setMethod("CASH");
        updatedPayment.setPaymentDate(LocalDateTime.now().plusDays(1));
        updatedPayment.setStatus(PaymentModel.Status.PAID);

        when(paymentRepository.findById(1L)).thenReturn(Optional.of(testPayment));
        when(paymentRepository.save(any(PaymentModel.class))).thenReturn(testPayment);

        // Act
        PaymentModel result = paymentService.updatePayment(1L, updatedPayment);

        // Assert
        assertNotNull(result);
        verify(paymentRepository, times(1)).findById(1L);
        verify(paymentRepository, times(1)).save(testPayment);
    }

    @Test
    void testDeletePayment() {
        // Arrange
        doNothing().when(paymentRepository).deleteById(1L);

        // Act
        paymentService.deletePayment(1L);

        // Assert
        verify(paymentRepository, times(1)).deleteById(1L);
    }

    @Test
    void testCreateInvoiceForPayment_Success() {
        // Arrange
        when(paymentRepository.findById(1L)).thenReturn(Optional.of(testPayment));
        when(invoiceRepository.save(any(InvoiceModel.class))).thenReturn(testInvoice);
        when(paymentRepository.save(any(PaymentModel.class))).thenReturn(testPayment);

        // Act
        InvoiceModel result = paymentService.createInvoiceForPayment(1L, "BOLETA", "Test Customer", "12345678");

        // Assert
        assertNotNull(result);
        assertEquals(testInvoice, result);
        verify(paymentRepository, times(1)).findById(1L);
        verify(invoiceRepository, times(1)).save(any(InvoiceModel.class));
        verify(paymentRepository, times(1)).save(testPayment);
    }

    @Test
    void testCreateInvoiceForPayment_PaymentNotFound() {
        // Arrange
        when(paymentRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            paymentService.createInvoiceForPayment(1L, "BOLETA", "Test", "12345678");
        });

        assertEquals("Pago no encontrado", exception.getMessage());
        verify(invoiceRepository, never()).save(any(InvoiceModel.class));
    }
}