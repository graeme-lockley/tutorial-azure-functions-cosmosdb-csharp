targetScope = 'subscription'

@minLength(3)
@maxLength(30)
param computeResourceGroupName string

param computeResourceGroupLocation string = 'centralus'

@minLength(3)
@maxLength(30)
param storeResourceGroupName string

param storeResourceGroupLocation string = 'centralus'

resource computeRG 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: computeResourceGroupName
  location: computeResourceGroupLocation
}

resource storeRG 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: storeResourceGroupName
  location: storeResourceGroupLocation
}
