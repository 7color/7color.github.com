#!/bin/sh
echo "Sync(pull) starting"

echo "."
echo "========================================"
git pull 7color master
echo "========================================"

read -p "Pull from server completed, continue to push(y/n)?" push_flag
if [ "$push_flag" != "n" ]; then
    read -p "Enter commit:" commit
    if [ -z "$commit" ]; then
        mydate=`date '+%x %T'`
        commit="Automatic commit at $mydate"
    else
        commit=$commit
    fi

    git add .
    git commit -a -m "$commit"
    git push 7color master
   
    echo "."
    echo ".-------------------------------------."
    echo "'"
    echo "' Sync complete! '"
    echo "'"
    echo "--------------------------------------+"
else
    exit 0
fi
