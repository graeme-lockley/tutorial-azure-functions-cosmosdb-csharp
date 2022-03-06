using System.Net;
using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Logging;

namespace CoreLibrary
{
    public class Tasks
    {
        private Connection connection;


        private ILogger? log;

        public Tasks(Connection connection, ILogger? log = null)
        {
            this.connection = connection;
            this.log = log;
        }

        private void LogInformation(string message, params object?[] args)
        {
            if (log == null)
                Console.Write(message, args);
            else
                log.LogInformation(message, args);
        }

        public async Task AddItemsToContainerAsync()
        {
            Family andersenFamily = new Family
            {
                Id = "Andersen.1",
                LastName = "Andersen",
                Parents = new Parent[]
                {
                    new Parent { FirstName = "Thomas" },
                    new Parent { FirstName = "Mary Kay" }
                },
                Children = new Child[]
                {
                    new Child
                    {
                        FirstName = "Henriette Thaulow",
                        Gender = "female",
                        Grade = 5,
                        Pets = new Pet[]
                        {
                            new Pet { GivenName = "Fluffy" }
                        }
                    }
                },
                Address = new Address { State = "WA", County = "King", City = "Seattle" },
                IsRegistered = false
            };

            try
            {
                var container = await connection.Container();

                // Create an item in the container representing the Andersen family. Note we provide the value of the partition key for this item, which is "Andersen".
                ItemResponse<Family> andersenFamilyResponse = await container.CreateItemAsync<Family>(andersenFamily, new PartitionKey(andersenFamily.LastName));
                // Note that after creating the item, we can access the body of the item with the Resource property of the ItemResponse. We can also access the RequestCharge property to see the amount of RUs consumed on this request.
                LogInformation("Created item in database with id: {0} Operation consumed {1} RUs.\n", andersenFamilyResponse.Resource.Id, andersenFamilyResponse.RequestCharge);
            }
            catch (CosmosException ex) when (ex.StatusCode == HttpStatusCode.Conflict)
            {
                LogInformation("Item in database with id: {0} already exists\n", andersenFamily.Id);
            }
        }

        public async Task<List<Family>> QueryItemsAsyncOnLastName(string lastName)
        {
            var sqlQueryText = $"SELECT * FROM c WHERE c.LastName = '{lastName}'";

            LogInformation("Running query: {0}\n", sqlQueryText);

            QueryDefinition queryDefinition = new QueryDefinition(sqlQueryText);
            var container = await connection.Container();
            FeedIterator<Family> queryResultSetIterator = container.GetItemQueryIterator<Family>(queryDefinition);

            List<Family> families = new List<Family>();

            while (queryResultSetIterator.HasMoreResults)
            {
                FeedResponse<Family> currentResultSet = await queryResultSetIterator.ReadNextAsync();
                foreach (Family family in currentResultSet)
                {
                    families.Add(family);
                    LogInformation("\tRead {0}\n", family);
                }
            }

            return families;
        }
    }
}
