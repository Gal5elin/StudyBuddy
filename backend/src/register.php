<?php
include 'db.php';

if (!isset($pdo)) {
    respondWithError('Database connection failed');
}

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$data = $_POST;

try {
    if (userExists($pdo, $data['username'], $data['email'])) {
        respondWithError('Username or email already exists');
    }

    $userId = registerUser($pdo, $data['username'], $data['email'], $data['password']);

    $user = fetchUserById($pdo, $userId);

    if (isset($_FILES['profile_pic'])) {
        $uploadSuccess = uploadProfilePic($pdo, $userId, $_FILES['profile_pic']);
        if (!$uploadSuccess) {
            respondWithError('Profile picture upload failed.');
        }
        $user['profile_pic'] = getProfilePicPath($userId, $_FILES['profile_pic']['name']);
    }

    echo json_encode(['success' => true, 'user' => $user]);
} catch (PDOException $e) {
    respondWithError($e->getMessage());
}


function userExists($pdo, $username, $email) {
    $stmt = $pdo->prepare('SELECT COUNT(*) FROM user WHERE username = :username OR email = :email');
    $stmt->execute([':username' => $username, ':email' => $email]);
    return $stmt->fetchColumn() > 0;
}

function registerUser($pdo, $username, $email, $password) {
    $stmt = $pdo->prepare('INSERT INTO user (username, email, password) VALUES (:username, :email, :password)');
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
    $stmt->execute([':username' => $username, ':email' => $email, ':password' => $hashedPassword]);
    return $pdo->lastInsertId();
}

function fetchUserById($pdo, $userId) {
    $stmt = $pdo->prepare('SELECT id, username, email FROM user WHERE id = :id');
    $stmt->execute([':id' => $userId]);
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

function uploadProfilePic($pdo, $userId, $profilePic) {
    $uploadDir = 'uploads/profile_pics/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    $profilePicPath = getProfilePicPath($userId, $profilePic['name']);
    if (move_uploaded_file($profilePic['tmp_name'], $profilePicPath)) {
        $stmt = $pdo->prepare('UPDATE user SET profile_pic = :profile_pic WHERE id = :id');
        $stmt->execute([':profile_pic' => $profilePicPath, ':id' => $userId]);
        return true;
    }
    return false;
}

function getProfilePicPath($userId, $fileName) {
    return 'uploads/profile_pics/' . $userId . '_' . basename($fileName);
}

function respondWithError($message) {
    echo json_encode(['error' => $message]);
    exit;
}
?>
