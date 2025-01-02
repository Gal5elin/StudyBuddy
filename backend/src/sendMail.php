<?php
require 'vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$data = json_decode(file_get_contents("php://input"), true);
$email = $data['email'];

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["success" => false, "error" => "Invalid email address."]);
    exit;
}

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'gal5elin15@gmail.com';
    $mail->Password = 'grvf vdfp vhgp bqmn';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;

    $mail->setFrom('gal5elin15@gmail.com', 'StudyBuddy');
    $mail->addAddress($email);

    $mail->isHTML(false);
    $mail->Subject = 'Registration Confirmation';
    $mail->Body    = "Hello,\n\nThank you for registering on StuddyBuddy!\nYour registration was successful.";

    if ($mail->send()) {
        echo json_encode(["success" => true, "message" => "Confirmation email sent successfully."]);
    } else {
        echo json_encode(["success" => false, "error" => "Failed to send email."]);
    }
} catch (Exception $e) {
    echo json_encode(["success" => false, "error" => "Mailer Error: " . $mail->ErrorInfo]);
}
?>
