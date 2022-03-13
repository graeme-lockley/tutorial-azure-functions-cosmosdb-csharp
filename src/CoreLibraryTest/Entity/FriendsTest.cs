namespace CoreLibraryTest.Entity;

using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;
using System.Collections.Generic;

using CoreLibrary.Entity;
using CoreLibrary.Ports.Out;

[TestClass]
public class FriendsTest
{
    private const string LAST_NAME = "Lockley";
    private const string FIRST_NAME = "Graeme";
    private const string KNOWN_AS = "Lockers";

    [TestMethod]
    public void GivenFriends_WhenAddValidFriend_NewFriendIsInRepository()
    {
        var friends = new Friends(new TestRepository());
        var friend = friends.AddFriend(LAST_NAME, FIRST_NAME, KNOWN_AS);

        var newFriend = friends.Get(friend.Id);

        Assert.AreEqual(friend.Id, newFriend.Id);
        Assert.AreEqual(friend.LastName, newFriend.LastName);
        Assert.AreEqual(friend.FirstName, newFriend.FirstName);
        Assert.AreEqual(friend.KnownAs, newFriend.KnownAs);
    }

    [TestMethod]
    public void GivenFriends_WhenGetOnInvalidID_ExceptionThrown()
    {
        var friends = new Friends(new TestRepository());

        Assert.ThrowsException<FriendNotFoundException>(() => friends.Get(""));
    }

    [TestMethod]
    public void GivenFriends_WhenFindOnLastName_ReturnsMatches()
    {
        var friends = new Friends(new TestRepository());

        friends.AddFriend(LAST_NAME, "Graeme", null);
        friends.AddFriend(LAST_NAME, "David", null);

        Assert.AreEqual(friends.FindOnLastName(LAST_NAME).Count, 2);
        Assert.AreEqual(friends.FindOnLastName("Smith").Count, 0);
    }
}

public class TestRepository : IRepository
{
    private int IdCounter = 0;
    private List<Friend> Friends = new List<Friend>();

    public TestRepository()
    {

    }

    public Friend AddFriend(string lastName, string firstName, string? knownAs)
    {
        var id = IdCounter;
        var friend = new Friend(id.ToString(), lastName, firstName, knownAs);

        IdCounter += 1;

        Friends.Add(friend);

        return friend;
    }

    public Friend? GetFriend(string id)
    {
        return Friends.Find(p => p.Id == id);
    }

    public List<Friend> FindFriendOnLastName(string lastName)
    {
        return Friends.FindAll(p => p.LastName == lastName);
    }
}
