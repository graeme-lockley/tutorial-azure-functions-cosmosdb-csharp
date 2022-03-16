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

az deployment sub create \
    --name "tafcc-configure-resource-groups" \
    --location "$RESOURCE_GROUP_LOCATION" \
    --template-file "${SCRIPT_DIR}/../infra/resource-groups.bicep" \
    --parameters "resourceGroupName=$RESOURCE_GROUP_NAME" \
    --parameters "resourceGroupLocation=$RESOURCE_GROUP_LOCATION"

az deployment group create \
    --name "tafcc-configure-cosmos" \
    --resource-group "$RESOURCE_GROUP_NAME" \
    --template-file "$SCRIPT_DIR/../infra/cosmos.bicep" \
    --parameters accountName="$COSMOS_ACCOUNT_NAME" \
    --parameters location="westus" 
