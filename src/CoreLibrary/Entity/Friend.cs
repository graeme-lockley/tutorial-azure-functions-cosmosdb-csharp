namespace CoreLibrary.Entity;

using Newtonsoft.Json;
using System;

public class Friend
{
    [JsonProperty(PropertyName = "id")]
    public string Id { get; set; }
    public string LastName { get; set; }
    public string FirstName { get; set; }
    public string? KnownAs { get; set; }

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

    // The ToString() method is used to format the output, it's used for demo purpose only. It's not required by Azure Cosmos DB
    public override string ToString()
    {
        return JsonConvert.SerializeObject(this);
    }
}