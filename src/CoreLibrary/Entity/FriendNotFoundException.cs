namespace CoreLibrary.Entity;

public class FriendNotFoundException : Exception
{
    public FriendNotFoundException(string message) : base(message) { }
}
