<?php
include 'db.php';
include 'authMiddleware.php';

header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');

try {
    if (!isset($pdo)) {
        echo json_encode(['error' => 'Database connection failed']);
        exit;
    }

    if (!isset($GLOBALS['user']) || !isset($GLOBALS['user']->userId)) {
        echo json_encode(['error' => 'User not authenticated']);
        exit;
    }

    $userId = $GLOBALS['user']->userId;

    $query = "
        SELECT 
            n.id AS note_id, n.title AS note_title, n.description AS note_description,
            n.user_id, n.subject_id, n.visibility, n.secret_key, n.created_at,
            f.id AS file_id, f.file_name, f.file_path, f.uploaded_at
        FROM 
            note n
        LEFT JOIN 
            note_file nf ON n.id = nf.note_id
        LEFT JOIN 
            file f ON nf.file_id = f.id
        WHERE 
            n.user_id = :userId
    ";

    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);
    $stmt->execute();
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $notes = [];
    foreach ($rows as $row) {
        $note_id = $row['note_id'];

        if (!isset($notes[$note_id])) {
            $notes[$note_id] = [
                'id' => $note_id,
                'title' => $row['note_title'],
                'description' => $row['note_description'],
                'user_id' => $row['user_id'],
                'subject_id' => $row['subject_id'],
                'visibility' => $row['visibility'],
                'secret_key' => $row['secret_key'],
                'created_at' => $row['created_at'],
                'files' => []
            ];
        }

        if ($row['file_id']) {
            $notes[$note_id]['files'][] = [
                'file_id' => $row['file_id'],
                'file_name' => $row['file_name'],
                'file_path' => $row['file_path'],
                'uploaded_at' => $row['uploaded_at']
            ];
        }
    }

    $notes = array_values($notes);

    echo json_encode($notes);
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
