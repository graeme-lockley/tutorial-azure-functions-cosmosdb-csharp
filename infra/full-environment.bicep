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

module resources './full-environment-resources.bicep' = {
  name: '${name}_resources'
  scope: resourceGroup(storeResourceGroupName)
  params: {
    computeResourceGroupName: computeResourceGroupName
    computeResourceGroupLocation: computeResourceGroupLocation
    storeResourceGroupLocation: storeResourceGroupLocation
  }
  
  dependsOn: [
    computeRG
    storeRG
  ]
}
