using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Logging;

namespace PortCosmosRepository
{
    public class Connection
    {
        private string endpointUrl;
        private string primaryKey;
        private string databaseId;
        string containerId;
        private CosmosClient? cosmosClient;
        private Database? database;
        private Container? container;

        private ILogger? log;

        public Connection(string? endpointUrl = null, string? primaryKey = null, ILogger? log = null)
        {
            this.endpointUrl = endpointUrl ?? Environment.GetEnvironmentVariable("COSMOSDB_ENDPOINT_URL") ?? "https://tafccdb.documents.azure.com:443/";
            this.primaryKey = primaryKey ?? Environment.GetEnvironmentVariable("COSMOSDB_PRIMARY_KEY") ?? "";
            this.databaseId = "FriendDatabase";
            this.containerId = "FriendContainer";
            this.log = log;
        }

        public CosmosClient connect()
        {
            if (cosmosClient == null)
            {
                cosmosClient = new CosmosClient(endpointUrl, primaryKey);
                LogInformation("Connected Database: {0}\n", endpointUrl);
            }

            return cosmosClient;
        }

        public async Task<Database> Database()
        {
            if (database == null)
            {
                database = await connect().CreateDatabaseIfNotExistsAsync(databaseId);
                LogInformation("Created Database: {0}\n", database.Id);
            }

            return database;
        }

        public async Task<Container> Container()
        {
            if (container == null)
            {
                var db = await Database();

                container = await db.CreateContainerIfNotExistsAsync(containerId, "/LastName");
                LogInformation("Created Container: {0}\n", this.container.Id);
            }

            return container;
        }

        public async Task TruncateContainer()
        {
            var c = await Container();
            await c.DeleteContainerAsync();
            this.container = null;
        }

        public void LogInformation(string message, params object?[] args)
        {
            if (log == null)
                Console.Write(message, args);
            else
                log.LogInformation(message, args);
        }
    }
}
