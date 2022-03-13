using CoreLibrary;

var endpointUrl = Environment.GetEnvironmentVariable("COSMOSDB_ENDPOINT_URL") ?? "https://tafccdb.documents.azure.com:443/";
var primaryKey = Environment.GetEnvironmentVariable("COSMOSDB_PRIMARY_KEY") ?? "";

var connection = new Connection(endpointUrl, primaryKey);
var tasks = new Tasks(connection);

await tasks.AddItemsToContainerAsync();
await tasks.QueryItemsAsyncOnLastName("Andersen");