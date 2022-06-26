#!/bin/bash

if [ -z "$RESOURCE_GROUP_NAME" ]
then
    RESOURCE_GROUP_NAME="rg_test_test"
    export RESOURCE_GROUP_NAME
fi

if [ -z "$COSMOS_ACCOUNT_NAME" ]
then
    COSMOS_ACCOUNT_NAME="cdbtesttest"
    export COSMOS_ACCOUNT_NAME
fi

LOG_FILE_NAME="${RESOURCE_GROUP_NAME}.log"
export LOG_FILE_NAME
OUTPUT_FILE_NAME="${RESOURCE_GROUP_NAME}.output.log"
export OUTPUT_FILE_NAME
