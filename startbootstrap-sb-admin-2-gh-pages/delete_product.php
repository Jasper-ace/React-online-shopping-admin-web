<?php
$servername = "localhost";
$database = "admin";
$username = "root";
$password = "127956";

$conn = new mysqli($servername, $username, $password, $database);

// Check for connection errors
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['product_id']) && is_numeric($_POST['product_id'])) {
    $product_id = intval($_POST['product_id']);

    // Check if there are related records in the cart table
    $checkCartSQL = "SELECT COUNT(*) FROM cart WHERE product_id = ?";
    $checkCartStmt = $conn->prepare($checkCartSQL);

    if (!$checkCartStmt) {
        die("Cart preparation failed: " . $conn->error);
    }

    $checkCartStmt->bind_param("i", $product_id);
    $checkCartStmt->execute();
    $checkCartStmt->bind_result($cartCount);
    $checkCartStmt->fetch();
    $checkCartStmt->close();

    // Check if there are related records in the orderhistory table
    $checkOrderHistorySQL = "SELECT COUNT(*) FROM orderhistory WHERE product_id = ?";
    $checkOrderHistoryStmt = $conn->prepare($checkOrderHistorySQL);

    if (!$checkOrderHistoryStmt) {
        die("OrderHistory preparation failed: " . $conn->error);
    }

    $checkOrderHistoryStmt->bind_param("i", $product_id);
    $checkOrderHistoryStmt->execute();
    $checkOrderHistoryStmt->bind_result($orderHistoryCount);
    $checkOrderHistoryStmt->fetch();
    $checkOrderHistoryStmt->close();

    if ($cartCount > 0 || $orderHistoryCount > 0) {
        // Debugging output
        echo "DEBUG: Found $cartCount cart entries and $orderHistoryCount order history entries for product ID $product_id. Deleting associated records...";

        // Delete the cart entries associated with the product
        $deleteCartSQL = "DELETE FROM cart WHERE product_id = ?";
        $deleteCartStmt = $conn->prepare($deleteCartSQL);

        if (!$deleteCartStmt) {
            die("Cart deletion preparation failed: " . $conn->error);
        }

        $deleteCartStmt->bind_param("i", $product_id);

        if ($deleteCartStmt->execute()) {
            echo "Cart entries deleted successfully. ";
        } else {
            echo "Error deleting cart entries: " . $deleteCartStmt->error;
        }

        // Close the prepared statement for cart deletion
        $deleteCartStmt->close();

        // Delete the order history entries associated with the product
        $deleteOrderHistorySQL = "DELETE FROM orderhistory WHERE product_id = ?";
        $deleteOrderHistoryStmt = $conn->prepare($deleteOrderHistorySQL);

        if (!$deleteOrderHistoryStmt) {
            die("OrderHistory deletion preparation failed: " . $conn->error);
        }

        $deleteOrderHistoryStmt->bind_param("i", $product_id);

        if ($deleteOrderHistoryStmt->execute()) {
            echo "Order history entries deleted successfully. ";
        } else {
            echo "Error deleting order history entries: " . $deleteOrderHistoryStmt->error;
        }

        // Close the prepared statement for order history deletion
        $deleteOrderHistoryStmt->close();
    }

    // Delete the record from the products table
    $deleteProductSQL = "DELETE FROM products WHERE product_id = ?";
    $deleteProductStmt = $conn->prepare($deleteProductSQL);

    if (!$deleteProductStmt) {
        die("Product deletion preparation failed: " . $conn->error);
    }

    $deleteProductStmt->bind_param("i", $product_id);

    if ($deleteProductStmt->execute()) {
        echo "Product deleted successfully";
    } else {
        echo "Error deleting product: " . $deleteProductStmt->error;
    }

    // Close the prepared statement for product deletion
    $deleteProductStmt->close();
} else {
    echo "Invalid request";
}

// Check for database errors
if ($conn->errno) {
    echo "Database error: " . $conn->error;
}

// Close the database connection
$conn->close();
?>
