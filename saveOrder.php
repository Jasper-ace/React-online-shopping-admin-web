<?php

// Include your database connection file
include_once('db_connection.php');

// Assuming you are using POST method to send data
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the JSON data from the request body
    $data = json_decode(file_get_contents('php://input'), true);

    // Validate and sanitize data
    $user_id = isset($data['user_id']) ? intval($data['user_id']) : 0;
    $products = isset($data['products']) ? $data['products'] : [];
    $total_amount = isset($data['total_amount']) ? floatval($data['total_amount']) : 0.00;

    if ($user_id > 0 && !empty($products) && $total_amount > 0.00) {
        // Start a transaction
        $conn->begin_transaction();

        try {
            // Insert order into orders table
            $orderSql = "INSERT INTO orders (user_id, total_amount, order_date) VALUES (?, ?, NOW())";
            $orderStmt = $conn->prepare($orderSql);
            $orderStmt->bind_param("id", $user_id, $total_amount);

            if (!$orderStmt->execute()) {
                throw new Exception("Error inserting order: " . $orderStmt->error);
            }

            // Commit the transaction
            $conn->commit();

            // Fetch the last inserted order ID
            $order_id = $conn->insert_id;

            // Insert each product into orderhistory table
            $productSql = "INSERT INTO orderhistory (user_id, order_id, product_id, quantity, total_price, order_date) VALUES (?, ?, ?, ?, ?, NOW())";
            $productStmt = $conn->prepare($productSql);

            foreach ($products as $product) {
                $product_id = $product['product_id'];
                $quantity = $product['quantity'];
                $total_price = $product['total_price'];

                // Bind parameters inside the loop
                $productStmt->bind_param("iiisd", $user_id, $order_id, $product_id, $quantity, $total_price);

                if (!$productStmt->execute()) {
                    throw new Exception("Error inserting product: " . $productStmt->error);
                }
            }

            // Order successfully saved
            echo json_encode(array("success" => true, "message" => "Order saved successfully."));
        } catch (Exception $e) {
            // Rollback the transaction on error
            $conn->rollback();

            // Error saving order
            echo json_encode(array("success" => false, "message" => "Failed to save order. " . $e->getMessage()));
        } finally {
            // Close the prepared statements
            $orderStmt->close();
            $productStmt->close();
        }
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
