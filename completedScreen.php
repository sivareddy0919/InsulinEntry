<?php
// Database connection settings
$servername = "localhost"; // Change this to your database server address
$username = "root"; // Change this to your database username
$password = ""; // Change this to your database password
$dbname = "mobile"; // Change this to your database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// SQL query
$sql = "SELECT `id`, `datetime`, `sugar_concentration`, `note`, `unit`, `username`, `session`, `insulinintake`, `status` FROM `glucoseentry`";

// Execute the query
$result = $conn->query($sql);

// Check if there are results
if ($result->num_rows > 0) {
    // Fetch all results into an associative array
    $data = $result->fetch_all(MYSQLI_ASSOC);
    // Output the results as JSON
    echo json_encode(['status' => 'success', 'data' => $data]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'No records found']);
}

// Close the connection
$conn->close();
?>
