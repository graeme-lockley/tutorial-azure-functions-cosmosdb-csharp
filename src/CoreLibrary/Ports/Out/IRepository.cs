namespace CoreLibrary.Ports.Out;

using CoreLibrary.Entity;

public interface IRepository
{
    Friend AddFriend(string lastName, string firstName, string? knownAs);
    Friend? GetFriend(string id);
    List<Friend> FindFriendOnLastName(string lastName);
}