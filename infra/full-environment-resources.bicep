@minLength(3)
@maxLength(30)
param computeResourceGroupName string

param computeResourceGroupLocation string = 'centralus'

@minLength(3)
@maxLength(30)
param storeResourceGroupName string

resource cosmosDB 'Microsoft.DocumentDB/databaseAccounts@2021-10-15' = {
  name: 'tafccdb'
  location: storeResourceGroupName
  properties: {
    databaseAccountOfferType: 'Standard'
    consistencyPolicy: {
      defaultConsistencyLevel: 'Session'
    }
    locations: [
      {
        locationName: storeResourceGroupName
      }
    ]
  }
}

module functions './functions.bicep' = {
  name: 'functions'
  scope: resourceGroup(computeResourceGroupName)
  params: {
    appName: 'tafcc'
    location: computeResourceGroupLocation
    cosmosPrimaryMasterKey: cosmosDB.listKeys().primaryMasterKey
  }
}
