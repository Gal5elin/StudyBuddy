<?php
include 'db.php'; // Include database connection script

// Make sure the connection is established
if (!isset($pdo)) {
    respondWithError('Database connection failed');
}

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

include 'authMiddleware.php';

// Authenticate User
if (isset($GLOBALS['user'])) {
    $user_id = $GLOBALS['user']->userId;
} else {
    echo json_encode(['error' => 'User not authenticated']);
    exit;
}

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $data = json_decode(file_get_contents('php://input'), true);

    if (empty($data)) {
        // If no JSON input, try to use $_POST (for multipart form data)
        $data = $_POST;
    }

    // Ensure all necessary data is present in the POST request
    if (!isset($data['title'], $data['description'], $data['subject'], $data['visibility'])) {
        respondWithError('Missing required fields');
    }

    // Get the fields from the POST data
    $title = trim($data['title']);
    $description = trim($data['description']);
    $subject = (int)$data['subject']; // Ensure this is treated as an integer
    $visibility = $data['visibility'];

    // Validate input data
    if (empty($title) || empty($description)) {
        respondWithError('Title and description cannot be empty');
    }

    // Validate subject_id is an integer (make sure it exists)
    if ($subject <= 0) {
        respondWithError('Invalid subject ID');
    }

    // Validate visibility
    if (!in_array($visibility, ['public', 'hidden'])) {
        respondWithError('Invalid visibility value. Allowed values are "public" or "private".');
    }

    try {
        // Call the function to add the note
        $noteId = addNote($pdo, $title, $description, $subject, $visibility, $user_id);

        // Return success response with note ID
        respondWithSuccess('Note added successfully', ['noteId' => $noteId]);
    } catch (PDOException $e) {
        // Log the error (you might want to handle this in a more robust way in production)
        error_log('Error inserting note: ' . $e->getMessage());
        respondWithError('Error inserting note: ' . $e->getMessage());
    }
} else {
    respondWithError('Invalid request method');
}

// Function to add a new note to the database
function addNote($pdo, $title, $description, $subject, $visibility, $user_id) {
    // SQL query to insert the new note into the "note" table
    $sql = "INSERT INTO note (title, description, subject_id, visibility, user_id) 
            VALUES (:title, :description, :subject, :visibility, :user_id)";

    // Prepare the SQL statement
    $stmt = $pdo->prepare($sql);

    // Bind parameters to avoid SQL injection
    $stmt->bindParam(':title', $title);
    $stmt->bindParam(':description', $description);
    $stmt->bindParam(':subject', $subject, PDO::PARAM_INT); // Ensure subject is treated as an integer
    $stmt->bindParam(':visibility', $visibility);
    $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT); // Ensure user_id is treated as an integer

    // Execute the query
    if ($stmt->execute()) {
        // Return the ID of the inserted note
        return $pdo->lastInsertId();
    } else {
        throw new PDOException('Failed to add the note');
    }
}

// Function to send a JSON error response
function respondWithError($message) {
    http_response_code(400); // Bad request
    echo json_encode(['error' => $message]);
    exit;
}

// Function to send a JSON success response
function respondWithSuccess($message, $data = []) {
    http_response_code(200); // OK
    echo json_encode(['message' => $message, 'data' => $data]);
    exit;
}
?>
