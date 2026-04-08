-- ============================================================
-- SkillBridge — MySQL Schema
-- Run: mysql -u root -p < schema.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS skillbridge
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE skillbridge;

-- ── Users ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    name         VARCHAR(100)  NOT NULL,
    email        VARCHAR(150)  NOT NULL UNIQUE,
    password     VARCHAR(255)  NOT NULL,
    role         ENUM('USER','ADMIN') NOT NULL DEFAULT 'USER',
    bio          TEXT,
    profile_picture VARCHAR(500),
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ── Categories ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255),
    icon_name   VARCHAR(50)
);

-- ── Services ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS services (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    title         VARCHAR(200)   NOT NULL,
    description   TEXT           NOT NULL,
    price         DECIMAL(10,2)  NOT NULL,
    delivery_days INT            NOT NULL,
    category_id   BIGINT         NOT NULL,
    provider_id   BIGINT         NOT NULL,
    status        ENUM('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_service_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    CONSTRAINT fk_service_provider FOREIGN KEY (provider_id) REFERENCES users(id)      ON DELETE CASCADE
);

-- ── Bookings ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bookings (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    service_id BIGINT  NOT NULL,
    client_id  BIGINT  NOT NULL,
    status     ENUM('PENDING','CONFIRMED','COMPLETED','CANCELLED') NOT NULL DEFAULT 'PENDING',
    message    TEXT,
    booked_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_booking_service FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
    CONSTRAINT fk_booking_client  FOREIGN KEY (client_id)  REFERENCES users(id)    ON DELETE CASCADE
);

-- ── Reviews ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reviews (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id  BIGINT   NOT NULL UNIQUE,
    reviewer_id BIGINT   NOT NULL,
    rating      TINYINT  NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment     TEXT,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_review_booking  FOREIGN KEY (booking_id)  REFERENCES bookings(id) ON DELETE CASCADE,
    CONSTRAINT fk_review_reviewer FOREIGN KEY (reviewer_id) REFERENCES users(id)    ON DELETE CASCADE
);
