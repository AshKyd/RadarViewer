<?php
/**
 * Smiple script to index a directory of BOM forecast text files and
 * create an index of each file and what it (probably) is.
 *
 * Note: Only parses the standardised files with the code and
 * description on lines 1 and 5 respectively.
 */
define('FORECAST_DIR','forecasts/');
$sites = Array();
if ($dh = opendir(FORECAST_DIR)) {
    while (($file = readdir($dh)) !== false) {
        $file = explode("\n",file_get_contents(FORECAST_DIR.$file));

        // These are our keys we're looking for.
        $code = $file[0];
        $location = trim(str_replace('|','',ucwords(strtolower($file[4]))));

        if($location && strlen($code) == 8) {
            $sites[$code] = $location;
            echo("$code\t$location\n");
        }
    }
    closedir($dh);
}

