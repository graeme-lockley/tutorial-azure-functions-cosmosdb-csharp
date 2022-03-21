@minLength(3)
@maxLength(30)
param computeResourceGroupName string

param computeResourceGroupLocation string = 'centralus'

param storeResourceGroupLocation string = 'centralus'

resource cosmosDB 'Microsoft.DocumentDB/databaseAccounts@2021-10-15' = {
  name: 'tafccdb'
  location: storeResourceGroupLocation
  properties: {
    databaseAccountOfferType: 'Standard'
    consistencyPolicy: {
      defaultConsistencyLevel: 'Session'
    }
    locations: [
      {
        locationName: storeResourceGroupLocation
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
