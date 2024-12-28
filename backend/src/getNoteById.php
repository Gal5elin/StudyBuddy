<?php
include 'db.php';

if (!isset($pdo)) {
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');

if (!isset($_GET['noteId'])) {
    echo json_encode(['error' => 'Note parameter is required']);
    exit;
}

$noteId = $_GET['noteId'];
$secretKey = isset($_GET['key']) ? $_GET['key'] : null;

try {
    if (!$secretKey) {
        $stmt = $pdo->prepare('
        SELECT 
            n.*, 
            f.id AS file_id, 
            f.file_name, 
            f.file_path, 
            f.uploaded_at 
        FROM 
            note n
        LEFT JOIN 
            note_file nf ON n.id = nf.note_id
        LEFT JOIN 
            file f ON nf.file_id = f.id
        WHERE 
            n.id = :note_id AND n.visibility = "public"
        ');
    
        $stmt->bindParam(':note_id', $noteId, PDO::PARAM_INT);
    } else {
        $stmt = $pdo->prepare('
        SELECT 
            n.*, 
            f.id AS file_id, 
            f.file_name, 
            f.file_path, 
            f.uploaded_at 
        FROM 
            note n
        LEFT JOIN 
            note_file nf ON n.id = nf.note_id
        LEFT JOIN 
            file f ON nf.file_id = f.id
        WHERE 
            n.id = :note_id AND n.secret_key = :secret_key
        ');
    
        $stmt->bindParam(':note_id', $noteId, PDO::PARAM_INT);
        $stmt->bindParam(':secret_key', $secretKey, PDO::PARAM_STR);
    }
     
    $stmt->execute();

    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($results) {
        $note = [
            'id' => $results[0]['id'],
            'title' => $results[0]['title'],
            'description' => $results[0]['description'],
            'user_id' => $results[0]['user_id'],
            'subject_id' => $results[0]['subject_id'],
            'visibility' => $results[0]['visibility'],
            'secret_key' => $results[0]['secret_key'],
            'created_at' => $results[0]['created_at'],
            'files' => []
        ];

        foreach ($results as $row) {
            if ($row['file_id']) {
                $note['files'][] = [
                    'id' => $row['file_id'],
                    'file_name' => $row['file_name'],
                    'file_path' => $row['file_path'],
                    'uploaded_at' => $row['uploaded_at']
                ];
            }
        }

        echo json_encode($note);
    } else {
        if ($secretKey) {
            echo json_encode(['error' => 'Invalid secret key']);
        } else {
            echo json_encode(['error' => 'Note not found']);
        }
    }

} catch (\PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
