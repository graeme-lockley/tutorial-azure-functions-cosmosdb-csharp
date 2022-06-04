using Azure.Identity;
using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Logging;

namespace PortCosmosRepository
{
    public class Connection
    {
        private string endpointUrl;
        private string databaseId;
        string containerId;
        private CosmosClient? cosmosClient;
        private Container? container;

        private ILogger? log;

        public Connection(string? endpointUrl = null, string? primaryKey = null, ILogger? log = null)
        {
            this.endpointUrl = endpointUrl ?? Environment.GetEnvironmentVariable("COSMOSDB_ENDPOINT_URL") ?? "https://tafccdb.documents.azure.com:443/";
            this.databaseId = "FriendDatabase";
            this.containerId = "FriendContainer";
            this.log = log;
        }

        public CosmosClient Client()
        {
            if (cosmosClient == null)
            {
                CosmosClientOptions cosmosClientOptions = new CosmosClientOptions
                {
                    MaxRetryAttemptsOnRateLimitedRequests = 3,
                    MaxRetryWaitTimeOnRateLimitedRequests = TimeSpan.FromSeconds(60)
                };
                
                cosmosClient = new CosmosClient(endpointUrl, new DefaultAzureCredential(), cosmosClientOptions);
                LogInformation("Connected to Cosmos: {0}\n", endpointUrl);
            }

            return cosmosClient;
        }

        public Container Container()
        {
            if (container == null)
            {
                var db = Client().GetDatabase(databaseId);
                container = db.GetContainer(containerId);

                LogInformation("Accessed Container: {0}\n", this.container.Id);
            }

            return container;
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
