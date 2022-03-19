using CoreLibrary.Ports.In;
using PortCosmosRepository;

var repository = new Repository();
var facade = new Facade(repository);

await facade.AddFriend("Lockley", "Graeme", "Lockers");
await facade.AddFriend("Lockley", "David");

var friends = await facade.FindOnLastName("Lockley");
friends.ForEach(friend => {
    Console.WriteLine($"{friend.LastName}, ${friend.FirstName}");
});
