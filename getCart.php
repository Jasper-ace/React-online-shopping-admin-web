<?php
$servername = "localhost";  // Change this to your database server address
$username = "root"; // Change this to your database username
$password = "127956"; // Change this to your database password
$dbname = "admin"; // Change this to your database name
$serverAddress = 'http://192.168.1.18';

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get data from the request
$user_id = isset($_POST['user_id']) ? $_POST['user_id'] : (isset($_GET['user_id']) ? $_GET['user_id'] : null);

if (!$user_id) {
    // Return an error if user_id is not set
    echo json_encode(array('error' => 'user_id is not set'));
    exit;
}

// Fetch cart items for the specified user with product details and photo path
$sql = "SELECT cart.cart_id, cart.product_id, cart.quantity, cart.total_price,
               products.productName, products.price, products.stocks, products.total,
               product_photos.photo_path
        FROM cart
        INNER JOIN products ON cart.product_id = products.product_id
        LEFT JOIN product_photos ON cart.product_id = product_photos.product_id
        WHERE cart.user_id = '$user_id'";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $cart_items = array();

    // Fetch and store each cart item in an array
    while ($row = $result->fetch_assoc()) {
        // Construct the absolute URL for the image
        if ($row['photo_path'] !== null) {
            $row['image_url'] = str_replace($serverAddress . '/MyReactNative1', $serverAddress, $serverAddress . '/uploads/' . $row['photo_path']);
            $row = str_replace('uploads', 'admins/', $row);
            $row = str_replace('/C:xampphtdocsadminsstartbootstrap-sb-admin-2-gh-pages', '/startbootstrap-sb-admin-2-gh-pages/uploads/', $row);
            $row = str_replace('/uploads//admins//', '/uploads/', $row);

            // Remove the 'photo_path' key from the row
            unset($row['photo_path']);
        } else {
            $row['image_url'] = null;
        }

        $cart_items[] = $row;
    }

    // Return the cart items as JSON
    echo json_encode($cart_items);
} else {
    // Return an empty array if no cart items are found
    echo json_encode(array());
}

$conn->close();
?>
