#!/usr/bin/env bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

# shellcheck source=scripts/.env
. "$SCRIPT_DIR"/.env

# az deployment group create \
#     --name "tafcc-configure-cosmos" \
#     --resource-group "$RESOURCE_GROUP_NAME" \
#     --template-file "${SCRIPT_DIR}/../infra/cosmos.bicep" \
#     --parameters accountName="$COSMOS_ACCOUNT_NAME" \
#     --parameters location="$RESOURCE_GROUP_LOCATION" 

#     # \
#     # --parameters databaseName="$COSMOS_DATABASE_NAME"

DB_EXISTS="$( az cosmosdb check-name-exists --name "${COSMOS_ACCOUNT_NAME}" )"

if [[ "$DB_EXISTS" == "true" ]]
then
    echo "${COSMOS_ACCOUNT_NAME} already exists"
else
    az cosmosdb create \
        --resource-group "$RESOURCE_GROUP_NAME" \
        --name "$COSMOS_ACCOUNT_NAME" \
        --kind GlobalDocumentDB \
        --locations regionName="$RESOURCE_GROUP_LOCATION" failoverPriority=0 \
        --default-consistency-level "Session" \
        --enable-free-tier=true
fi
