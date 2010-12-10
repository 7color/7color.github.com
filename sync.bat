@echo on
title Git Sync... 
::Start...
echo Start synchronizing...

echo Commit changes...

:: get date and time 
:: for /f "delims=" %%a in ('date/t') do @set mydate=%%a 
:: for /f "delims=" %%a in ('time/t') do @set mytime=%%a 
set mydate=%DATE:~0,10%
set mytime=%TIME:~0,8%
set fvar=%mydate%%mytime% 

echo %fval%
pause

:: add all new files 
call git add . 
call git commit -a -m "Automated commit on %fvar%"

:: push to the server. Default in "origin" remote, "master" branch
call git push 7color master
exit
