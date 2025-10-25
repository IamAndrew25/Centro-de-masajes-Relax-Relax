package com.andreutp.centromasajes.controller;

import com.andreutp.centromasajes.dto.InvoiceRequest;
import com.andreutp.centromasajes.model.InvoiceModel;
import com.andreutp.centromasajes.service.InvoiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/invoices")
public class InvoiceController {

    private final InvoiceService invoiceService;

    @Autowired
    public InvoiceController(InvoiceService invoiceService) {
        this.invoiceService = invoiceService;
    }

    // Crear factura
    @PostMapping
    public ResponseEntity<InvoiceModel> createInvoice(@RequestBody InvoiceRequest request) {
        return ResponseEntity.ok(invoiceService.createInvoice(request));
    }

    // Listar todas las facturas
    @GetMapping
    public ResponseEntity<List<InvoiceModel>> getAllInvoices() {
        return ResponseEntity.ok(invoiceService.getAllInvoices());
    }

    // Obtener factura por ID
    @GetMapping("/{id}")
    public ResponseEntity<InvoiceModel> getInvoiceById(@PathVariable Long id) {
        return ResponseEntity.ok(invoiceService.getInvoiceById(id));
    }

    // Actualizar factura
    @PutMapping("/{id}")
    public ResponseEntity<InvoiceModel> updateInvoice(@PathVariable Long id,
                                                      @RequestBody InvoiceRequest request) {
        return ResponseEntity.ok(invoiceService.updateInvoice(id, request));
    }

    // Eliminar factura
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInvoice(@PathVariable Long id) {
        invoiceService.deleteInvoice(id);
        return ResponseEntity.noContent().build();
    }
}
