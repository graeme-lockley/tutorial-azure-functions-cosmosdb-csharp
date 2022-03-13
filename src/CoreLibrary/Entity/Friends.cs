namespace CoreLibrary.Entity;

using CoreLibrary.Ports.Out;

public class Friends
{
    private IRepository repository;

    public Friends(IRepository repository)
    {
        this.repository = repository;
    }

    public Task<Friend> AddFriend(string lastName, string firstName, string? knownAs) =>
        repository.AddFriend(lastName, firstName, knownAs);

    public async Task<Friend> Get(string id)
    {
        var friend = await repository.GetFriend(id);

        if (friend == null)
            throw new FriendNotFoundException($"id=${id}");

        return friend;
    }

    public Task<List<Friend>> FindOnLastName(string lastName) =>
        repository.FindFriendOnLastName(lastName);
}
