<?php
// logout.php

// Start the session
session_start();

// Destroy the session data
session_destroy();

// Send a response indicating successful logout
echo json_encode(['success' => true]);
?>
