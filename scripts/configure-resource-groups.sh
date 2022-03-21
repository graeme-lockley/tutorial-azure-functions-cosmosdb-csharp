#!/usr/bin/env bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

# shellcheck source=scripts/.env
. "$SCRIPT_DIR"/.env

az deployment sub create \
    --name "tafcc-configure-resource-groups" \
    --location "$RESOURCE_GROUP_LOCATION" \
    --template-file "${SCRIPT_DIR}/../infra/resource-groups.bicep" \
    --parameters "computeResourceGroupName=$COMPUTE_RESOURCE_GROUP_NAME" \
    --parameters "computeResourceGroupLocation=$COMPUTE_RESOURCE_GROUP_LOCATION" \
    --parameters "storeResourceGroupName=$STORE_RESOURCE_GROUP_NAME" \
    --parameters "storeResourceGroupLocation=$STORE_RESOURCE_GROUP_LOCATION"
