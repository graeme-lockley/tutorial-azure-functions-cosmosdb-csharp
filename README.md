# tutorial-azure-functions-csharp

Tutorial on deploying a C# function interacting with a Cosmos DB into Azure

I would like to use two resource groups - one for the functions and associated resources to support the functions and then a second to host Cosmos DB and associated resources.  The reason for this separation is that it makes the management of the former resource group easier with the ability of deleting it knowing that the database is not impacted.

## See also

- Thanks to [Mark Heath](https://markheath.net) and his blog post [Deploying an Azure Function App with Bicep](https://markheath.net/post/azure-functions-bicep) - a simple post that accelerated my Bicep efforts