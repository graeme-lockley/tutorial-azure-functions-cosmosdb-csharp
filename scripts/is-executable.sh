#!/usr/bin/env bash

if ! command -v -- "$1" >> /dev/null
then
    if [[ "$2" == "" ]]
    then
        echo Aborting: "$1" not executable in path
    else
        echo "$2": Aborting: "$1" not executable in path
    fi

    exit 1
fi
