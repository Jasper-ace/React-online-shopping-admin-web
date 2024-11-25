<?php
// fetchNumericUserId.php

// Assuming you have a database connection
$host = 'localhost';
$db = 'admin';
$user = 'root';
$pass = '127956';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Get username from the request
    $username = $_GET['username'];

    // Validate input
    if (empty($username)) {
        throw new Exception("Invalid input data");
    }

    // Fetch numeric user ID based on username
    $stmt = $pdo->prepare("SELECT id FROM users_app WHERE username = ?");
    $stmt->execute([$username]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$row) {
        throw new Exception("User not found");
    }

    $numeric_user_id = $row['id'];

    // Send the numeric user ID in the response
    $response = ['numericUserId' => $numeric_user_id];
    echo json_encode($response);
} catch (PDOException $e) {
    // Handle PDO exceptions and provide more detailed error information
    $response = ['error' => 'Error fetching numeric user ID: ' . $e->getMessage()];
    echo json_encode($response);
} catch (Exception $e) {
    // Handle other exceptions
    $response = ['error' => 'Error: ' . $e->getMessage()];
    echo json_encode($response);
}
?>
