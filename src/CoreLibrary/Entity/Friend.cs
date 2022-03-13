namespace CoreLibrary.Entity;

using Newtonsoft.Json;
using System;

public class Friend
{
    [JsonProperty(PropertyName = "id")]
    public string Id { get; }
    public string LastName { get; }
    public string FirstName { get; }
    public string? KnownAs { get; }

    public Friend(string Id, string LastName, string FirstName, string? KnownAs)
    {
        if (String.IsNullOrWhiteSpace(Id))
            throw new ValidationException("Friend: Id may not be null or whitespace");

        if (String.IsNullOrWhiteSpace(LastName))
            throw new ValidationException("Friend: LastName may not be null or whitespace");

        if (String.IsNullOrWhiteSpace(FirstName))
            throw new ValidationException("Friend: FirstName may not be null or whitespace");

        if (KnownAs != null && String.IsNullOrWhiteSpace(KnownAs))
            throw new ValidationException("Friend: KnownAs may not be whitespace");

        this.Id = Id;
        this.LastName = LastName;
        this.FirstName = FirstName;
        this.KnownAs = KnownAs;
    }

    public string ToJSON() =>
         JsonConvert.SerializeObject(this);

    public static Friend FromJSON(string friendJson) =>
        JsonConvert.DeserializeObject<Friend>(friendJson)!;
}