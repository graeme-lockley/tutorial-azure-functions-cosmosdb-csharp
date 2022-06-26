#!/bin/bash

export STORE_RG_NAME=tutorialAzureFuncCosmosCSS
export COMPUTE_RG_NAME=tutorialAzureFuncCosmosCSC

export ACCOUNT_NAME=tafccdb

if [ -z "$PRINCIPAL_ID" ]
then
    export PRINCIPAL_ID=22395703-af19-49be-a81f-ba230562fce3
fi
