#!/usr/bin/env bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

# shellcheck source=scripts/.env
. "$SCRIPT_DIR"/.env

KEY=$(az cosmosdb keys list --name "$COSMOS_ACCOUNT_NAME" --resource-group "$RESOURCE_GROUP_NAME" --query primaryMasterKey)
KEY1=${KEY:1}

export COSMOSDB_PRIMARY_KEY="${KEY1%?}"

az deployment group create \
    --name "tafcccf" \
    --resource-group "$RESOURCE_GROUP_NAME" \
    --template-file "${SCRIPT_DIR}/../infra/functions.bicep" \
    --parameters appName="$FUNCTIONAPP_NAME" \
    --parameters cosmosPrimaryMasterKey="$COSMOSDB_PRIMARY_KEY"
