<?php
session_start(); // Start session to manage user sessions

include 'dbconnect.php'; // Include database connection file

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['signin'])) {
    // Sanitize user inputs
    $email = $conn->real_escape_string(trim($_POST['email']));
    $password = trim($_POST['password']); // Trim any leading or trailing spaces

    // Query to fetch user by email
    $sql = "SELECT * FROM signup WHERE email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('s', $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        // Fetch user data
        $user = $result->fetch_assoc();

        // Directly compare passwords (no hashing)
        if ($password === $user['password']) {
            // Set session variables
            $_SESSION['user_id'] = $user['id']; // Store user ID in session
            $_SESSION['first_name'] = $user['fname']; // Store first name

            // Redirect to dashboard
            echo "<script>
                    // alert('Sign-in successful! Redirecting to dashboard.');
                    window.location.href = 'dashboard.php';
                  </script>";
        } else {
            // Invalid password
            echo "<script>
                    alert('Incorrect password. Please try again.');
                    window.history.back();
                  </script>";
        }
    } else {
        // Email not found
        echo "<script>
                alert('No account found with this email. Please sign up first.');
                window.history.back();
              </script>";
    }

    $stmt->close();
}

$conn->close();

d

?>
