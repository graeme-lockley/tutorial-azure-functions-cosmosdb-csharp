#!/usr/bin/env bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

# shellcheck source=scripts/.env
. "$SCRIPT_DIR"/.env

KEY=$(az cosmosdb keys list --name "$COSMOS_ACCOUNT_NAME" --resource-group "$RESOURCE_GROUP_NAME" --query primaryMasterKey)
KEY1=${KEY:1}

export COSMOSDB_PRIMARY_KEY="${KEY1%?}"

cd "$SCRIPT_DIR"/../src/CLI || exit 1
dotnet run
