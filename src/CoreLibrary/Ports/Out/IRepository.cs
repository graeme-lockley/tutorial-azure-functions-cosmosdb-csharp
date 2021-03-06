namespace CoreLibrary.Ports.Out;

using CoreLibrary.Entity;

public interface IRepository
{
    Task<int> Count();

    Task Truncate();
    Task<Friend> AddFriend(string lastName, string firstName, string? knownAs);
    Task<Friend?> GetFriend(string id);
    Task<List<Friend>> FindFriendOnLastName(string lastName);
}
