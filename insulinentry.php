<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

// Handle PUT request
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    // Decode JSON data from the request body
    $data = json_decode(file_get_contents('php://input'), true);

    // Extract data from the decoded JSON
    $id = isset($data['id']) ? $data['id'] : '';
    $insulinIntake = isset($data['insulinintake']) ? $data['insulinintake'] : '';

    // Validate input data
    if (empty($id) || empty($insulinIntake)) {
        $response = array(
            "status" => "error",
            "message" => "Invalid input data"
        );
        echo json_encode($response);
        exit();
    }

    // Example: Update data in a database (you need to adjust this based on your actual database structure)
    $servername = "localhost";
    $username_db = "root";
    $password_db = "";
    $dbname = "mobile";

    $conn = new mysqli($servername, $username_db, $password_db, $dbname);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Determine the new status
    $status = !empty($insulinIntake) ? 'completed' : 'pending';

    // Prepare SQL statement
    $sql = "UPDATE glucoseentry SET insulinintake = ?, status = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);

    // Bind parameters and execute statement
    $stmt->bind_param("ssi", $insulinIntake, $status, $id); // 's' for string, 'i' for integer
    $stmt->execute();

    // Check if update was successful
    if ($stmt->affected_rows > 0) {
        $response = array(
            "status" => "success",
            "message" => "Insulin intake and status updated successfully"
        );
    } else {
        $response = array(
            "status" => "error",
            "message" => "Failed to update insulin intake and status"
        );
    }

    // Close statement and connection
    $stmt->close();
    $conn->close();

    // Return JSON response
    echo json_encode($response);
} else {
    // Handle other HTTP methods or invalid requests
    $response = array(
        "status" => "error",
        "message" => "Invalid request method"
    );
    echo json_encode($response);
}
?>
