<?php
$servername = "localhost";
$database = "admin";
$username = "root";
$password = "127956";

// Create connection
$db = new mysqli($servername, $username, $password, $database);

// Check connection
if ($db->connect_error) {
    die("Connection failed: " . $db->connect_error);
}
?>
