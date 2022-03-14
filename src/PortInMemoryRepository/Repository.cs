namespace PortInMemoryRepository;

using CoreLibrary.Entity;
using CoreLibrary.Ports.Out;

public class Repository : IRepository
{
    private int IdCounter = 0;
    private List<Friend> Friends = new List<Friend>();

    public Repository()
    {
    }


    public async Task<int> Count() =>
        await Task.Run(() => Friends.Count);

    public async Task Truncate() =>
        await Task.Run(() => Friends.Clear());

    public async Task<Friend> AddFriend(string lastName, string firstName, string? knownAs) =>
        await Task.Run(() =>
        {
            var id = IdCounter;
            var friend = new Friend(id.ToString(), lastName, firstName, knownAs);

            IdCounter += 1;

            Friends.Add(friend);

            return friend;
        });

    public async Task<Friend?> GetFriend(string id) =>
        await Task.Run(() => Friends.Find(p => p.Id == id));

    public async Task<List<Friend>> FindFriendOnLastName(string lastName) =>
        await Task.Run(() => Friends.FindAll(p => p.LastName == lastName));
}
