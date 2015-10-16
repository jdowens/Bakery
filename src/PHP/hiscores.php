<!DOCTYPE html>
<html>
<body>

<?php
$myfile = fopen("newfile.txt","a+") or die("Unable to open file!");//'a+' means read and write
$line = fgets($myfile);         //fgets gets the first score from the file pointer
echo $line;

$test = "Test: 123";
$part = explode(" ",$test);
echo $part[2]; //should print everything after the space
echo "Above was not written to the file yet, but shows how that the scores can be obtained.";
echo "Below should display the entire file.";
fwrite($myfile,$test); //added $test to file
echo file_get_contents($myfile); //should display entire file, if not use line below
//echo file_get_contents("newfile.txt") //if above doesn't work hard code in

//below is another way.
/*note: may have to rewrite the file with to insert a new score with 'w' or new file.
        java_score variable comes from the game.
*/
/*
$myfile = fopen("newfile.txt","w+") or die("Unable to open file!");
while(!feof($myfile)){
    $newline = fgets($myfile);
    $score1 = explode(" ",$newline);
    if($java_score > $score1){ //need to change file permissions
        echo "Inside if statement.";
        //$new_player = $name . $javascore; //concatenates name and score for file
        //fwrite($myfile,$new_player);   //write the player to file
        //$java_score = score1    //set old score to java_score to check against other scores
    }//end if
    else{
        echo "Inside else statement.";
        //fwrite($myfile,$newline); //just add the score to the file
    }//end else
    echo $newline;
}//end while
*/
fclose($myfile);

?>//end php

</body>
</html>
