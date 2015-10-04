SET DIR_NAME="%date:/=-% %time::=-%"
SET DIR_NAME=%DIR_NAME: =_%
echo %DIR_NAME%
cd C:/CuteBakery/CuteBakery
call cocos compile -p web -m release
cd publish

ren html5 play
ncftpput -R -u dropjsas -p zVaWzPzxw4NvO server163.web-hosting.com /public_html/game play

ren play "%DIR_NAME:/=-%
ncftpput -R -u dropjsas -p zVaWzPzxw4NvO server163.web-hosting.com /public_html/game %DIR_NAME%