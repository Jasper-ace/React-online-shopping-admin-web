<?php
// Database configuration (replace with your actual database credentials)
$servername = "localhost";
$username = "root";
$password = "127956";
$dbname = "admin";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get data from the request body
$data = json_decode(file_get_contents("php://input"));

// Validate and sanitize input
$user_id = mysqli_real_escape_string($conn, $data->user_id);
$product_id = mysqli_real_escape_string($conn, $data->product_id);

// Remove product from the cart
$sql = "DELETE FROM cart WHERE user_id = '$user_id' AND product_id = '$product_id'";

if ($conn->query($sql) === TRUE) {
    echo json_encode(array("status" => "success"));
} else {
    echo json_encode(array("status" => "error", "message" => "Error removing product from cart: " . $conn->error));
}

// Close the connection
$conn->close();
?>
