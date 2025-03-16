<?php
session_start();

$servername = "localhost";
$username = "root";
$password = "";  // db password
$dbname = "accounts";  

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $usernameOrEmail = $_POST['username'];
    $password = $_POST['password'];

    $usernameOrEmail = filter_var($usernameOrEmail, FILTER_SANITIZE_FULL_SPECIAL_CHARS);

    $stmt = $conn->prepare("SELECT id, username, password FROM users WHERE username = ? OR email = ?");
    $stmt->bind_param("ss", $usernameOrEmail, $usernameOrEmail);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $stmt->bind_result($id, $username, $hashedPassword);
        $stmt->fetch();

        if (password_verify($password, $hashedPassword)) {
            $_SESSION['user_id'] = $id;
            $_SESSION['username'] = $username;
            header("Location: page.html");
        } else {
            $_SESSION['error'] = "Invalid password.";
            header("Location: login.html");
        }
    } else {
        $_SESSION['error'] = "No account found with that username or email.";
        header("Location: login.html");
    }

    $stmt->close();
}

$conn->close();
?>