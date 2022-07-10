#!/bin/bash

. ./env.sh

set -o pipefail

if [ -z "$LOG_FILE_NAME" ]
then
    LOG_FILE_NAME="changelog.log"
fi

if [ -z "$OUTPUT_FILE_NAME" ]
then
    OUTPUT_FILE_NAME="changelog.output.log"
fi

function fileNameFromChangelogLog() {
    echo "${1//=*/}"
}

function changeDownFileNameFromUpFileName() {
    echo "${1//.up/.down}"
}

function changeDownFileNameFromChangelogLog() {
    NAME="${1//=*/}"
    changeDownFileNameFromUpFileName "$NAME"
}

function runDateFromChangelogLog() {
    echo "${1//*=/}"
}

true >> "$LOG_FILE_NAME"

if [ "$1" == "" ]
then
    echo "Error: Unknown command"
    exit 1
elif [ "$1" == "up" ]
then
    for FILE in *.up
    do
        if ! grep "${FILE}=" "$LOG_FILE_NAME" >> /dev/null
        then
            echo "Excute: $FILE"
            echo ">>> start | $FILE: $( date ) |---------------------" >> $OUTPUT_FILE_NAME

            "./$FILE" 2>&1 | tee -a "$OUTPUT_FILE_NAME"
            ERROR_CODE="${PIPESTATUS[0]}"

            if [ "$ERROR_CODE" != "0" ]
            then
                exit 1
            fi

            echo ">>> end   | $FILE: $( date ) |---------------------" >> $OUTPUT_FILE_NAME

            echo "${FILE}=$( date )" >> "$LOG_FILE_NAME"
        else
            echo "Skipping: $FILE"
        fi
    done
elif [ "$1" == "down" ]
then
    sed -i '' '/^ *$/d' "$LOG_FILE_NAME" || exit 1

    LAST_LINE=$( tail -1 "$LOG_FILE_NAME") || exit 1

    if [ -z "$LAST_LINE" ]
    then
        echo "Error: No entries to rollback"
        exit 1
    else
        LAST_CHANGE_DOWN_FILE_NAME=$( changeDownFileNameFromChangelogLog "$LAST_LINE" )

        if ! test -f "$LAST_CHANGE_DOWN_FILE_NAME"
        then
            echo "Error: $LAST_CHANGE_DOWN_FILE_NAME does not exit: Unable to rollback"
            exit 1
        fi

        echo "Execute: $LAST_CHANGE_DOWN_FILE_NAME"
        echo "<<< start | $LAST_CHANGE_DOWN_FILE_NAME: $( date ) |---------------------" >> $OUTPUT_FILE_NAME
        
        "./$LAST_CHANGE_DOWN_FILE_NAME" 2>&1 | tee -a "$OUTPUT_FILE_NAME"
        ERROR_CODE="${PIPESTATUS[0]}"

        if [ "$ERROR_CODE" != "0" ]
        then
            exit 1
        fi

        echo "<<< end   | $LAST_CHANGE_DOWN_FILE_NAME: $( date ) |---------------------" >> $OUTPUT_FILE_NAME

        sed -i '' '$d' "$LOG_FILE_NAME" || exit 1
    fi
elif [ "$1" == "status" ]
then
    while read -r LINE || [[ -n $LINE ]];
    do
        CHANGE_UP_FILE_NAME=$( fileNameFromChangelogLog "$LINE" )
        CHANGE_DOWN_FILE_NAME=$( changeDownFileNameFromChangelogLog "$LINE" )
        CHANGE_UP_FILE_DATE=$( runDateFromChangelogLog "$LINE" )

        echo "$CHANGE_UP_FILE_NAME:"
        echo "  Run: $CHANGE_UP_FILE_DATE"

        if ! test -f "$CHANGE_UP_FILE_NAME"
        then
            echo "  Change up file does not exist: $CHANGE_UP_FILE_NAME"
        fi
        if ! test -f "$CHANGE_DOWN_FILE_NAME"
        then
            echo "  Change down file does not exist: $CHANGE_DOWN_FILE_NAME"
        fi
    done < "$LOG_FILE_NAME"

    for FILE in *.up
    do
        if ! grep "${FILE}=" "$LOG_FILE_NAME" >> /dev/null
        then
            CHANGE_DOWN_FILE_NAME=$( changeDownFileNameFromUpFileName "$FILE" )

            echo "$FILE:"
            echo "  Pending"

            if ! test -f "$CHANGE_DOWN_FILE_NAME"
            then
                echo "  Change down file does not exist: $CHANGE_DOWN_FILE_NAME"
            fi
        fi
    done
else
    echo "Error: Unknown command: $1"
    echo "  Expected up, down, status"
    exit 1
fi
