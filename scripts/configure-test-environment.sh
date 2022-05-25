#!/usr/bin/env bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

# shellcheck source=scripts/.env
. "$SCRIPT_DIR"/.env

TIMESTAMP="$1"

if [[ "$TIMESTAMP" == "" ]]
then
    echo "Error: no timestamp supplied"
    exit 1
fi

RESOURCE_GROUP_NAME="rg_test_$TIMESTAMP"
export RESOURCE_GROUP_NAME

COSMOS_ACCOUNT_NAME="cdbtest$TIMESTAMP"
export COSMOS_ACCOUNT_NAME

echo "Resource Group Name: $RESOURCE_GROUP_NAME"
echo "Cosmos Account Name: $COSMOS_ACCOUNT_NAME"

cd "$SCRIPT_DIR"/../src/infra
./infra-runner.ts run --no-log "$SCRIPT_DIR"/../src/infra/test-environment-setup.json