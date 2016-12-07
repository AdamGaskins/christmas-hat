<?php
$name = preg_replace("/[^A-Za-z0-9\_\-]/", '', $_POST["name"]);
$data = base64_decode($_POST["data"]);

header('Cache-Control: private');
header('Content-Description: File Transfer');
header("Content-Type: application/octet-stream");
header("Content-Disposition: attachment; filename=".$name.".png");
exit($data);
