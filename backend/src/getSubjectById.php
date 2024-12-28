<?php
include 'db.php';

header("Access-Control-Allow-Origin: *");

try {
    if (isset($_GET['subjectId'])) {
        $subjectId = (int)$_GET['subjectId'];

        $stmt = $pdo->prepare('SELECT * FROM subject WHERE id = :subjectId');
        $stmt->bindParam(':subjectId', $subjectId, PDO::PARAM_INT);
        $stmt->execute();

        $subject = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($subject) {
            echo json_encode($subject);
        } else {
            echo json_encode(['error' => 'Subject not found']);
        }
    } else {
        echo json_encode(['error' => 'Subject ID is required']);
    }
} catch (\PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
