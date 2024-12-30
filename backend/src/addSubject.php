<?php
include 'db.php';

if (!isset($pdo)) {
    respondWithError('Database connection failed');
}

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

include 'authMiddleware.php';

if (isset($GLOBALS['user'])) {
    echo json_encode($GLOBALS['user']);
    $user_id = $GLOBALS['user']->userId;
    $role = $GLOBALS['user']->role;
} else {
    echo json_encode(['error' => 'User not authenticated']);
    exit;
}

if ($role !== 'admin') {
    respondWithError('Unauthorized access');
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (empty($data)) {
        $data = $_POST;
    }

    if (!isset($data['name'])) {
        respondWithError('Missing required fields');
    }

    $name = trim($data['name']);

    if (empty($name)) {
        respondWithError('Subject name cannot be empty');
    }

    try {
        $subjectId = addSubject($pdo, $name);
        respondWithSuccess('Subject added successfully', ['subjectId' => $subjectId]);
    } catch (PDOException $e) {
        error_log('Error inserting subject: ' . $e->getMessage());
        respondWithError('Error inserting subject: ' . $e->getMessage());
    }
} else {
    respondWithError('Invalid request method');
}

function addSubject($pdo, $name)
{
    $stmt = $pdo->prepare('INSERT INTO subject (name) VALUES (:name)');
    $stmt->execute(['name' => $name]);

    return $pdo->lastInsertId();
}

function respondWithError($message) {
    http_response_code(400);
    echo json_encode(['error' => $message]);
    exit;
}

function respondWithSuccess($message, $data = []) {
    http_response_code(200);
    echo json_encode(['message' => $message, 'data' => $data]);
    exit;
}

?>
