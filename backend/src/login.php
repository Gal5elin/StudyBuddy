<?php
include 'db.php';
require_once '/var/www/html/vendor/autoload.php';

use Firebase\JWT\JWT;

if (!isset($pdo)) {
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

try {
    $userExists = $pdo->prepare('SELECT * FROM user WHERE username = :username');
    $userExists->bindParam(':username', $data['username']);
    $userExists->execute();

    if ($userExists->rowCount() > 0) {
        $user = $userExists->fetch(PDO::FETCH_ASSOC);
        if (password_verify($data['password'], $user['password'])) {
            $secretKey = "b1e8a6b381845e4feca95cd76cb5823436772ea4a120254df4c346b927b24513";
            $issuedAt = time();
            $expirationTime = $issuedAt + 3600;
            $payload = [
                'iat' => $issuedAt,
                'exp' => $expirationTime,
                'username' => $user['username'],
                'userId' => $user['id'],
                'profile_pic' => $user['profile_pic']
            ];

            $jwt = JWT::encode($payload, $secretKey, 'HS256');

            echo json_encode(['success' => true, 'token' => $jwt, 'user' => $user]);
        } else {
            echo json_encode(['error' => 'Invalid password']);
        }
    } else {
        echo json_encode(['error' => 'User does not exist']);
    }

} catch (\PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
