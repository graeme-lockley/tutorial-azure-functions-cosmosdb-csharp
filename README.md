# tutorial-azure-functions-csharp

Tutorial on deploying a C# function interacting with a Cosmos DB into Azure

I would like to use two resource groups - one for the functions and associated resources to support the functions and then a second to host Cosmos DB and associated resources.  The reason for this separation is that it makes the management of the former resource group easier with the ability of deleting it knowing that the database is not impacted.

## Something of Interest

I found that my Azure workflow was az cli based rather than portal or bicep based.  I toiled with bicep but eventually found that the most productive approach for me was create a sequence of bash scripts and then use a script runner to process them one after each other.  My pipeline commits the changelog back into version control thereby keeping track of what has been run and the status of each run.
