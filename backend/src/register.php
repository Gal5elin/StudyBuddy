<?php
include 'db.php';

if (!isset($pdo)) {
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

try {
    $checkStmt = $pdo->prepare('SELECT COUNT(*) FROM user WHERE username = :username OR email = :email');

    $checkStmt->bindParam(':username', $data['username']);
    $checkStmt->bindParam(':email', $data['email']);

    $checkStmt->execute();

    $count = $checkStmt->fetchColumn();

    if ($count > 0) {
        echo json_encode(['error' => 'Username or email already exists']);
        exit;
    }

    $stmt = $pdo->prepare('INSERT INTO user (username, email, password) VALUES (:username, :email, :password)');

    $stmt->bindParam(':username', $data['username']);
    $stmt->bindParam(':email', $data['email']);

    $hashedPassword = password_hash($data['password'], PASSWORD_BCRYPT);
    $stmt->bindParam(':password', $hashedPassword);

    if ($stmt->execute()) {
        $lastId = $pdo->lastInsertId();

        $userStmt = $pdo->prepare('SELECT id, username, email FROM user WHERE id = :id');
        $userStmt->bindParam(':id', $lastId);
        $userStmt->execute();
        $user = $userStmt->fetch(PDO::FETCH_ASSOC);

        echo json_encode(['success' => true, 'user' => $user]);
    } else {
        echo json_encode(['success' => false, 'message' => 'User registration failed.']);
    }
} catch (\PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
