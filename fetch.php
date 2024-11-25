<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
// Replace these variables with your database connection details
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

// Get the username from the client side (replace with your actual storage mechanism)
$targetUsername = isset($_GET['username']) ? $_GET['username'] : null;

// Validate and sanitize the input to prevent SQL injection
$targetUsername = mysqli_real_escape_string($conn, $targetUsername);

// Check if a username is provided
if ($targetUsername !== null) {
    // SQL query to fetch user data for the specified username
    $sql = "SELECT * FROM users_app WHERE username = '$targetUsername'";

    $result = $conn->query($sql);

    if ($result) {
        if ($result->num_rows > 0) {
            // Fetch and return user data as JSON
            $row = $result->fetch_assoc();
            echo json_encode($row);
        } else {
            echo json_encode(array("error" => "User not found"));
        }
    } else {
        echo json_encode(array("error" => "Query failed: " . $conn->error));
    }
} else {
    echo json_encode(array("error" => "No username provided"));
}

$conn->close();

?>
