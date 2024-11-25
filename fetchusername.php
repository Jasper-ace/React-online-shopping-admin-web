<?php
// get_user_id.php

// Assuming you have a database connection
$servername = "localhost";
$username = "root";
$password = "127956";
$dbname = "admin";

$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get username from the query parameters
$username = $_GET['username'];

// Query to fetch user_id based on the username
$sql = "SELECT id FROM users_app WHERE username = '$username'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // Fetch user_id from the result
    $row = $result->fetch_assoc();
    $user_id = $row['id'];

    // Return user_id as JSON response
    header('Content-Type: application/json');
    echo json_encode(array('userId' => $user_id));
} else {
    // If username is not found, return an error response
    header('Content-Type: application/json');
    echo json_encode(array('error' => 'Username not found'));
}

// Close the database connection
$conn->close();
?>
