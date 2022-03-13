using Newtonsoft.Json;
using System;

using CoreLibrary.Entity;

Console.WriteLine("Hello world");
var friend = new Friend("0", "Lockley", "Graeme", "Lockers");
var friendJson = friend.ToString();
var newFriend = JsonConvert.DeserializeObject<Friend>(friendJson);

Console.WriteLine(friend.ToString());
Console.WriteLine(newFriend.ToString());
