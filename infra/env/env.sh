#!/bin/bash

export STORE_RG_NAME=tutorialAzureFuncCosmosCSS
export STORE_RG_LOCATION=centralus
export COMPUTE_RG_NAME=tutorialAzureFuncCosmosCSC
export COMPUTE_RG_LOCATION=westus

export ACCOUNT_NAME=tafccdb

export FUNCTION_APP_NAME=tafcc
export FUNCTION_APP_STORAGE_NAME=tafccs

export APP_INSIGHTS_NAME=tafccn

if [ -z "$PRINCIPAL_ID" ]
then
    export PRINCIPAL_ID=22395703-af19-49be-a81f-ba230562fce3
fi
