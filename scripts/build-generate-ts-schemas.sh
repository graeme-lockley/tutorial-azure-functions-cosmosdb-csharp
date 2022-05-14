#!/usr/bin/env bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
BASENAME=$(basename "${BASH_SOURCE[*]}")

"$SCRIPT_DIR"/is-executable.sh "deno" "$BASENAME" || exit 1
"$SCRIPT_DIR"/is-executable.sh "jtd-codegen" "$BASENAME" || exit 1

cd "$SCRIPT_DIR"/../src/infra/src/handlers/schema || exit 1

for FILE in ./*.json
do
    OUTPUT_FILE_NAME="${FILE%.json}.ts"

    if [ "${OUTPUT_FILE_NAME}" -ot "${FILE}" ] 
    then
        echo Processing: "$FILE"
        jtd-codegen --typescript-out . "$FILE" || exit 1
        
        deno fmt index.ts

        mv index.ts "$OUTPUT_FILE_NAME" || exit 1
    else
        echo Skipping: "$FILE"
    fi
done
