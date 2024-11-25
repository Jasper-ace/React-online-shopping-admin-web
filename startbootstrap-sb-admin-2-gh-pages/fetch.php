<?php
while ($row = mysqli_fetch_assoc($result)) {
    echo "<tr>";

    $productName = isset($row['ProductName']) ? $row['ProductName'] : 'N/A';
    $size = isset($row['Size']) ? $row['Size'] : 'N/A';
    $stocks = isset($row['Stocks']) ? $row['Stocks'] : 'N/A';
    $price = isset($row['Price']) ? $row['Price'] : 'N/A';
    $total = isset($row['Total']) ? $row['Total'] : 'N/A';
    $productId = isset($row['product_id']) ? $row['product_id'] : '';

    $photoPath = 'uploads' . DIRECTORY_SEPARATOR . 'default-photo.jpg'; // Default photo path

    if ($db) {
        $photoQuery = "SELECT photo_path FROM product_photos WHERE product_id = $productId LIMIT 1";
        $photoResult = mysqli_query($db, $photoQuery);

        if ($photoResult) {
            $photoData = mysqli_fetch_assoc($photoResult);

            if (!empty($photoData['photo_path'])) {
                $photoFileName = basename($photoData['photo_path']);

                // Corrected photoFilePath
                $photoFilePath = 'uploads' . DIRECTORY_SEPARATOR . $photoFileName;

                if (file_exists($photoFilePath)) {
                    $photoPath = $photoFilePath;
                } else {
                    echo "<td>Error: Photo file not found for product ID {$productId}</td>";
                }
            }
        } else {
            echo "<td>Error: Unable to fetch photo data for product ID {$productId}</td>";
        }
    } else {
        echo "<td>Error: Database connection not available</td>";
    }

    // Display the product photo in the table
    echo "<td><img src='{$photoPath}' alt='Product Photo' style='width: 100px; height: 100px;'></td>";

    // Display the rest of the data in the table
    echo "<td>{$productName}</td>";
    echo "<td>{$size}</td>";
    echo "<td>{$stocks}</td>";
    echo "<td>{$price}</td>";
    echo "<td>{$total}</td>";

    // Action column with Update and Delete buttons
    echo "<td>";
    echo "<button class='btn btn-primary btn-update' data-product-id='{$productId}'><i class='fas fa-edit'></i> Update</button>";
    echo "&nbsp;";
    echo "&nbsp;";
    echo "<button class='btn btn-danger btn-delete' data-product-id='{$productId}'><i class='fas fa-trash-alt'></i> Delete</button>";
    echo "</td>";

    echo "</tr>";
}
?>
