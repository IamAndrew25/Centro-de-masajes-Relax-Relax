CREATE DATABASE centro_masajes;
USE centro_masajes;

CREATE TABLE roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);
INSERT INTO roles (name) VALUES ('ADMIN');
INSERT INTO roles (name) VALUES ('USER');
INSERT INTO roles (name) VALUES ('WORKER');

Select * from users
Select * from roles

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(30),
    email VARCHAR(150) UNIQUE,
    enabled BOOLEAN DEFAULT TRUE,
    role_id BIGINT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES roles(id)
);


ALTER TABLE users ADD COLUMN dni VARCHAR(20) UNIQUE AFTER email;


DELETE FROM users where	id=1;

UPDATE users
SET role_id = 1
WHERE username = 'andreuser';


-- SERVICIOS
CREATE TABLE IF NOT EXISTS services (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    description TEXT,
    duration_min INT NOT NULL,              -- duración del servicio (minutos o goras)
    base_price DECIMAL(10,2) NOT NULL,      -- precio para pago por visita (sin plan)
    active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (name)
);


-- PLANES (suscripciones por tiempo o sea dias dx)
CREATE TABLE IF NOT EXISTS plans (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,           -- precio del plan
    duration_days INT NOT NULL,             -- 30, 90, 365, etc.
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (name)
);

/*pa despues
-- Semilla opcional de servicios y planes
INSERT IGNORE INTO services (id, name, description, duration_min, base_price, active)
VALUES
    (1,'Masaje Relajante','Sesión relajante',60,80.00,TRUE),
    (2,'Masaje Descontracturante','Alta presión',60,95.00,TRUE);

INSERT IGNORE INTO plans (id, name, description, price, duration_days)
VALUES
    (1,'Mensual','Acceso durante 30 días',120.00,30),
    (2,'Trimestral','Acceso durante 90 días',300.00,90);
    
    
    */
    
    -- SUSCRIPCIONES DE USUARIOS
CREATE TABLE IF NOT EXISTS user_plans (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    plan_id BIGINT NOT NULL,
    start_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    end_date DATETIME NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_plans_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_user_plans_plan FOREIGN KEY (plan_id) REFERENCES plans(id),
    INDEX idx_user_plans_user (user_id),
    INDEX idx_user_plans_active (active, end_date)
);


-- DISPONIBILIDAD 
-- rango de horas por dia para cada trabajador
CREATE TABLE IF NOT EXISTS worker_availability (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    worker_id BIGINT NOT NULL,             -- user con rol WORKER
    weekday TINYINT NOT NULL,              -- 1=Lunes .. 7=Domingo
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_av_worker FOREIGN KEY (worker_id) REFERENCES users(id),
    UNIQUE (worker_id, weekday, start_time, end_time)
);


-- CITAS
CREATE TABLE IF NOT EXISTS appointments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    worker_id BIGINT NOT NULL,             -- user con rol WORKER
    service_id BIGINT NOT NULL,
    appointment_start DATETIME NOT NULL,   -- inicio de la cita
    appointment_end   DATETIME NOT NULL,   -- fin de la cita (calcula = start + duracion)
    status ENUM('PENDING','CONFIRMED','CANCELLED','COMPLETED') DEFAULT 'PENDING',
    user_plan_id BIGINT NULL,              -- si esta cubierta por la suscripcion vigente
    notes TEXT,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_appt_user   FOREIGN KEY (user_id)   REFERENCES users(id),
    CONSTRAINT fk_appt_worker FOREIGN KEY (worker_id) REFERENCES users(id),
    CONSTRAINT fk_appt_service FOREIGN KEY (service_id) REFERENCES services(id),
    CONSTRAINT fk_appt_userplan FOREIGN KEY (user_plan_id) REFERENCES user_plans(id),

    -- Evita doble reserva del mismo trabajador en el mismo horario exacto
    UNIQUE KEY uniq_worker_slot (worker_id, appointment_start),

    INDEX idx_appt_user (user_id),
    INDEX idx_appt_worker (worker_id),
    INDEX idx_appt_date (appointment_start)
);


-- -------------------------
-- PAGOS (siempre se registra un pago)
-- - si la cita esta cubierta por plan: amount=0, method='SUBSCRIPTION', covered_by_subscription=1
-- - si es pago por visita: amount = services.base_price, method='CASH'/'CARD'/..., covered_by_subscription=0
-- -------------------------
CREATE TABLE IF NOT EXISTS payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    appointment_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency CHAR(3) DEFAULT 'USD',
    method ENUM('CASH','CARD','ONLINE','SUBSCRIPTION') NOT NULL,
    status ENUM('PENDING','PAID','REFUNDED','FAILED') DEFAULT 'PAID',
    covered_by_subscription BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_pay_appt FOREIGN KEY (appointment_id) REFERENCES appointments(id),
    CONSTRAINT fk_pay_user FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE KEY uniq_payment_per_appointment (appointment_id),

    INDEX idx_pay_user (user_id),
    INDEX idx_pay_status (status)
);

-- COMPROBANTES (boletas/facturas)
CREATE TABLE IF NOT EXISTS invoices (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    payment_id BIGINT NOT NULL,       -- ligado a un pago
    type ENUM('BOLETA','FACTURA') NOT NULL,
    invoice_number VARCHAR(50) NOT NULL UNIQUE,  -- N de boleta o factura
    customer_name VARCHAR(150) NOT NULL,         -- nombre en el comprobante
    customer_doc VARCHAR(50),                    -- DNI / RUC / identificación o un tipo de carnet de extrangeria o algo
    issue_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10,2) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_invoice_payment FOREIGN KEY (payment_id) REFERENCES payments(id),
    INDEX idx_invoice_number (invoice_number)
);


-- PROMOCIONES
CREATE TABLE IF NOT EXISTS promotions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    discount_percent DECIMAL(5,2) DEFAULT 0,  -- descuento en %
    discount_amount DECIMAL(10,2) DEFAULT 0,  -- descuento fijo
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- RELACIoN: promocion aplicada a servicios
CREATE TABLE IF NOT EXISTS promotion_services (
    promotion_id BIGINT NOT NULL,
    service_id BIGINT NOT NULL,
    PRIMARY KEY (promotion_id, service_id),
    CONSTRAINT fk_promo_service FOREIGN KEY (promotion_id) REFERENCES promotions(id),
    CONSTRAINT fk_service_promo FOREIGN KEY (service_id) REFERENCES services(id)
);

-- RELACIoN: promocion aplicada a planes
CREATE TABLE IF NOT EXISTS promotion_plans (
    promotion_id BIGINT NOT NULL,
    plan_id BIGINT NOT NULL,
    PRIMARY KEY (promotion_id, plan_id),
    CONSTRAINT fk_promo_plan FOREIGN KEY (promotion_id) REFERENCES promotions(id),
    CONSTRAINT fk_plan_promo FOREIGN KEY (plan_id) REFERENCES plans(id)
);

