<?php


include_once('db_connection.php');


if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    $user_id = isset($_GET['user_id']) ? intval($_GET['user_id']) : 0;

    if ($user_id > 0) {
        try {

            $orderHistorySql = "SELECT OH.order_id, OH.quantity, OH.total_price, OH.order_date, P.ProductName
                FROM orderhistory OH
                INNER JOIN products P ON OH.product_id = P.product_id
                WHERE OH.user_id = ?";
            $orderHistoryStmt = $conn->prepare($orderHistorySql);
            $orderHistoryStmt->bind_param("i", $user_id);
            $orderHistoryStmt->execute();
            $result = $orderHistoryStmt->get_result();


            $orderHistory = [];
            while ($row = $result->fetch_assoc()) {
                $orderHistory[] = $row;
            }


            header('Content-Type: application/json');
            echo json_encode(array("success" => true, "orderHistory" => $orderHistory));
        } catch (Exception $e) {

            header('Content-Type: application/json');
            echo json_encode(array("success" => false, "message" => "Failed to fetch order history. " . $e->getMessage()));
        } finally {

            $orderHistoryStmt->close();
        }
    } else {

        header('Content-Type: application/json');
        echo json_encode(array("success" => false, "message" => "Invalid user_id."));
    }
} else {

    header('Content-Type: application/json');
    echo json_encode(array("success" => false, "message" => "Invalid request method."));
}


$conn->close();

?>
