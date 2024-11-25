<?php
// Database connection parameters
$servername = "localhost";
$username = "root";
$password = "127956";
$database = "admin";

// Create connection
$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Function to sanitize input data
function sanitizeInput($data) {
    global $conn;
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $conn->real_escape_string($data);
}

// Registration process
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $username = sanitizeInput($_POST["username"]);
    $email = sanitizeInput($_POST["email"]);
    $password = password_hash($_POST["password"], PASSWORD_BCRYPT); // Hash the password

    $firstName = sanitizeInput($_POST["firstName"]);
    $lastName = sanitizeInput($_POST["lastName"]);
    $gender = sanitizeInput($_POST["gender"]);

    $phoneNumber = sanitizeInput($_POST["phoneNumber"]); // Updated for phone number
    $address = sanitizeInput($_POST["address"]); // Added for address

    // Server-side validation for email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $response = array("success" => false, "message" => "Invalid email format");
        echo json_encode($response);
        exit();
    }

    // Server-side validation for password strength
    $uppercase = preg_match('@[A-Z]@', $_POST["password"]);
    $lowercase = preg_match('@[a-z]@', $_POST["password"]);
    $number = preg_match('@[0-9]@', $_POST["password"]);

    if (!$uppercase || !$lowercase || !$number || strlen($_POST["password"]) < 8) {
        $response = array("success" => false, "message" => "Password should contain at least 8 characters, including uppercase, lowercase, and a number");
        echo json_encode($response);
        exit();
    }

    // Check if username or email already exists using prepared statement
    $checkQuery = "SELECT * FROM users_app WHERE username = ? OR email = ?";
    $checkStmt = $conn->prepare($checkQuery);

    if (!$checkStmt) {
        $response = array("success" => false, "message" => "Preparation failed: " . $conn->error);
        echo json_encode($response);
        exit();
    }

    $checkStmt->bind_param("ss", $username, $email);
    $checkStmt->execute();
    $checkResult = $checkStmt->get_result();

    if ($checkResult->num_rows > 0) {
        $response = array("success" => false, "message" => "Username or email already exists");
    } else {
        // Insert user data into the database using prepared statement
        $insertQuery = "INSERT INTO users_app (username, email, password, first_name, last_name, gender, phone_number, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        $insertStmt = $conn->prepare($insertQuery);

        if (!$insertStmt) {
            $response = array("success" => false, "message" => "Preparation failed: " . $conn->error);
            echo json_encode($response);
            exit();
        }

        $insertStmt->bind_param("ssssssss", $username, $email, $password, $firstName, $lastName, $gender, $phoneNumber, $address);

        if ($insertStmt->execute()) {
            $response = array("success" => true, "message" => "Registration successful");
        } else {
            $response = array("success" => false, "message" => "Error during registration: " . $insertStmt->error);
        }

        // Close the prepared statement for insert
        $insertStmt->close();
    }

    // Close the prepared statement for select
    $checkStmt->close();

    echo json_encode($response);

    // Close the database connection
    $conn->close();
} else {
    echo "Invalid request";
}
?>
