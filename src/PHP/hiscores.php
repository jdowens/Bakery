<!DOCTYPE html>
<html>
<body>

<?php
$myfile = fopen("newfile.txt","w") or die("Unable to open file!");
$line = fgets($myfile);         //fgets gets the first score from the file pointer
echo $line;
fclose($myfile);
?>

</body>
</html>
