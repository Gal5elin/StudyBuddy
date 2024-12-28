<?php
ob_start();

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '/var/www/html/vendor/autoload.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$headers = getallheaders();

if (isset($headers['Authorization'])) {
    $token = str_replace("Bearer ", "", $headers['Authorization']);

    try {
        $decoded = JWT::decode($token, new Key("b1e8a6b381845e4feca95cd76cb5823436772ea4a120254df4c346b927b24513", 'HS256'));
        $GLOBALS['user'] = (object) $decoded;
    } catch (Exception $e) {
        error_log("JWT Decoding failed: " . $e->getMessage());
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized access: ' . $e->getMessage()]);
        exit;
    }
} else {
    http_response_code(401);
    echo json_encode(['error' => 'Token not provided']);
    exit;
}

ob_end_flush();
?>
