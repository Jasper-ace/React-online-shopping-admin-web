<?php

// Include your database connection file
include_once('db_connection.php');

// Assuming you are using POST method to send data
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the JSON data from the request body
    $data = json_decode(file_get_contents('php://input'), true);

    // Validate and sanitize data
    $product_id = isset($data['product_id']) ? intval($data['product_id']) : 0;
    $quantity = isset($data['quantity']) ? intval($data['quantity']) : 0;

    if ($product_id > 0 && $quantity > 0) {
        // Update product stock in your database
        $updateSql = "UPDATE products SET stock = stock - ? WHERE product_id = ?";
        $updateStmt = $conn->prepare($updateSql);
        $updateStmt->bind_param("ii", $quantity, $product_id);

        if ($updateStmt->execute()) {
            echo json_encode(array("success" => true, "message" => "Product stock updated successfully."));
        } else {
            echo json_encode(array("success" => false, "message" => "Error updating product stock: " . $updateStmt->error));
        }

        // Close the prepared statement
        $updateStmt->close();
    } else {
        // Invalid data received
        echo json_encode(array("success" => false, "message" => "Invalid data received."));
    }
} else {
    // Invalid request method
    echo json_encode(array("success" => false, "message" => "Invalid request method."));
}

// Close the database connection
$conn->close();

?>
