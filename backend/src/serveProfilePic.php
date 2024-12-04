<?php
ob_start();

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

include 'db.php';
include 'authMiddleware.php';

if (!isset($pdo)) {
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

if (isset($GLOBALS['user'])) {
    $userId = $GLOBALS['user']->userId;
    $profilePicPath = $GLOBALS['user']->profile_pic;
} else {
    echo json_encode(['error' => 'User not authenticated']);
    exit;
}

try {
    if ($profilePicPath && file_exists($profilePicPath) && is_readable($profilePicPath)) {
        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $mimeType = $finfo->file($profilePicPath);
        
        if (strpos($mimeType, 'image/') === 0) {
            // Output the image
            header("Content-Type: " . $mimeType);
            header("Content-Length: " . filesize($profilePicPath));
            readfile($profilePicPath);
            exit; // Make sure no other code is executed after this
        } else {
            // If the file is not an image, return JSON error
            echo json_encode(['error' => 'The file is not a valid image']);
        }
    } else {
        // If the profile picture doesn't exist or isn't readable, return JSON error
        echo json_encode(['error' => 'Profile picture not found or is not accessible']);
    }
} catch (PDOException $e) {
    // Handle database error and return JSON response
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
} catch (Exception $e) {
    // Handle general exceptions and return JSON response
    echo json_encode(['error' => 'Unexpected error: ' . $e->getMessage()]);
}

ob_end_flush();
?>
