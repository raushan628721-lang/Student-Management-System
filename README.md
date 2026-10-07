# 🎓 Student Management System (CRUD with AJAX)

A full-stack, responsive Student Management System built using **HTML5, CSS3, JavaScript (ES6), PHP, and MySQL**. The system incorporates client-side form validation, asynchronous AJAX/JSON communications for smooth CRUD operations without page reload, and an enterprise-grade UI design.

---

## 📌 Project Overview
The Student Management System allows educational institutions or lab administrators to manage student records efficiently. It provides real-time client-side validation, seamless data interactions with a MySQL backend via PHP, and dynamic table updates without refreshing the webpage.

---

## 🚀 Key Features

### 1. 📝 Student Registration & Update Form
- Input fields: **Student ID**, **Full Name**, **Department**, **Email Address**, and **Phone Number**.
- Dual-mode form: automatically switches between **New Registration** and **Record Modification (Edit mode)** with smooth scrolling.

### 2. 🛡️ Client-Side & Server-Side Validation
- **Required Fields**: Ensures no mandatory field is left blank.
- **Email Validation**: Validates RFC standard email syntax using regular expressions (`^[^\s@]+@[^\s@]+\.[^\s@]+$`).
- **Phone Number Validation**: Verifies phone format (7 to 15 digits).
- **Unique Student ID**: Prevents duplicate student ID registrations.
- **Real-Time Visual Alerts**: Displays intuitive inline warnings and red/green field border indicators.

### 3. ⚡ Complete Asynchronous AJAX CRUD Operations
- **Create (Insert)**: Submits student details via AJAX `POST` to `api.php` and dynamically prepends the new record.
- **Read (Display)**: Fetches existing student data in JSON format on page load without reloads.
- **Update (Edit)**: Fetches student data by ID into the form, allows editing, and saves changes via AJAX `POST`.
- **Delete**: Prompts a safety confirmation modal before triggering an AJAX deletion and instantly removing the record row.

### 4. 📊 Live Statistics & Analytics Bar
- Displays **Total Enrolled Students**.
- Counts active **Unique Departments**.
- Highlights the **Latest Student Entry ID**.
- Shows real-time **AJAX Engine Status**.

### 5. 🔍 Real-Time Search & Instant Filtering
- Client-side search bar filters students dynamically by name, ID, department, email, or phone number as you type.

### 6. 🎨 Enterprise UI & Rich Styling
- Color-coded department badges (Computer Science, IT, Electronics, Mechanical, Civil, Business).
- Generated gradient avatar badges with student initials.
- Animated glassmorphic Toast notification system (Success, Error, Info).

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | HTML5 Semantic Markup | Layout, structural components, and form elements |
| **Styling** | Vanilla CSS3 (Custom Design System) | Glassmorphism, animations, responsive grid, color tokens |
| **Client Scripting** | JavaScript (ES6 & Fetch API) | Form validation, DOM updates, AJAX requests |
| **Backend API** | PHP 7.4+ / 8.x | REST-like JSON API endpoints, prepared statements |
| **Database** | MySQL / MariaDB (InnoDB) | Relational storage for student records |

---

## 🗄️ Database Architecture

### Database Name: `student_db`
### Table: `students`

| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `INT` | `PRIMARY KEY, AUTO_INCREMENT` | Unique internal database ID |
| `student_id` | `VARCHAR(50)` | `NOT NULL, UNIQUE` | Academic student identifier (e.g. STU-101) |
| `name` | `VARCHAR(100)` | `NOT NULL` | Full name of the student |
| `department` | `VARCHAR(100)` | `NOT NULL` | Department/Branch of study |
| `email` | `VARCHAR(150)` | `NOT NULL` | Contact email address |
| `phone` | `VARCHAR(20)` | `NOT NULL` | Contact phone number |
| `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Registration timestamp |

---

## ⚙️ How to Run the Project

1. **Install Local Web Server**: Ensure **XAMPP**, **WAMP**, or **Laragon** is installed.
2. **Copy Project Folder**: Place the `LAB 5 EMPLOYEE` folder inside `htdocs` (e.g., `C:/xampp/htdocs/LAB 5 EMPLOYEE`).
3. **Start Services**: Start **Apache** and **MySQL** modules from your control panel.
4. **Access in Browser**:
   ```
   http://localhost/LAB%205%20EMPLOYEE/index.php
   ```
   *(The database and table will automatically initialize upon first access).*
