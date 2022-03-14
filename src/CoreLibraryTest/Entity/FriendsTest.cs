namespace CoreLibraryTest.Entity;

using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Threading.Tasks;

using CoreLibrary.Entity;
using CoreLibrary.Ports.Out;
using PortInMemoryRepository;

[TestClass]
public class FriendsTest
{
    private const string LAST_NAME = "Lockley";
    private const string FIRST_NAME = "Graeme";
    private const string KNOWN_AS = "Lockers";

    private Friends Friends = new Friends(new Repository());

    [TestInitialize]
    public void Init()
    {
        Friends = new Friends(new Repository());
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
