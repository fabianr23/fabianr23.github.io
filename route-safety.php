<?php
// Set your return content type
//phpinfo();
header('Content-Type: application/json');

$ll = $_GET['ll'];
// Website url to open
$url = "https://api.placeilive.com/v1/houses/search?ll=".$ll;

// Get that website's content
$handle = fopen($url, "r");

// If there is something, read and return
if ($handle) {
    while (!feof($handle)) {
        $buffer = fgets($handle, 4096);
        echo $buffer;
    }
    fclose($handle);
}

?>