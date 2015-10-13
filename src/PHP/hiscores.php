<!DOCTYPE html>
<html>
<body>

//note: make two columns for names and scores.
//      only take in scores then compare against new game score.
//      have a counter for the place then take in names and replace
//      the variable "newscore" comes from the javascript

<?php
$myfile = fopen("newfile.txt","w") or die("Unable to open file!");
$line = fgets($myfile);         //fgets gets the first score from the file pointer
while(!feof($myfile)){
    if(newscore > $line){           //if new score is greater than this score
        fwrite($myfile, newscore);  //add new score to the file
        newscore = $line            //compare $line to rest of scores
    }
    else{ //file score if bigger then newscore
        fwrite($myfile, $line);     //writes the same score back to file
        $line = fgets($myfile);     //fgets gets the first score from the file pointer
    }
}
fclose($myfile);
?>

</body>
</html>