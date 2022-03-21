targetScope = 'subscription'

var name = 'prod'

@minLength(3)
@maxLength(30)
param computeResourceGroupName string

param computeResourceGroupLocation string = 'centralus'

@minLength(3)
@maxLength(30)
param storeResourceGroupName string

param storeResourceGroupLocation string = 'westus'

module computeRG './resource-group.bicep' = {
  name: '${name}-computeRG'
  params: {
    resourceGroupName: computeResourceGroupName
    resourceGroupLocation: computeResourceGroupLocation
  }
}

module storeRG './resource-group.bicep' = {
  name: '${name}-storeRG'
  params: {
    resourceGroupName: storeResourceGroupName
    resourceGroupLocation: storeResourceGroupLocation
  }
}

module cosmosDB './cosmos.bicep' = {
  name: '${name}-cosmosDB'
  scope: resourceGroup(storeResourceGroupName)
  params: {
    accountName: 'tafccdb'
    location: storeRG.outputs.rgLocation
  }
  dependsOn: [
    storeRG
  ]
}

resource cosmosDBR 'Microsoft.DocumentDB/databaseAccounts@2021-10-15' existing = {
  name: 'tafccdb'
  scope: resourceGroup(storeResourceGroupName)
}

module functions './functions.bicep' = {
  name: 'functions'
  scope: resourceGroup(computeResourceGroupName)
  params: {
    appName: 'tafcc'
    location: computeRG.outputs.rgLocation
    cosmosPrimaryMasterKey: cosmosDBR.listKeys().primaryMasterKey
  }
  dependsOn: [
    cosmosDB
    computeRG
  ]
}
