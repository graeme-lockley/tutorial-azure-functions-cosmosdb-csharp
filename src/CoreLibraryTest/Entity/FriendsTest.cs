namespace CoreLibraryTest.Entity;

using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Threading.Tasks;

using CoreLibrary.Entity;
using CoreLibrary.Ports.Out;

[TestClass]
public class FriendsTest
{
    private const string LAST_NAME = "Lockley";
    private const string FIRST_NAME = "Graeme";
    private const string KNOWN_AS = "Lockers";

    private Friends Friends = new Friends(new TestRepository());

    [TestInitialize]
    public void Init()
    {
        Friends = new Friends(new TestRepository());
    }

    [TestMethod]
    public async Task GivenFriends_WhenAddValidFriend_NewFriendIsInRepository()
    {
        var friend = await Friends.AddFriend(LAST_NAME, FIRST_NAME, KNOWN_AS);
        var newFriend = await Friends.Get(friend.Id);

        Assert.AreEqual(friend.Id, newFriend.Id);
        Assert.AreEqual(friend.LastName, newFriend.LastName);
        Assert.AreEqual(friend.FirstName, newFriend.FirstName);
        Assert.AreEqual(friend.KnownAs, newFriend.KnownAs);
    }

    [TestMethod]
    public async Task GivenFriends_WhenGetOnInvalidID_ExceptionThrown()
    {
        try
        {
            await Friends.Get("");
            Assert.IsTrue(false);
        }
        catch (FriendNotFoundException)
        {
            // Happy days
        }
    }

    [TestMethod]
    public async Task GivenFriends_WhenFindOnLastName_ReturnsMatches()
    {
        await Friends.AddFriend(LAST_NAME, "Graeme", null);
        await Friends.AddFriend(LAST_NAME, "David", null);

        Assert.AreEqual((await Friends.FindOnLastName(LAST_NAME)).Count, 2);
        Assert.AreEqual((await Friends.FindOnLastName("Smith")).Count, 0);
    }
}

public class TestRepository : IRepository
{
    private int IdCounter = 0;
    private List<Friend> Friends = new List<Friend>();

    public TestRepository()
    {

    }

    public async Task<Friend> AddFriend(string lastName, string firstName, string? knownAs)
    {
        return await Task.Run(() =>
        {

            var id = IdCounter;
            var friend = new Friend(id.ToString(), lastName, firstName, knownAs);

            IdCounter += 1;

            Friends.Add(friend);

            return friend;
        });
    }

    public async Task<Friend?> GetFriend(string id)
    {
        return await Task.Run(() =>
        {
            return Friends.Find(p => p.Id == id);
        });
    }

    public async Task<List<Friend>> FindFriendOnLastName(string lastName)
    {
        return await Task.Run(() =>
        {
            return Friends.FindAll(p => p.LastName == lastName);
        });
    }
}
