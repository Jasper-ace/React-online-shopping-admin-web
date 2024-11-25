<?php
$servername = "localhost";
$database = "admin";
$username = "root";
$password = "127956";

// Create connection
$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get data from POST request
    $productId = $_POST['product_id'];
    $updatedProductName = $_POST['updatedProductName'];
    $updatedPrice = $_POST['updatedPrice'];
    $updatedSize = $_POST['updatedSize'];
    $updatedStocks = $_POST['updatedStocks'];
    $updatedTotal = $_POST['updatedTotal'];  // Add this line to get the calculated total

    // Update the record in the database
    $updateSQL = "UPDATE products SET ProductName = ?, Price = ?, Size = ?, Stocks = ?, Total = ? WHERE product_id = ?";
    $stmt = $conn->prepare($updateSQL);
    $stmt->bind_param("ssssii", $updatedProductName, $updatedPrice, $updatedSize, $updatedStocks, $updatedTotal, $productId);

    if ($stmt->execute()) {
        echo "Product updated successfully";
    } else {
        echo "Error updating product: " . $stmt->error;
    }

    $stmt->close();
}

$conn->close();
?>
