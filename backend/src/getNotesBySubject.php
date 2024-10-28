<?php 
include 'db.php';

if (!isset($pdo)) {
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');

if (!isset($_GET['subjectId'])) {
    echo json_encode(['error' => 'Subject parameter is required']);
    exit;
}

$subject_id = $_GET['subjectId'];

try {
    $stmt = $pdo->prepare('SELECT * FROM note WHERE subject_id = :subject_id');
    $stmt->bindParam(':subject_id', $subject_id, PDO::PARAM_INT);
    $stmt->execute();
    $notes = $stmt->fetchAll();

    echo json_encode($notes);
} catch (\PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}


?>