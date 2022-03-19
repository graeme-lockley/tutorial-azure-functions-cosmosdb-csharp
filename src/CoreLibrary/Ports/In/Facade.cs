namespace CoreLibrary.Ports.In;

using CoreLibrary.Entity;
using CoreLibrary.Ports.Out;

public class Facade
{
    private IRepository Repository;

    public Facade(IRepository Repository)
    {
        this.Repository = Repository;
    }


    public Task<Friend> AddFriend(string lastName, string firstName, string? knownAs = null) =>
        new Friends(Repository).AddFriend(lastName, firstName, knownAs);

    public Task<Friend> Get(string id) =>
        new Friends(Repository).Get(id);

    public Task<List<Friend>> FindOnLastName(string lastName) =>
        new Friends(Repository).FindOnLastName(lastName);
}
