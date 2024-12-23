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
    $user_id = $GLOBALS['user']->userId;
} else {
    echo json_encode(['error' => 'User not authenticated']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (empty($data)) {
        $data = $_POST;
    }

    if (!isset($data['title'], $data['description'], $data['subject'], $data['visibility'])) {
        respondWithError('Missing required fields');
    }

    $title = trim($data['title']);
    $description = trim($data['description']);
    $subject = (int)$data['subject'];
    $visibility = $data['visibility'];
    $secret_key = isset($data['secret_key']) ? $data['secret_key'] : null;

    if (empty($title) || empty($description)) {
        respondWithError('Title and description cannot be empty');
    }

    if ($subject <= 0) {
        respondWithError('Invalid subject ID');
    }

    if (!in_array($visibility, ['public', 'hidden'])) {
        respondWithError('Invalid visibility value. Allowed values are "public" or "hidden".');
    }

    try {
        $noteId = addNote($pdo, $title, $description, $subject, $visibility, $secret_key, $user_id);
        respondWithSuccess('Note added successfully', ['noteId' => $noteId]);
    } catch (PDOException $e) {
        error_log('Error inserting note: ' . $e->getMessage());
        respondWithError('Error inserting note: ' . $e->getMessage());
    }
} else {
    respondWithError('Invalid request method');
}

function addNote($pdo, $title, $description, $subject, $visibility, $secret_key, $user_id) {
    $sql = "INSERT INTO note (title, description, subject_id, visibility, secret_key, user_id) 
            VALUES (:title, :description, :subject, :visibility, :secret_key, :user_id)";

    $stmt = $pdo->prepare($sql);

    $stmt->bindParam(':title', $title);
    $stmt->bindParam(':description', $description);
    $stmt->bindParam(':subject', $subject, PDO::PARAM_INT);
    $stmt->bindParam(':visibility', $visibility);
    $stmt->bindParam(':secret_key', $secret_key);
    $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);

    if ($stmt->execute()) {
        return $pdo->lastInsertId();
    } else {
        throw new PDOException('Failed to add the note');
    }
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
