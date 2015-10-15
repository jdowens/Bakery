<!DOCTYPE html>
<html>
<body>

<?php
$myfile = fopen("newfile.txt","a+") or die("Unable to open file!");//'a+' means read and write
$line = fgets($myfile);         //fgets gets the first score from the file pointer
echo $line;

$test = "Test: 123";
$part = explode(" ",$part);
echo $part[2]; //should print everything after the space
echo "Above was not written to the file yet, but shows how that the scores can be obtained.";
echo "Below should display the entire file.";
fwrite($myfile,$test); //added $test to file
echo file_get_contents($myfile); //should display entire file, if not use line below
//echo file_get_contents("newfile.txt") //if above doesn't work hard code in
//below is another way.
/*while(!feof($myfile)){
    $newline = fgets($myfile);
    echo $newline;
}*/
//may use while loop in the future to get the file line by line
fclose($myfile);
?>

</body>
</html>
