<?php

$servername = "localhost";
$username = "root";
$password = "127956";
$database = "admin";

// Create connection
$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

?>
