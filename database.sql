-- =======================================================
-- Student Management System Database Schema
-- Database: student_db
-- =======================================================

CREATE DATABASE IF NOT EXISTS student_db;
USE student_db;

CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Optional sample records for testing
INSERT INTO students (student_id, name, department, email, phone) VALUES
('STU-101', 'Alice Johnson', 'Computer Science', 'alice.johnson@example.com', '9876543210'),
('STU-102', 'Bob Smith', 'Information Technology', 'bob.smith@example.com', '9123456780'),
('STU-103', 'Charlie Davis', 'Electronics', 'charlie.davis@example.com', '9988776655')
ON DUPLICATE KEY UPDATE student_id=student_id;
