<?php
include 'db.php';
include 'authMiddleware.php';

if (!isset($pdo)) {
    respondWithError('Database connection failed');
}

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if (isset($GLOBALS['user'])) {
    $user_id = $GLOBALS['user']->userId;
} else {
    echo json_encode(['error' => 'User not authenticated']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (empty($data)) {
        $data = $_POST;
    }

    if (!isset($data['id'], $data['title'], $data['description'], $data['subject'], $data['visibility'], $data['files'])) {
        respondWithError('Missing required fields');
    }

    $note_id = (int)$data['id'];
    $title = trim($data['title']);
    $description = trim($data['description']);
    $subject = (int)$data['subject'];
    $visibility = $data['visibility'];
    $secret_key = isset($data['secret_key']) ? $data['secret_key'] : null;
    $files = $data['files'];

    if ($note_id <= 0) {
        respondWithError('Invalid note ID');
    }

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
        updateNote($pdo, $note_id, $title, $description, $subject, $visibility, $secret_key, $user_id);
        updateNoteFiles($pdo, $note_id, $files, $user_id);

        respondWithSuccess('Note updated successfully');
    } catch (PDOException $e) {
        error_log('Error updating note: ' . $e->getMessage());
        respondWithError('Error updating note: ' . $e->getMessage());
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    include 'uploadFile.php';
} else {
    respondWithError('Invalid request method');
}

function updateNote($pdo, $note_id, $title, $description, $subject, $visibility, $secret_key, $user_id) {
    $sql = "UPDATE note 
            SET title = :title, 
                description = :description, 
                subject_id = :subject, 
                visibility = :visibility, 
                secret_key = :secret_key
            WHERE id = :note_id AND user_id = :user_id";

    $stmt = $pdo->prepare($sql);

    $stmt->bindParam(':title', $title);
    $stmt->bindParam(':description', $description);
    $stmt->bindParam(':subject', $subject, PDO::PARAM_INT);
    $stmt->bindParam(':visibility', $visibility);
    $stmt->bindParam(':secret_key', $secret_key);
    $stmt->bindParam(':note_id', $note_id, PDO::PARAM_INT);
    $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);

    $stmt->execute();

    return $stmt->rowCount();
}

function updateNoteFiles($pdo, $note_id, $files, $user_id) {
    $existingFileIds = [];
    $selectSql = "SELECT file_id FROM note_file WHERE note_id = :note_id";
    $selectStmt = $pdo->prepare($selectSql);
    $selectStmt->bindParam(':note_id', $note_id, PDO::PARAM_INT);
    $selectStmt->execute();
    $existingFileIds = $selectStmt->fetchAll(PDO::FETCH_COLUMN);

    $fileIdsToKeep = [];
    $fileIdsToAdd = [];
    foreach ($files as $file) {
        if (isset($file['file_id'])) {
            if (in_array($file['file_id'], $existingFileIds)) {
                $fileIdsToKeep[] = $file['file_id'];
            } else {
                $fileIdsToAdd[] = $file['file_id'];
            }
        } else {
            $newFileId = uploadNewFile($pdo, $file, $user_id);
            if ($newFileId) {
                $fileIdsToAdd[] = $newFileId;
            } else {
                error_log("Failed to upload new file: " . ($file['file_name'] ?? 'Unknown'));
            }
        }
    }

    $fileIdsToRemove = array_diff($existingFileIds, $fileIdsToKeep);
    if (!empty($fileIdsToRemove)) {
        $deleteSql = "DELETE FROM note_file WHERE note_id = :note_id AND file_id IN (";
    
        $placeholders = [];
        foreach ($fileIdsToRemove as $index => $fileId) {
            $placeholders[] = ":file_id_$index";
        }
    
        $deleteSql .= join(",", $placeholders) . ")";
    
        $deleteStmt = $pdo->prepare($deleteSql);
    
        $deleteStmt->bindParam(':note_id', $note_id, PDO::PARAM_INT);
    
        foreach ($fileIdsToRemove as $index => $fileId) {
            $deleteStmt->bindValue(":file_id_$index", $fileId, PDO::PARAM_INT);
        }
    
        $deleteStmt->execute();
    }
    

    if (!empty($fileIdsToAdd)) {
        $insertSql = "INSERT INTO note_file (note_id, file_id) VALUES (:note_id, :file_id)";
        $insertStmt = $pdo->prepare($insertSql);

        foreach ($fileIdsToAdd as $fileId) {
            $insertStmt->bindParam(':note_id', $note_id, PDO::PARAM_INT);
            $insertStmt->bindParam(':file_id', $fileId, PDO::PARAM_INT);
            $insertStmt->execute();
        }
    }
}


function uploadNewFile($pdo, $file, $user_id) {
    include 'uploadFile.php';

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