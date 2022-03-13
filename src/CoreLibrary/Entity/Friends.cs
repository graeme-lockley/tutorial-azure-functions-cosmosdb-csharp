namespace CoreLibrary.Entity;

using CoreLibrary.Ports.Out;

public class Friends
{
    private IRepository repository;

    public Friends(IRepository repository)
    {
        this.repository = repository;
    }

    public Friend AddFriend(string lastName, string firstName, string? knownAs) =>
        repository.AddFriend(lastName, firstName, knownAs);

    public Friend Get(string id)
    {
        var friend = repository.GetFriend(id);

        if (friend == null)
            throw new FriendNotFoundException($"id=${id}");

        return friend;
    }

    public List<Friend> FindOnLastName(string lastName) =>
        repository.FindFriendOnLastName(lastName);
}
