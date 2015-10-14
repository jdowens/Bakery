<!DOCTYPE html>
<html>
<body>

/*note(Plane A): make two columns for names and scores.
                only take in scores then compare against new game score.
                have a counter to tack line to delete corresponding name.
                the variable "newscore" comes from the javascript.

Assumption:     newfile.txt is a file already created.
                newscore contains the score of the game just played.
                start with lowest score first.

<?php
$myfile = fopen("newfile.txt","w") or die("Unable to open file!");
$line = fgets($myfile);         //fgets gets the first score from the file pointer
while(!feof($myfile)){
    if(newscore > $line){           //if new score is greater than this score
        fwrite($myfile, newscore);  //add new score to the file
        newscore = $line;            //compare $line to rest of scores
    }
    else{ //file score if bigger then newscore
        fwrite($myfile, $line);     //writes the same score back to file
        $line = fgets($myfile);     //fgets gets the first score from the file pointer
    }
}
fclose($myfile);
?>*/

<?php
$myfile = fopen("newfile.txt","w") or die("Unable to open file!");
$line = fgets($myfile);         //fgets gets the first score from the file pointer
echo $line;
fclose($myfile);
?>

</body>
</html>
