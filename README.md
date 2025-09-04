# Aplicacion Web para RELAX-TOTAL
## _Integrantes_ :

- **Obispo Calla, Andres Alexander** (U20227680) - [GitHub:] (https://github.com/IamAndrew25)
- **Tanta Salazar, Andre Leandro** (U22100892) - [GitHub:] (https://github.com/AndreTs8)
- **Sánchez Ríos Jheremy Ayrton** (U21205138) - [GitHub:] (https://github.com/JherySanchez)
- **Ortiz Gonzales Derek** (U22209547) - [GitHub:] (https://github.com/MounstroComeGalletas)
- **Rios Luna, Bryan Snayder**  (U22217418) - [GitHub:] (https://github.com/BryanRLS-2004)
- **Lopez Chavez, Yherson Richard ** (U22323606) -- [GitHub:] (https://github.com/yherson2378)


## 📝 Descripcion del Problema

**RELAX TOTAL** es una empresa dedicada a masajes terapéuticos y de relajación. Actualmente enfrenta limitaciones que afectan su crecimiento y posicionamiento en el mercado, como la ausencia de página web, la falta de un sistema centralizado para mostrar servicios y horarios, y procesos desorganizados para la gestión de reservas y clientes. Además, la competencia ya cuenta con plataformas digitales avanzadas y la empresa tiene escasa presencia en marketing digital, lo que reduce su alcance al público objetivo.

## 🌐 Aplicación Web para RELAX TOTAL

* La solución planteada busca atender las siguientes necesidades:

* Reserva de citas en línea.

* Información clara sobre servicios y promociones.

* Gestión centralizada de horarios y terapeutas.

* Pagos en línea seguros (tarjeta, Yape/Plin).

* Implementación de estrategias de marketing digital.

* Optimización de la atención al cliente mediante notificaciones y recordatorios

## 🎯 Objetivo del Proyecto

- Desarrollar una solución tecnológica integral que permita:

- Gestionar reservas de masajes en línea.

- Visualizar el calendario de disponibilidad de terapeutas.

- Realizar pagos en línea de forma rápida y segura.

- Administrar clientes, horarios y servicios desde un panel de control.

- Generar reportes de reservas y clientes.

- Mejorar la comunicación empresa–cliente con confirmaciones y recordatorios automáticos.

## 💡 Funcionalidades Esperadas

- Registro y autenticación de usuarios.

- Reserva, cancelación y reprogramación de citas.

- Calendario interactivo de disponibilidad.

- Pagos electrónicos con diversas opciones.

- Confirmación automática vía correo o WhatsApp.

- Gestión de masajistas, horarios y servicios por parte del administrador.

- Generación de reportes y estadísticas.

## 🛠️ Tecnologías Utilizadas

- Lenguajes: Java, HTML5, CSS3, JavaScript

- Backend: Java, Servlets, JSP

- Frontend: HTML5, CSS3, Bootstrap 4.6

- Base de Datos: MySQL

- Control de versiones: Git / GitHub

## 📊 Diagrama de Flujo  - Proceso de reserva en linea

```mermaid

flowchart TD

   
    A((Inicio)) --> B{¿Tiene cuenta registrada?}
    B -->|Sí| C[Inicia sesión]
    B -->|No| D[Se registra en la plataforma]
    D --> C
    C --> E[Usuario ingresa a la plataforma web/móvil]
    E --> F[Visualiza catálogo de masajes]
    F --> G[Selecciona servicio y horario disponible]
    G --> H[Confirma selección]
    H --> I[Agrega datos personales de la cita]
    I --> J[Selecciona método de pago]
    J --> K[Procesa pago]
    K --> L{¿Pago exitoso?}
    L -->|Sí| M[Genera reserva y confirma]
    L -->|No| N[Solicita reintento de pago]
    M --> O[Envía notificación por correo/WhatsApp]
    O --> P[Reserva registrada en el sistema]
    P --> Q[Fin]












