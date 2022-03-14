namespace PortInMemoryRepositoryTest;

using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Threading.Tasks;

using PortInMemoryRepository;

[TestClass]
public class RepositoryTest : AbstractRepositoryTest
{
    public override async Task<Repository> newRepository() =>
        await Task.Run(() => new Repository());
}

public abstract class AbstractRepositoryTest
{
    private Repository? repository;

    abstract public Task<Repository> newRepository();

    [TestInitialize]
    public async Task Init()
    {
        repository = await newRepository();
        await repository.Truncate();
    }

    [TestMethod]
    public async Task GivenRepository_WhenTruncate_ItHasNoEntries()
    {
        var count = await repository!.Count();

        Assert.AreEqual(count, 0);
    }

    [TestMethod]
    public async Task GivenRepository_WhenGetFriendOnUnknownID_ReturnsNull()
    {
        var friend = await repository!.GetFriend(" ");

        Assert.IsNull(friend);
    }

    [TestMethod]
    public async Task GivenRepository_WhenGetFriendOnKnownID_ReturnsFriend()
    {
        var friend = await repository!.AddFriend("Smith", "Robert", null);
        var newFriend = await repository.GetFriend(friend.Id)!;

        Assert.AreEqual(friend.Id, newFriend.Id);
        Assert.AreEqual(friend.LastName, newFriend.LastName);
        Assert.AreEqual(friend.FirstName, newFriend.FirstName);
        Assert.AreEqual(friend.KnownAs, newFriend.KnownAs);
    }
}
