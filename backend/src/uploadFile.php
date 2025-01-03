<?php
include 'db.php';
include 'authMiddleware.php';
require_once 'vendor/autoload.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['REQUEST_METHOD'] === 'PUT') {
    if (isset($_FILES['file']) && isset($_POST['note_id'])) {
        try {
            $note_id = (int)$_POST['note_id'];
            if ($note_id <= 0) {
                respondWithError("Invalid note ID.");
            }

            $upload_dir = 'uploads/note_files/';
            if (!is_dir($upload_dir)) {
                if (!mkdir($upload_dir, 0755, true)) {
                    respondWithError("Failed to create upload directory.");
                }
            }

            $uploadedFiles = [];
            $all_imgs = [];

            if (is_array($_FILES['file']['tmp_name'])) {
                foreach ($_FILES['file']['tmp_name'] as $index => $tmpName) {
                    if (!empty($tmpName)) {
                        $fileName = $_FILES['file']['name'][$index];
                        $fileType = mime_content_type($tmpName);
                        $destination = $upload_dir . basename($fileName);

                        if (strpos($fileType, 'image/') === 0) {
                            $all_imgs[] = $tmpName;
                        } elseif ($fileType === 'application/pdf') {
                            if (!move_uploaded_file($tmpName, $destination)) {
                                respondWithError("Failed to upload file: $fileName.");
                            }
                            $uploadedFiles[] = [
                                'file_name' => $fileName,
                                'file_path' => $destination
                            ];
                        } else {
                            respondWithError("Unsupported file type: $fileType.");
                        }
                    }
                }
            } else {
                $tmpName = $_FILES['file']['tmp_name'];
                $fileName = $_FILES['file']['name'];
                $fileType = mime_content_type($tmpName);
                $destination = $upload_dir . basename($fileName);

                if (strpos($fileType, 'image/') === 0) {
                    $all_imgs[] = $tmpName;
                } elseif ($fileType === 'application/pdf') {
                    if (!move_uploaded_file($tmpName, $destination)) {
                        respondWithError("Failed to upload file: $fileName.");
                    }
                    $uploadedFiles[] = [
                        'file_name' => $fileName,
                        'file_path' => $destination
                    ];
                } else {
                    respondWithError("Unsupported file type: $fileType.");
                }
            }

            if (count($all_imgs) > 0) {
                $outputPDF = $upload_dir . 'note_'. $note_id . '_' . uniqid() . '.pdf';
                if (!convertImagesToPDF($all_imgs, $outputPDF)) {
                    respondWithError("Failed to convert images to PDF.");
                }
                $uploadedFiles[] = [
                    'file_name' => basename($outputPDF),
                    'file_path' => $outputPDF
                ];
            }

            if (!isset($GLOBALS['user'])) {
                respondWithError("User not authenticated.");
            }
            $user_id = $GLOBALS['user']->userId;

            foreach ($uploadedFiles as $file) {
                $stmt = $pdo->prepare("INSERT INTO file (file_name, file_path, user_id) VALUES (?, ?, ?)");
                if (!$stmt->execute([$file['file_name'], $file['file_path'], $user_id])) {
                    respondWithError("Failed to save file details.");
                }

                $file_id = $pdo->lastInsertId();
                $stmt = $pdo->prepare("INSERT INTO note_file (note_id, file_id) VALUES (?, ?)");
                if (!$stmt->execute([$note_id, $file_id])) {
                    respondWithError("Failed to associate file with note.");
                }
            }

            echo json_encode([
                'message' => 'Files uploaded and associated successfully',
                'file_paths' => array_column($uploadedFiles, 'file_path')
            ]);
        } catch (Exception $e) {
            error_log("Error: " . $e->getMessage());
            respondWithError($e->getMessage());
        }
    } else {
        respondWithError("No file uploaded or note ID not provided.");
    }
} else {
    respondWithError("Invalid request method.");
}

function convertImagesToPDF($imagePaths, $outputPDF) {
    try {
        $imagick = new Imagick();
        foreach ($imagePaths as $imagePath) {
            $imagick->readImage($imagePath);
        }
        $imagick->setImageFormat('pdf');
        $imagick->writeImages($outputPDF, true);
        return file_exists($outputPDF);
    } catch (Exception $e) {
        error_log("Error converting images to PDF: " . $e->getMessage());
        return false;
    }
}

if (!function_exists('respondWithError')) {
    function respondWithError($message) {
        http_response_code(400);
        echo json_encode(['error' => $message]);
        exit;
    }
}

