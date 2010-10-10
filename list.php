#!/usr/bin/php
<?php
define('SERVER','ftp2.bom.gov.au');
define('SERVERPATH', 'anon/gen/radar/');
define('IMAGESPATH', 'images/');
define('LISTFILENAME', 'list.js');

function updateFromFtp(){
	
	$listing = shell_exec('echo "ls '.SERVERPATH.'" | ftp '.SERVER);

	/*
	$listing = file_get_contents('ftpcache.txt');
	*/

	$listing = explode("\n",$listing);

	$filesToGet = Array();

	foreach($listing as &$line){
		$line = substr($line,56);
		
		if(strlen($line) == 25){
			
			if(!file_exists(IMAGESPATH.$line)) {
				$filesToGet[] = $line;
				echo ' ';
			}else {
				echo '.';
			}
		}
	}

	$serverUnc = 'ftp://'.SERVER.'/'.SERVERPATH;

	file_put_contents('ftpQueue.txt',$serverUnc.implode("\n$serverUnc",$filesToGet));

	shell_exec('cd '.IMAGESPATH.';wget -i ../ftpQueue.txt&&rm ../ftpQueue.txt');
	
}

function createJsonIndex(){
	
	if($dh = opendir(IMAGESPATH)) {
		while (($file = readdir($dh)) !== false) {
			if(strlen($file) == 25){
				$group = substr($file,0,6);
				$groups[$group][] = substr($file,13);
			}
		}
		closedir($dh);
	};
	foreach($groups as &$group) {
		sort($group);
	}

	file_put_contents(LISTFILENAME,json_encode($groups));

}

updateFromFtp();
createJsonIndex();
