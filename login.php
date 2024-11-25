<?php
// Database connection parameters
$host = 'localhost';
$username = 'root';
$password = '127956';
$database = 'admin';

// Establishing the connection
$connection = new mysqli($host, $username, $password, $database);

// Check for connection errors
if ($connection->connect_error) {
    die('Connection failed: ' . $connection->connect_error);
}

// Get the username and password from the request
$username = $_POST['username'];
$enteredPassword = $_POST['password'];

// Perform a prepared statement to fetch the hashed password
$stmt = $connection->prepare("SELECT password FROM users_app WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$stmt->bind_result($hashedPassword);
$stmt->fetch();
$stmt->close();

// Verify the entered password against the hashed password
if (password_verify($enteredPassword, $hashedPassword)) {
    // Password is correct
    echo 'Login successful';
} else {
    // Password is incorrect
    echo 'Login failed';
}

// Close the database connection
$connection->close();
?>
