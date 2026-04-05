-- =============================================
-- schema.sql — Create All MySQL Tables
-- Pair 3, Member 6 owns this file
-- Run this once to set up the database
-- =============================================

-- Step 1: Create the database
CREATE DATABASE IF NOT EXISTS hospital_db;
USE hospital_db;

-- =============================================
-- TABLE 1: patients
-- Stores daily patient admission records
-- =============================================
CREATE TABLE IF NOT EXISTS patients (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    department      VARCHAR(100) NOT NULL,
    patient_count   INT          NOT NULL,
    date            DATE         NOT NULL,
    day_of_week     VARCHAR(20),          -- e.g., Monday, Tuesday
    shift           VARCHAR(20),          -- Morning / Evening / Night
    created_at      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- TABLE 2: resources
-- Tracks equipment and bed availability
-- =============================================
CREATE TABLE IF NOT EXISTS resources (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    department      VARCHAR(100) NOT NULL,
    resource_type   VARCHAR(100),         -- e.g., Ventilator, MRI
    total_count     INT          DEFAULT 0,
    in_use_count    INT          DEFAULT 0,
    date            DATE         NOT NULL,
    created_at      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- TABLE 3: utilization
-- Main processed table used for analysis
-- =============================================
CREATE TABLE IF NOT EXISTS utilization (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    department          VARCHAR(100) NOT NULL,
    beds_used           INT          DEFAULT 0,
    total_beds          INT          DEFAULT 0,
    nurses_on_duty      INT          DEFAULT 0,
    doctors_on_duty     INT          DEFAULT 0,
    utilization_pct     FLOAT        DEFAULT 0.0,
    source_file         VARCHAR(255),
    date                DATE         NOT NULL DEFAULT (CURDATE()),
    created_at          TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY unique_dept_date (department, date)
);

-- =============================================
-- Sample Data (for testing)
-- =============================================
INSERT IGNORE INTO utilization
  (department, beds_used, total_beds, nurses_on_duty, doctors_on_duty, utilization_pct, date)
VALUES
  ('ICU',          47, 50,  8, 3, 94.0, CURDATE()),
  ('General Ward', 156, 200, 20, 12, 78.0, CURDATE()),
  ('Emergency',    30, 49,  6, 4, 61.2, CURDATE()),
  ('Ward B',       60, 150, 10, 6, 40.0, CURDATE());

-- Confirm tables were created
SHOW TABLES;
