#!/usr/bin/env bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

. "$SCRIPT_DIR"/.env

TIMESTAMP="$1"

if [[ "$TIMESTAMP" == "" ]]
then
    echo "Error: no timestamp supplied"
    exit 1
fi

RESOURCE_GROUP_NAME="rg_test_$TIMESTAMP"
export RESOURCE_GROUP_NAME

ACCOUNT_NAME="cdbtest$TIMESTAMP"
export ACCOUNT_NAME

echo "Resource Group Name: $RESOURCE_GROUP_NAME"
echo "Account Name: $ACCOUNT_NAME"

cd "$SCRIPT_DIR"/../infra/test-setup || exit 1
"$SCRIPT_DIR"/infra-runner.sh up
