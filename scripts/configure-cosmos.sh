#!/usr/bin/env bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

# shellcheck source=scripts/.env
. "$SCRIPT_DIR"/.env

az deployment group create \
    --name "tafcc-configure-cosmos" \
    --resource-group "$STORE_RESOURCE_GROUP_NAME" \
    --template-file "$SCRIPT_DIR/../infra/cosmos.bicep" \
    --parameters accountName="$COSMOS_ACCOUNT_NAME" \
    --parameters location="westus" 
