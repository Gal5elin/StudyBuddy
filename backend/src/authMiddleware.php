<?php
include 'vendor/firebase/php-jwt/src/JWT.php';

use Firebase\JWT\JWT;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

$headers = apache_request_headers();

if (isset($headers['Authorization'])) {
    $token = str_replace("Bearer ", "", $headers['Authorization']);

    try {
        $decoded = JWT::decode($token, "b1e8a6b381845e4feca95cd76cb5823436772ea4a120254df4c346b927b24513", ['HS256']);
        // You can access decoded information if needed:
        // $decoded->username, $decoded->userId, etc.
    } catch (Exception $e) {
        echo json_encode(['error' => 'Unauthorized access']);
        http_response_code(401);
        exit;
    }
} else {
    echo json_encode(['error' => 'Token not provided']);
    http_response_code(401);
    exit;
}
?>
