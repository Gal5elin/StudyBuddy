<?php
include 'db.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

try {
    $stmt = $pdo->prepare('INSERT INTO user (username, email, password) VALUES (:username, :email, :password)');

    $stmt->bindParam(':username', $data['username']);

    $stmt->bindParam(':email', $data['email']);

    $hashedPassword = password_hash($data['password'], PASSWORD_BCRYPT);
    $stmt->bindParam(':password', $hashedPassword);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'User registered successfully.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'User registration failed.']);
    }
} catch (\PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
