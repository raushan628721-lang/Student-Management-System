<?php
header('Content-Type: application/json; charset=UTF-8');
require_once 'config.php';

$action = $_REQUEST['action'] ?? '';

// Helper to output JSON and exit
function jsonResponse($status, $message, $data = null) {
    echo json_encode([
        'status' => $status,
        'message' => $message,
        'data' => $data
    ]);
    exit;
}

switch ($action) {
    case 'fetch':
        // Fetch all student records
        $sql = "SELECT id, student_id, name, department, email, phone, created_at FROM students ORDER BY id DESC";
        $result = $conn->query($sql);
        $students = [];
        if ($result) {
            while ($row = $result->fetch_assoc()) {
                $students[] = $row;
            }
        }
        jsonResponse('success', 'Records fetched successfully', $students);
        break;

    case 'get':
        // Fetch single student by primary key ID
        $id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
        if (!$id) {
            jsonResponse('error', 'Invalid Student record ID');
        }

        $stmt = $conn->prepare("SELECT id, student_id, name, department, email, phone FROM students WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $res = $stmt->get_result();
        $student = $res->fetch_assoc();
        $stmt->close();

        if ($student) {
            jsonResponse('success', 'Student details loaded', $student);
        } else {
            jsonResponse('error', 'Student not found');
        }
        break;

    case 'insert':
        // Insert new student record
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            jsonResponse('error', 'Invalid request method');
        }

        $student_id = trim($_POST['student_id'] ?? '');
        $name = trim($_POST['name'] ?? '');
        $department = trim($_POST['department'] ?? '');
        $email = trim($_POST['email'] ?? '');
        $phone = trim($_POST['phone'] ?? '');

        // Validation
        if (empty($student_id) || empty($name) || empty($department) || empty($email) || empty($phone)) {
            jsonResponse('error', 'All fields are required.');
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            jsonResponse('error', 'Please enter a valid email address.');
        }

        if (!preg_match('/^[0-9+\-\s()]{7,15}$/', $phone)) {
            jsonResponse('error', 'Please enter a valid phone number (7-15 digits).');
        }

        // Check if Student ID already exists
        $checkStmt = $conn->prepare("SELECT id FROM students WHERE student_id = ?");
        $checkStmt->bind_param("s", $student_id);
        $checkStmt->execute();
        $checkResult = $checkStmt->get_result();
        if ($checkResult->num_rows > 0) {
            $checkStmt->close();
            jsonResponse('error', 'Student ID already exists! Please use a unique ID.');
        }
        $checkStmt->close();

        // Insert
        $stmt = $conn->prepare("INSERT INTO students (student_id, name, department, email, phone) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("sssss", $student_id, $name, $department, $email, $phone);

        if ($stmt->execute()) {
            jsonResponse('success', 'Student registered successfully!', ['insert_id' => $conn->insert_id]);
        } else {
            jsonResponse('error', 'Database error: ' . $stmt->error);
        }
        $stmt->close();
        break;

    case 'update':
        // Update student record
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            jsonResponse('error', 'Invalid request method');
        }

        $id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);
        $student_id = trim($_POST['student_id'] ?? '');
        $name = trim($_POST['name'] ?? '');
        $department = trim($_POST['department'] ?? '');
        $email = trim($_POST['email'] ?? '');
        $phone = trim($_POST['phone'] ?? '');

        if (!$id) {
            jsonResponse('error', 'Invalid record ID for update.');
        }

        if (empty($student_id) || empty($name) || empty($department) || empty($email) || empty($phone)) {
            jsonResponse('error', 'All fields are required.');
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            jsonResponse('error', 'Please enter a valid email address.');
        }

        if (!preg_match('/^[0-9+\-\s()]{7,15}$/', $phone)) {
            jsonResponse('error', 'Please enter a valid phone number (7-15 digits).');
        }

        // Check if Student ID is used by another record
        $checkStmt = $conn->prepare("SELECT id FROM students WHERE student_id = ? AND id != ?");
        $checkStmt->bind_param("si", $student_id, $id);
        $checkStmt->execute();
        if ($checkStmt->get_result()->num_rows > 0) {
            $checkStmt->close();
            jsonResponse('error', 'This Student ID is already assigned to another student.');
        }
        $checkStmt->close();

        // Update
        $stmt = $conn->prepare("UPDATE students SET student_id = ?, name = ?, department = ?, email = ?, phone = ? WHERE id = ?");
        $stmt->bind_param("sssssi", $student_id, $name, $department, $email, $phone, $id);

        if ($stmt->execute()) {
            jsonResponse('success', 'Student record updated successfully!');
        } else {
            jsonResponse('error', 'Database error: ' . $stmt->error);
        }
        $stmt->close();
        break;

    case 'delete':
        // Delete student record
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            jsonResponse('error', 'Invalid request method');
        }

        $id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);
        if (!$id) {
            jsonResponse('error', 'Invalid student ID.');
        }

        $stmt = $conn->prepare("DELETE FROM students WHERE id = ?");
        $stmt->bind_param("i", $id);
        if ($stmt->execute()) {
            if ($stmt->affected_rows > 0) {
                jsonResponse('success', 'Student record deleted successfully.');
            } else {
                jsonResponse('error', 'Student record not found or already deleted.');
            }
        } else {
            jsonResponse('error', 'Database error: ' . $stmt->error);
        }
        $stmt->close();
        break;

    default:
        jsonResponse('error', 'Unknown action specified.');
        break;
}

$conn->close();
?>
