<?php
include 'db.php'; // Database connection
include 'authMiddleware.php'; // Authentication check

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Check if file is uploaded
    if (isset($_FILES['file']) && isset($_POST['note_id'])) {
        // Get the uploaded file details
        $file = $_FILES['file'];
        $note_id = (int)$_POST['note_id']; // The note the file is associated with

        // Check for file upload errors
        if ($file['error'] !== UPLOAD_ERR_OK) {
            respondWithError('File upload error');
        }

        // Get file info
        $file_name = basename($file['name']);
        $file_tmp_path = $file['tmp_name'];
        $upload_dir = 'uploads/note_files/'; // The directory where files will be uploaded
        $file_path = $upload_dir . $file_name;

        // Ensure the upload directory exists
        if (!is_dir($upload_dir)) {
            mkdir($upload_dir, 0755, true);
        }

        // Move the uploaded file to the desired directory
        if (!move_uploaded_file($file_tmp_path, $file_path)) {
            respondWithError('Failed to move uploaded file');
        }

        // Get the user ID from the authenticated user
        if (isset($GLOBALS['user'])) {
            $user_id = $GLOBALS['user']->userId;
        } else {
            respondWithError('User not authenticated');
        }

        // Insert file metadata into the 'file' table
        $stmt = $pdo->prepare("INSERT INTO file (file_name, file_path, user_id) VALUES (?, ?, ?)");
        if (!$stmt->execute([$file_name, $file_path, $user_id])) {
            respondWithError('Failed to insert file into the database');
        }

        // Get the last inserted file ID
        $file_id = $pdo->lastInsertId();

        // Associate the file with the note
        $stmt = $pdo->prepare("INSERT INTO note_file (note_id, file_id) VALUES (?, ?)");
        if (!$stmt->execute([$note_id, $file_id])) {
            respondWithError('Failed to associate file with note');
        }

        // Respond with success
        respondWithSuccess('File uploaded and associated with note successfully');
    } else {
        respondWithError('No file uploaded or note_id not provided');
    }
} else {
    respondWithError('Invalid request method');
}

// Function to send a JSON error response
function respondWithError($message) {
    http_response_code(400); // Bad request
    echo json_encode(['error' => $message]);
    exit;
}

// Function to send a JSON success response
function respondWithSuccess($message) {
    http_response_code(200); // OK
    echo json_encode(['message' => $message]);
    exit;
}
?>
