targetScope = 'subscription'

@minLength(3)
@maxLength(30)
param name string

@minLength(3)
@maxLength(30)
param resourceGroupName string

param resourceGroupLocation string = 'westus'

param cosmosAccountName string

module storeRG './resource-group.bicep' = {
  name: '${name}_storeRG'
  params: {
    resourceGroupName: resourceGroupName
    resourceGroupLocation: resourceGroupLocation
  }
}

module cosmosDB './cosmos.bicep' = {
  name: '${name}_cosmosDB'
  scope: resourceGroup(resourceGroupName)
  params: {
    accountName: cosmosAccountName
    location: storeRG.outputs.rgLocation
  }
  dependsOn: [
    storeRG
  ]
}
