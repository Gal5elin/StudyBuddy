<?php
include 'db.php';

header("Access-Control-Allow-Origin: *");

try {
    $stmt = $pdo->query('SELECT * FROM note');
    $notes = $stmt->fetchAll();

    header('Content-Type: application/json');
    echo json_encode($notes);
} catch (\PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
