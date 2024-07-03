<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

$servername = "localhost";
$username_db = "root";
$password_db = "";
$dbname = "mobile";

$conn = new mysqli($servername, $username_db, $password_db, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Fetch all entries with status 'pending'
$sql = "SELECT id, datetime, sugar_concentration, note, unit, username, session, insulinintake, status FROM glucoseentry WHERE status = 'pending'";
$result = $conn->query($sql);

$data = array();
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
}

$response = array(
    "status" => "success",
    "data" => $data
);

$conn->close();

echo json_encode($response);
?>
