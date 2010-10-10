#!/usr/bin/php
<?php
$fileAsArray = Array();

if (($handle = fopen($argv[1], "r")) !== FALSE) {
    while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
        $fileAsArray[] = $data;
    }
    fclose($handle);
}

die(json_encode($fileAsArray));
