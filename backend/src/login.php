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
    $userExists = $pdo -> prepare('SELECT * FROM user WHERE username = :username');
    $userExists -> bindParam(':username', $data['username']);

    $userExists -> execute();

    if ($userExists->rowCount() > 0) {
        $user = $userExists->fetch(PDO::FETCH_ASSOC);
        if (password_verify($data['password'], $user['password'])) {
            echo json_encode(['success' => true, 'user' => $user]);
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