namespace CoreLibraryTest.Entity;

using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;

using CoreLibrary.Entity;

[TestClass]
public class FriendTest
{
    private const string ID = "123";
    private const string LAST_NAME = "Lockley";
    private const string FIRST_NAME = "Graeme";
    private const string KNOWN_AS = "Lockers";

    [TestMethod]
    public void GivenFriendWithEmptyId_WhenConstruct_ReturnsError()
    {
        Assert.ThrowsException<ValidationException>(() => new Friend("", LAST_NAME, FIRST_NAME, KNOWN_AS));
        Assert.ThrowsException<ValidationException>(() => new Friend("  ", LAST_NAME, FIRST_NAME, KNOWN_AS));
    }

    [TestMethod]
    public void GivenFriendWithEmptyLastName_WhenConstruct_ReturnsError()
    {
        Assert.ThrowsException<ValidationException>(() => new Friend(ID, "", FIRST_NAME, KNOWN_AS));
        Assert.ThrowsException<ValidationException>(() => new Friend(ID, "  ", FIRST_NAME, KNOWN_AS));
    }

    [TestMethod]
    public void GivenFriendWithEmptyFirstName_WhenConstruct_ReturnsError()
    {
        Assert.ThrowsException<ValidationException>(() => new Friend(ID, LAST_NAME, "", KNOWN_AS));
        Assert.ThrowsException<ValidationException>(() => new Friend(ID, LAST_NAME, "  ", KNOWN_AS));
    }

    [TestMethod]
    public void GivenFriendWithEmptyKnownAs_WhenConstruct_ReturnsError()
    {
        Assert.ThrowsException<ValidationException>(() => new Friend(ID, LAST_NAME, FIRST_NAME, ""));
        Assert.ThrowsException<ValidationException>(() => new Friend(ID, LAST_NAME, FIRST_NAME, "  "));
    }

    [TestMethod]
    public void ToStringAndFromStringAreReversable()
    {
        var friend = new Friend(ID, LAST_NAME, FIRST_NAME, KNOWN_AS);
        var friendJson = friend.ToString();
        var newFriend = JsonConvert.DeserializeObject<Friend>(friendJson)!;
        var newFriendJson = newFriend.ToString();

        Assert.AreEqual(friend.Id, newFriend.Id);
        Assert.AreEqual(friend.LastName, newFriend.LastName);
        Assert.AreEqual(friend.FirstName, newFriend.FirstName);
        Assert.AreEqual(friend.KnownAs, newFriend.KnownAs);

        Assert.AreEqual(friendJson, newFriendJson);
    }
}
