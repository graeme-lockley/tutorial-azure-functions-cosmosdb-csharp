targetScope = 'subscription'

@minLength(3)
@maxLength(30)
param computeResourceGroupName string

@minLength(3)
@maxLength(30)
param storeResourceGroupName string

param resourceGroupLocation string = 'centralus'

resource computeRG 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: computeResourceGroupName
  location: resourceGroupLocation
}

resource storeRG 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: storeResourceGroupName
  location: resourceGroupLocation
}
