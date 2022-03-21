#!/usr/bin/env bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

# shellcheck source=scripts/.env
. "$SCRIPT_DIR"/.env

COSMOSDB_PRIMARY_KEY=$(az cosmosdb keys list --name "$COSMOS_ACCOUNT_NAME" --resource-group "$STORE_RESOURCE_GROUP_NAME" --query primaryMasterKey --output tsv)
export COSMOSDB_PRIMARY_KEY

cd "$SCRIPT_DIR"/../src/CLI || exit 1
dotnet run
