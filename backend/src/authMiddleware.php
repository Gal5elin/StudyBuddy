<?php
// Start output buffering
ob_start();

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '/var/www/html/vendor/autoload.php';  // Ensure path is correct
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

// Get the Authorization header
$headers = getallheaders();  // This works universally (Apache & Nginx)

if (isset($headers['Authorization'])) {
    // Extract the token
    $token = str_replace("Bearer ", "", $headers['Authorization']);

    try {
        // Decode the JWT using the secret key and algorithm
        $decoded = JWT::decode($token, new Key("b1e8a6b381845e4feca95cd76cb5823436772ea4a120254df4c346b927b24513", 'HS256'));
        // Store decoded user information in global variable
        $GLOBALS['user'] = (object) $decoded;  // Cast to object for easy access (userId, username, etc.)
    } catch (Exception $e) {
        // Log the error for debugging
        error_log("JWT Decoding failed: " . $e->getMessage());
        // Respond with Unauthorized error
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized access: ' . $e->getMessage()]);
        exit;
    }
} else {
    // Token not provided
    http_response_code(401);
    echo json_encode(['error' => 'Token not provided']);
    exit;
}

ob_end_flush();
?>
