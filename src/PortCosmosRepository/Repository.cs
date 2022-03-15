namespace PortCosmosRepository;

using Microsoft.Azure.Cosmos;
using System.Net;

using CoreLibrary.Entity;
using CoreLibrary.Ports.Out;

public class Repository : IRepository
{
    private Connection Connection;

    public Repository(Connection? connection = null)
    {
        this.Connection = connection ?? new Connection();
    }

    public async Task<int> Count()
    {
        QueryDefinition queryDefinition = new QueryDefinition("SELECT VALUE COUNT(1) FROM C");
        var container = await Connection.Container();
        var count = 0;

        FeedIterator<int> queryResultSetIterator = container.GetItemQueryIterator<int>(queryDefinition);

        while (queryResultSetIterator.HasMoreResults)
        {
            FeedResponse<int> currentResultSet = await queryResultSetIterator.ReadNextAsync();
            foreach (int n in currentResultSet)
            {
                count = n;
                LogInformation("\tRead {0}\n", n);
            }
        }

        return count;
    }

    public Task Truncate() =>
        Connection.TruncateContainer();

    public async Task<Friend> AddFriend(string lastName, string firstName, string? knownAs)
    {
        Guid id = Guid.NewGuid();
        Friend friend = new Friend(id.ToString(), lastName, firstName, knownAs);

        try
        {
            var container = await Connection.Container();

            ItemResponse<Friend> friendResponse = await container.CreateItemAsync<Friend>(friend, new PartitionKey(lastName));
            LogInformation("Created item in database with id: {0} Operation consumed {1} RUs.\n", friendResponse.Resource.Id, friendResponse.RequestCharge);
        }
        catch (CosmosException ex) when (ex.StatusCode == HttpStatusCode.Conflict)
        {
            LogInformation("Item in database with id: {0} already exists\n", friend.Id);
        }

        return friend;
    }

    public async Task<Friend?> GetFriend(string id)
    {
        var result = await Query($"SELECT * FROM c WHERE c.id = '{id}'");

        return (result.Count > 0) ? result[0] : null;
    }

    public Task<List<Friend>> FindFriendOnLastName(string lastName) =>
        Query($"SELECT * FROM c WHERE c.LastName = '{lastName}'");

    private async Task<List<Friend>> Query(string sqlQueryText)
    {
        LogInformation("Running query: {0}\n", sqlQueryText);

        QueryDefinition queryDefinition = new QueryDefinition(sqlQueryText);
        var container = await Connection.Container();
        FeedIterator<Friend> queryResultSetIterator = container.GetItemQueryIterator<Friend>(queryDefinition);

        List<Friend> friends = new List<Friend>();

        while (queryResultSetIterator.HasMoreResults)
        {
            FeedResponse<Friend> currentResultSet = await queryResultSetIterator.ReadNextAsync();
            foreach (Friend friend in currentResultSet)
            {
                friends.Add(friend);
                LogInformation("\tRead {0}\n", friend);
            }
        }

        return friends;
    }

    private void LogInformation(string message, params object?[] args)
    {
        Connection.LogInformation(message, args);
    }
}
