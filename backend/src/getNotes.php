<?php
include 'db.php';

if (!isset($pdo)) {
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');

try {
    $stmt = $pdo->query('SELECT * FROM note');
    $notes = $stmt->fetchAll();

    echo json_encode($notes);
} catch (\PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
