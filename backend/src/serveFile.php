<?php
include 'db.php'; // Database connection
include 'authMiddleware.php'; // Authentication check

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    respondWithError('Invalid request method');
}

if (!isset($_GET['note_id']) || !is_numeric($_GET['note_id'])) {
    respondWithError('Invalid or missing note_id');
}

$note_id = (int)$_GET['note_id'];

// Get the user ID from the authenticated user
if (!isset($GLOBALS['user'])) {
    respondWithError('User not authenticated');
}

$user_id = $GLOBALS['user']->userId;

// Check if specific file_id is provided
$file_id = isset($_GET['file_id']) && is_numeric($_GET['file_id']) ? (int)$_GET['file_id'] : null;

// Handle the request
try {
    $stmt = $pdo->prepare("SELECT f.id AS file_id, f.file_name, f.file_path 
                           FROM file f
                           JOIN note_file nf ON f.id = nf.file_id
                           WHERE nf.note_id = ? AND f.user_id = ?");
    $stmt->execute([$note_id, $user_id]);

    $files = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (!$files) {
        respondWithError('No files associated with this note or unauthorized access');
    }

    if ($file_id) {
        // Serve a specific file
        $file = array_filter($files, fn($f) => $f['file_id'] == $file_id);
        if (empty($file)) {
            respondWithError('File not found or unauthorized access');
        }
        $file = reset($file);

        $file_path = realpath($file['file_path']);
        if (!$file_path || !file_exists($file_path)) {
            respondWithError('File not found');
        }

        serveFile($file['file_name'], $file_path);
    } else {
        // Option to download all files as a ZIP
        if (isset($_GET['download_all']) && $_GET['download_all'] === 'true') {
            createAndServeZip($files);
        } else {
            // Return the list of files
            echo json_encode(['files' => $files]);
            exit;
        }
    }

} catch (Exception $e) {
    error_log("Error handling files: " . $e->getMessage());
    respondWithError('An error occurred while processing your request');
}

// Function to serve a single file
function serveFile($file_name, $file_path) {
    $mimeType = mime_content_type($file_path) ?: 'application/octet-stream';
    $disposition = (pathinfo($file_name, PATHINFO_EXTENSION) === 'pdf') ? 'inline' : 'attachment';

    header('Content-Type: ' . $mimeType);
    header('Content-Disposition: ' . $disposition . '; filename="' . $file_name . '"');
    header('Content-Length: ' . filesize($file_path));
    readfile($file_path);
    exit;
}

// Function to create and serve a ZIP of all files
function createAndServeZip($files) {
    $zip = new ZipArchive();
    $zipFileName = tempnam(sys_get_temp_dir(), 'files_') . '.zip';

    if ($zip->open($zipFileName, ZipArchive::CREATE) !== true) {
        respondWithError('Failed to create ZIP file');
    }

    foreach ($files as $file) {
        $file_path = realpath($file['file_path']);
        if ($file_path && file_exists($file_path)) {
            $zip->addFile($file_path, $file['file_name']);
        }
    }

    $zip->close();

    header('Content-Type: application/zip');
    header('Content-Disposition: attachment; filename="note_files.zip"');
    header('Content-Length: ' . filesize($zipFileName));
    readfile($zipFileName);

    // Clean up the temporary file
    unlink($zipFileName);
    exit;
}

// Function to send a JSON error response
function respondWithError($message) {
    http_response_code(400); // Bad request
    echo json_encode(['error' => $message]);
    exit;
}