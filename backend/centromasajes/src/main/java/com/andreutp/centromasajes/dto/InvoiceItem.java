package com.andreutp.centromasajes.dto;

public class InvoiceItem {
    private String descripcion;
    private int cantidad;
    private double precioUnitario;

    public InvoiceItem(String descripcion, int cantidad, double precioUnitario) {
        this.descripcion = descripcion;
        this.cantidad = cantidad;
        this.precioUnitario = precioUnitario;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public int getCantidad() {
        return cantidad;
    }

    public double getPrecioUnitario() {
        return precioUnitario;
    }
}
