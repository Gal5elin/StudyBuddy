<?php
include 'db.php';
include 'authMiddleware.php';

if (!isset($pdo)) {
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

if (isset($GLOBALS['user'])) {
    $user_id = $GLOBALS['user']->userId;
} else {
    echo json_encode(['error' => 'User not authenticated']);
    exit;
}

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

if (!isset($_GET['note_id'])) {
    echo json_encode(['error' => 'Note parameter is required']);
    exit;
}

$noteId = $_GET['note_id'];

try {
    $stmt = $pdo->prepare('SELECT * FROM note WHERE id = :note_id AND user_id = :user_id');
    $stmt->bindParam(':note_id', $noteId, PDO::PARAM_INT);
    $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
    $stmt->execute();

    $note = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$note) {
        echo json_encode(['error' => 'Note not found']);
        exit;
    }

    $stmt = $pdo->prepare('DELETE FROM note_file WHERE note_id = :note_id');
    $stmt->bindParam(':note_id', $noteId, PDO::PARAM_INT);
    $stmt->execute();

    $stmt = $pdo->prepare('DELETE FROM note WHERE id = :note_id AND user_id = :user_id');
    $stmt->bindParam(':note_id', $noteId, PDO::PARAM_INT);
    $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
    $stmt->execute();

    echo json_encode(['message' => 'Note deleted successfully']);
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
