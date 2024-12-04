<?php
ob_start();

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

include 'authMiddleware.php';


if (isset($GLOBALS['user'])) {
    echo json_encode([
        'success' => true,
        'user' => $GLOBALS['user'],
    ]);
} else {
    echo json_encode(['error' => 'User not authenticated']);
}

ob_end_flush();
?>
