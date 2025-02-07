<?php
include 'dbconnect.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['signUp'])) {
    // Sanitize inputs
    $fname = $conn->real_escape_string($_POST['firstName']);
    $lname = $conn->real_escape_string($_POST['lastName']);
    $email = $conn->real_escape_string($_POST['email']);
    $password = $conn->real_escape_string($_POST['password']);
    // $password = password_hash($_POST['password'], PASSWORD_BCRYPT); // Hash password for security

    // SQL query to insert user into database
    $sql = "INSERT INTO signup (fname, lname, email, password) 
            VALUES ('$fname', '$lname', '$email', '$password')";

    if ($conn->query($sql) === TRUE) {
        echo "<script>
                alert('Account created successfully! Redirecting to sign-in page.');
                window.location.href = 'sign-in.html';
              </script>";
    } else {
        // Log error and display user-friendly message
        error_log("Database error: " . $conn->error);
        echo "<script>
                alert('An error occurred while creating your account. Please try again.');
              </script>";
    }
}

$conn->close();
?>
