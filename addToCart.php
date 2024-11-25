<?php
// addToCart.php
header('Content-Type: application/json');

// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Assuming you have a database connection
$host = 'localhost';
$db = 'admin';
$user = 'root';
$pass = '127956';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Get data from the request
    $postData = file_get_contents("php://input");
    $requestData = json_decode($postData, true);

    $user_id = $requestData['user_id'] ?? null;
    $product_id = $requestData['product_id'] ?? null;
    $quantity = $requestData['quantity'] ?? null;
    $total_price = $requestData['total_price'] ?? null;

    // Validate user input (you can enhance this based on your requirements)
    if ($user_id === null || $product_id === null || $quantity === null || $total_price === null) {
        throw new Exception("Invalid input empty");
    }

    // Check if the product already exists in the cart for the given user and brand
    $stmt = $pdo->prepare("SELECT * FROM cart WHERE user_id = ? AND product_id = ?");
    $stmt->execute([$user_id, $product_id]);
    $existingProduct = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($existingProduct) {
        // If the product exists, update quantity and total price
        $newQuantity = $existingProduct['quantity'] + $quantity;
        $newTotalPrice = $existingProduct['total_price'] + $total_price;

        $stmt = $pdo->prepare("UPDATE cart SET quantity = ?, total_price = ? WHERE user_id = ? AND product_id = ?");
        $stmt->execute([$newQuantity, $newTotalPrice, $user_id, $product_id]);
    } else {
        // If the product doesn't exist, insert a new record
        $stmt = $pdo->prepare("INSERT INTO cart (user_id, product_id, quantity, total_price) VALUES (?, ?, ?, ?)");
        $stmt->execute([$user_id, $product_id, $quantity, $total_price]);
    }

    // Send a success response
    $response = ['success' => true, 'message' => 'Product added to cart successfully'];
    echo json_encode($response);
} catch (PDOException $e) {
    // Handle PDO exceptions and provide more detailed error information
    $response = ['success' => false, 'message' => 'Error adding product to cart: ' . $e->getMessage()];
    echo json_encode($response);
} catch (Exception $e) {
    // Handle other exceptions and provide more detailed error information
    $response = ['success' => false, 'message' => 'Error: ' . $e->getMessage()];
    echo json_encode($response);
}
?>
