@minLength(3)
param appName string

param location string = resourceGroup().location

param cosmosPrimaryMasterKey string

var storageAccountName = '${substring(appName, 0, min(10, length(appName)))}${uniqueString(resourceGroup().id)}'
var hostingPlanName = '${appName}${uniqueString(resourceGroup().id)}'
var appInsightsName = '${appName}${uniqueString(resourceGroup().id)}'

resource storageAccount 'Microsoft.Storage/storageAccounts@2019-06-01' = {
  name: storageAccountName
  location: location
  kind: 'StorageV2'
  sku: {
    name: 'Standard_LRS'
  }
}

resource appInsights 'Microsoft.Insights/components@2020-02-02-preview' = {
  name: appInsightsName
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    publicNetworkAccessForIngestion: 'Enabled'
    publicNetworkAccessForQuery: 'Enabled'
  }
  tags: {
    // circular dependency means we can't reference functionApp directly  /subscriptions/<subscriptionId>/resourceGroups/<rg-name>/providers/Microsoft.Web/sites/<appName>"
    'hidden-link:/subscriptions/${subscription().id}/resourceGroups/${resourceGroup().name}/providers/Microsoft.Web/sites/${appName}': 'Resource'
  }
}

resource hostingPlan 'Microsoft.Web/serverfarms@2020-10-01' = {
  name: hostingPlanName
  location: location
  sku: {
    name: 'Y1'
    tier: 'Dynamic'
  }
}

resource functionApp 'Microsoft.Web/sites@2020-06-01' = {
  name: appName
  location: location
  kind: 'functionapp'
  properties: {
    httpsOnly: true
    serverFarmId: hostingPlan.id
    clientAffinityEnabled: true
    siteConfig: {
      appSettings: [
        {
          'name': 'APPINSIGHTS_INSTRUMENTATIONKEY'
          'value': appInsights.properties.InstrumentationKey
        }
        {
          name: 'AzureWebJobsStorage'
          value: 'DefaultEndpointsProtocol=https;AccountName=${storageAccount.name};EndpointSuffix=${environment().suffixes.storage};AccountKey=${listKeys(storageAccount.id, storageAccount.apiVersion).keys[0].value}'
        }
        {
          'name': 'FUNCTIONS_EXTENSION_VERSION'
          'value': '~4'
        }
        {
          'name': 'FUNCTIONS_WORKER_RUNTIME'
          'value': 'dotnet'
        }
        {
          name: 'WEBSITE_CONTENTAZUREFILECONNECTIONSTRING'
          value: 'DefaultEndpointsProtocol=https;AccountName=${storageAccount.name};EndpointSuffix=${environment().suffixes.storage};AccountKey=${listKeys(storageAccount.id, storageAccount.apiVersion).keys[0].value}'
        }
        {
          name: 'COSMOSDB_PRIMARY_KEY'
          value: cosmosPrimaryMasterKey
        }
        // WEBSITE_RUN_FROM_PACKAGE will be set to 1 by func azure functionapp publish
        {
          name: 'WEBSITE_RUN_FROM_PACKAGE'
          value: '1'
        }
        // WEBSITE_CONTENTSHARE will also be auto-generated - https://docs.microsoft.com/en-us/azure/azure-functions/functions-app-settings#website_contentshare
      ]
    }
  }
}
