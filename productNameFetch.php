<?php

// Include your database connection file
include_once('db_connection.php');

// Assuming you are using GET method to send user_id
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Validate and sanitize user_id
    $user_id = isset($_GET['user_id']) ? intval($_GET['user_id']) : 0;

    if ($user_id > 0) {
        // Prepare and execute the SQL query with a JOIN
        $sql = "SELECT Products.ProductName
                FROM OrderHistory
                INNER JOIN Products ON OrderHistory.product_id = Products.ProductName
                WHERE OrderHistory.user_id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $user_id);

        if ($stmt->execute()) {
            // Fetch product names
            $result = $stmt->get_result();
            $productNames = [];

            while ($row = $result->fetch_assoc()) {
                $productNames[] = $row['ProductName'];
            }

            // Return the result as JSON
            echo json_encode(array("success" => true, "productNames" => $productNames));
        } else {
            // Error executing query
            echo json_encode(array("success" => false, "message" => "Failed to fetch product names."));
        }

        $stmt->close();
    } else {
        // Invalid user_id
        echo json_encode(array("success" => false, "message" => "Invalid user_id."));
    }
} else {
    // Invalid request method
    echo json_encode(array("success" => false, "message" => "Invalid request method."));
}

// Close the database connection
$conn->close();

?>
