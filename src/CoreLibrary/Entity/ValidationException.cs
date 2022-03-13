namespace CoreLibrary.Entity;

public class ValidationException : Exception
{
    public ValidationException(string message) : base(message) { }
}
