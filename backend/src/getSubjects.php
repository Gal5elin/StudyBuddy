<?php
include 'db.php';

header("Access-Control-Allow-Origin: *");

try {
    $stmt = $pdo->query('SELECT * FROM subject');
    $subjects = $stmt->fetchAll();

    header('Content-Type: application/json');
    echo json_encode($subjects);
} catch (\PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
