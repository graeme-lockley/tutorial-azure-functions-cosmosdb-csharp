#!/usr/bin/env bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

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

COSMOSDB_ENDPOINT_URL="https://$COSMOS_ACCOUNT_NAME.documents.azure.com:443/"
export COSMOSDB_ENDPOINT_URL

cd "$SCRIPT_DIR"/../src/PortCosmosRepositoryTest || exit 1
dotnet test || exit 1
