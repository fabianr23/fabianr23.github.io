<?php
// Set your return content type
header('Content-type: application/xml');

// Website url to open
$url = "http://www.zillow.com/webservice/GetSearchResults.htm?zws-id=X1-ZWz199r3glyl8r_a9fju&address=1401+W.+Roosevelt+Road&citystatezip=60608";
//$url = "http://www.zillow.com/webservice/GetZestimate.htm?zws-id=X1-ZWz199r3glyl8r_a9fju&zpid=87699030";

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