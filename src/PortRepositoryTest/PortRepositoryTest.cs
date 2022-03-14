namespace PortRepositoryTest;

using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Threading.Tasks;

using CoreLibrary.Ports.Out;

public abstract class AbstractRepositoryTest
{
    private IRepository? repository;

    abstract public Task<IRepository> newRepository();

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
        var newFriend = (await repository.GetFriend(friend.Id))!;

        Assert.AreEqual(friend.Id, newFriend.Id);
        Assert.AreEqual(friend.LastName, newFriend.LastName);
        Assert.AreEqual(friend.FirstName, newFriend.FirstName);
        Assert.AreEqual(friend.KnownAs, newFriend.KnownAs);
    }
}
