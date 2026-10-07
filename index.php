<?php
require_once 'config.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Management System</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <!-- Toast Notification Container -->
    <div id="toast-container"></div>

    <div class="container">
        <!-- Hero Header -->
        <header class="hero-header">
            <div class="hero-content">
                <span class="hero-tag">🎓 Enterprise Edition</span>
                <h1>
                    <span>Student Management System</span>
                </h1>
                <p>Complete academic portal with PHP, MySQL, real-time JavaScript validation & asynchronous AJAX CRUD operations.</p>
            </div>
        </header>

        <!-- Stats Counter Cards -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon indigo">👨‍🎓</div>
                <div class="stat-info">
                    <h3>Total Students</h3>
                    <div class="stat-number" id="totalStudentsCount">0</div>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon emerald">🏢</div>
                <div class="stat-info">
                    <h3>Departments</h3>
                    <div class="stat-number" id="totalDeptsCount">0</div>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon sky">🆔</div>
                <div class="stat-info">
                    <h3>Latest Entry</h3>
                    <div class="stat-number" id="latestStudentId" style="font-size: 1.25rem;">-</div>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon purple">⚡</div>
                <div class="stat-info">
                    <h3>AJAX Engine</h3>
                    <div class="stat-number" style="font-size: 1.15rem; color: #10b981;">Online</div>
                </div>
            </div>
        </div>

        <!-- Main Layout: Form + Records Table -->
        <div class="main-layout">
            
            <!-- Registration / Edit Form -->
            <section class="card">
                <div class="card-header">
                    <h2 id="formTitle">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
                        Register New Student
                    </h2>
                    <span class="header-badge">Form</span>
                </div>
                
                <div class="card-body">
                    <form id="studentForm" novalidate>
                        <input type="hidden" id="recordId" name="id" value="">

                        <!-- Student ID -->
                        <div class="form-group">
                            <label class="form-label" for="student_id">
                                <span>Student ID</span>
                                <span class="req">* Required</span>
                            </label>
                            <div class="input-wrapper">
                                <span class="input-icon">🆔</span>
                                <input type="text" id="student_id" name="student_id" class="form-input" placeholder="e.g. STU-105" required>
                            </div>
                            <div class="field-error" id="student_idError"></div>
                        </div>

                        <!-- Name -->
                        <div class="form-group">
                            <label class="form-label" for="name">
                                <span>Full Name</span>
                                <span class="req">* Required</span>
                            </label>
                            <div class="input-wrapper">
                                <span class="input-icon">👤</span>
                                <input type="text" id="name" name="name" class="form-input" placeholder="e.g. Alexander Vance" required>
                            </div>
                            <div class="field-error" id="nameError"></div>
                        </div>

                        <!-- Department -->
                        <div class="form-group">
                            <label class="form-label" for="department">
                                <span>Department</span>
                                <span class="req">* Required</span>
                            </label>
                            <div class="input-wrapper">
                                <span class="input-icon">🏛️</span>
                                <input type="text" id="department" name="department" class="form-input" placeholder="e.g. Computer Science" list="deptList" required>
                            </div>
                            <datalist id="deptList">
                                <option value="Computer Science">
                                <option value="Information Technology">
                                <option value="Electronics & Communication">
                                <option value="Mechanical Engineering">
                                <option value="Civil Engineering">
                                <option value="Business Administration">
                            </datalist>
                            <div class="field-error" id="departmentError"></div>
                        </div>

                        <!-- Email -->
                        <div class="form-group">
                            <label class="form-label" for="email">
                                <span>Email Address</span>
                                <span class="req">* Required</span>
                            </label>
                            <div class="input-wrapper">
                                <span class="input-icon">✉️</span>
                                <input type="email" id="email" name="email" class="form-input" placeholder="e.g. student@university.edu" required>
                            </div>
                            <div class="field-error" id="emailError"></div>
                        </div>

                        <!-- Phone -->
                        <div class="form-group">
                            <label class="form-label" for="phone">
                                <span>Phone Number</span>
                                <span class="req">* Required</span>
                            </label>
                            <div class="input-wrapper">
                                <span class="input-icon">📞</span>
                                <input type="tel" id="phone" name="phone" class="form-input" placeholder="e.g. 9876543210" required>
                            </div>
                            <div class="field-error" id="phoneError"></div>
                        </div>

                        <!-- Action Buttons -->
                        <div class="form-actions">
                            <button type="submit" id="submitBtn" class="btn btn-primary">
                                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                                Register Student
                            </button>
                            <button type="button" id="cancelBtn" class="btn btn-secondary" style="display: none;">Cancel</button>
                        </div>
                    </form>
                </div>
            </section>

            <!-- Student Records Table Card -->
            <section class="card">
                <div class="card-header">
                    <h2>
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                        Student Directory
                    </h2>
                    <span class="header-badge" id="tableBadgeCount">0 Enrolled</span>
                </div>

                <!-- Table Search Toolbar -->
                <div class="table-toolbar">
                    <div class="search-box">
                        <svg class="search-icon" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        <input type="text" id="searchInput" class="search-input" placeholder="Search by name, ID, department...">
                    </div>
                </div>

                <div class="table-responsive">
                    <table class="student-table">
                        <thead>
                            <tr>
                                <th>Student ID</th>
                                <th>Student Profile</th>
                                <th>Department</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="studentTableBody">
                            <tr>
                                <td colspan="6" class="empty-placeholder">
                                    <div class="empty-icon">⏳</div>
                                    <h4>Loading student records...</h4>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

        </div>
    </div>

    <!-- Scripts -->
    <script src="script.js"></script>
</body>
</html>
