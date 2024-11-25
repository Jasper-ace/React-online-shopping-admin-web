<?php

// Database connection parameters
$host = "localhost";
$dbname = "admin";
$user = "root";
$password = "127956";

// Add your server address here
$serverAddress = 'http://192.168.1.18/MyReactNative1';

// Establish database connection
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}

// Fetch products with associated photos
try {
    $stmt = $pdo->query('SELECT p.product_id, p.ProductName, p.price, p.stocks, ph.photo_id, ph.photo_path
                         FROM products p
                         LEFT JOIN product_photos ph ON p.product_id = ph.product_id');

    $products = array();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $productId = $row['product_id'];

        // Check if the product is already in the products array
        if (!isset($products[$productId])) {
            $products[$productId] = array(
                'ProductId' => $productId,
                'ProductName' => $row['ProductName'],
                'Price' => $row['price'],
                'Stocks' => $row['stocks'],
                'Images' => array(),
            );
        }

        // Add the photo information to the product's 'Images' array
        if ($row['photo_id'] !== null) {
            // Construct the absolute URL for the image
            // Construct the absolute URL for the image
            $imageUrl = $serverAddress . '/uploads/' . $row['photo_path'];

            // Remove the specified prefix from ImageUrl
            $imageUrl = str_replace($serverAddress . '/uploads/', '', $imageUrl);
            // Remove the "C:xampphtdocs" prefix from ImageUrl
            $imageUrl = str_replace('C:xampphtdocs', '', $imageUrl);
            $imageUrl = str_replace('admins', 'http://192.168.1.18/admins/', $imageUrl);


            // Corrected typo here
            $products[$productId]['Images'][] = array(
                'PhotoId' => $row['photo_id'],
                'ImageUrl' => $imageUrl,
            );

        }
    }

    // Convert the associative array to a numeric array
    $products = array_values($products);

    // Encode the data as JSON and echo it
    echo json_encode($products, JSON_UNESCAPED_SLASHES);
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}

// Close the database connection
$pdo = null;

?>