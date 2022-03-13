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

    public Friend Get(string id) =>
        repository.GetFriend(id) ?? throw new FriendNotFoundException($"id=${id}");

    public List<Friend> FindOnLastName(string lastName) =>
        repository.FindFriendOnLastName(lastName);
}
