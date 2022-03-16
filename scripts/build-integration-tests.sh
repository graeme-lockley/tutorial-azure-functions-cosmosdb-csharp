#!/usr/bin/env bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

# shellcheck source=scripts/.env
. "$SCRIPT_DIR"/.env

TIMESTAMP="$1"

if [[ "$TIMESTAMP" == "" ]]
then
    echo "Error: no timestamp supplied"
fi

RESOURCE_GROUP_NAME="rg_test_$TIMESTAMP"
export RESOURCE_GROUP_NAME

COSMOS_ACCOUNT_NAME="cdbtest$TIMESTAMP"
export COSMOS_ACCOUNT_NAME

echo "Resource Group Name: $RESOURCE_GROUP_NAME"
echo "Cosmos Account Name: $COSMOS_ACCOUNT_NAME"

COSMOSDB_ENDPOINT_URL="https://$COSMOS_ACCOUNT_NAME.documents.azure.com:443/"
export COSMOSDB_ENDPOINT_URL

COSMOSDB_PRIMARY_KEY=$(az cosmosdb keys list --name "$COSMOS_ACCOUNT_NAME" --resource-group "$RESOURCE_GROUP_NAME" --query primaryMasterKey --output tsv)
export COSMOSDB_PRIMARY_KEY

cd "$SCRIPT_DIR"/../src/PortCosmosRepositoryTest || exit 1
dotnet test || exit 1
