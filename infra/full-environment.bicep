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

resource computeRG 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: computeResourceGroupName
  location: computeResourceGroupLocation
}

resource storeRG 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: storeResourceGroupName
  location: storeResourceGroupLocation
}

module cosmosDB './cosmos.bicep' = {
  name: '${name}/cosmosDB'
  scope: resourceGroup(storeResourceGroupName)
  params: {
    accountName: 'tafccdb'
    location: storeRG.location
  }
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
    location: computeRG.location
    cosmosPrimaryMasterKey: cosmosDBR.listKeys().primaryMasterKey
  }
  dependsOn: [
    cosmosDB
  ]
}
