<?php
include 'db.php';

if (!isset($pdo)) {
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$data = $_POST;

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

        if (isset($_FILES['profile_pic'])) {
            $profilePic = $_FILES['profile_pic'];
            $uploadDir = 'uploads/profile_pics/';
            $profilePicPath = $uploadDir . $lastId . '_' . basename($profilePic['name']);
        
            if (move_uploaded_file($profilePic['tmp_name'], $profilePicPath)) {
                $updateStmt = $pdo->prepare('UPDATE user SET profile_pic = :profile_pic WHERE id = :id');
                $updateStmt->bindParam(':profile_pic', $profilePicPath);
                $updateStmt->bindParam(':id', $lastId);
                $updateStmt->execute();
        
                $user['profile_pic'] = $profilePicPath;
            } else {
                echo json_encode(['success' => false, 'message' => 'Profile picture upload failed.']);
                exit;
            }
        }        
        

        echo json_encode(['success' => true, 'user' => $user]);
    } else {
        echo json_encode(['success' => false, 'message' => 'User registration failed.']);
    }
} catch (\PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
